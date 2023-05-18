import {useParams} from "react-router-dom";
import {useGetDynamic} from "../../hooks/useGet";
import {useEffect, useLayoutEffect, useRef} from "react";
import {GET_COMMANDS_TYPES, GET_ORDER_BY_CODE} from "../../store/types";
import Container from "../../components/Container";
import {Col, Row, Skeleton} from "antd";
import Blank from "../../components/Blank";
import NoData from "../../components/NoData";
import Small from "../../styleComponents/Small";
import StatusBadge from "../../styleComponents/StatusBadge";
import {IconDownload} from "../../components/Icon";
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image'
import InnerHtml from "../../components/InnerHtml";

function OrderOpenUrl(){
    const {orderCode} = useParams();
    const [order,get,loader] = useGetDynamic();
    const [type, getType, typeLoader] = useGetDynamic();
    useLayoutEffect(() => {
        if (!type.length) {
            getType(GET_COMMANDS_TYPES);
        }
    }, []);
    useLayoutEffect(()=>{
        get(`${GET_ORDER_BY_CODE}${orderCode}/`);
    },[orderCode]);
    return(
        <Container className="py-5">
            {
                loader ?
                    <Skeleton active/>:
                    <Blank>
                        {
                            Object.keys(order).length ?
                                <>
                                    <Row className="py-4">
                                        <Col span={8}>
                                           <span className="small text-muted">
                                               Buyruq raqami
                                           </span>
                                            <p>
                                                {order.number ? <strong>{order.number}</strong> : <span>Mavjud emas!</span>}
                                            </p>
                                        </Col>
                                        <Col span={8} className="text-center">
                                            <span className="small text-muted">
                                                Buyruq turi
                                           </span>
                                            <p>
                                                {type && type.find(v => v.id === order?.type)?.title}
                                            </p>
                                        </Col>
                                        <Col span={8} className="text-right">
                                            <span className="small text-muted">
                                                Sana
                                            </span>
                                            <p>
                                                {new Date(order.confirmed_date).toLocaleDateString()}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        {order?.texts.map((item, i) => {
                                            return (<Col span={24} className="mt-4">
                                                <div className="text-center mb-2">
                                                    <strong> &sect;-{i + 1}</strong>
                                                </div>
                                                <InnerHtml content={item.text}/>
                                                <Small className="my-2" size={12}>
                                                    <Row justify="space-between">
                                                        <Col span={12}>
                                                            <strong>Asos</strong>: {item.cause}
                                                        </Col>
                                                        {
                                                            item.staff ?
                                                                (
                                                                    <Col span={12} className="text-right">
                                                                        <strong>Hodim</strong>: {item.staff.full_name}
                                                                    </Col>
                                                                ) : ""}
                                                    </Row>
                                                </Small>
                                            </Col>)
                                        })}
                                    </Row>
                                    <Row>
                                        <Col span={24} className="border-top">
                                            {
                                                order.approvals.map(user=>{
                                                    return (
                                                        <div>
                                                            <span className="pr-3">{user.full_name || user.user}</span>
                                                            <StatusBadge status={user.approved}/>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </Col>
                                    </Row>
                                    <p className="text-right my-4">
                                        <a href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}${order.pdf_file}`} target="_blank">
                                            <IconDownload/> Pdf yuklab olish
                                        </a>
                                    </p>
                                </> :
                                <div className="py-5">
                                    <NoData size="sm"/>
                                </div>
                        }
                    </Blank>
            }
        </Container>
    )
}
export default OrderOpenUrl;