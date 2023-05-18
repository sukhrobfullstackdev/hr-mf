import {useGetDynamic} from "../../hooks/useGet";
import {useEffect, useState} from "react";
import {Col, Image, Progress, Row, Skeleton} from "antd";
import {GET_CERTIFICATE} from "../../store/types";
import {useParams} from "react-router-dom";
import Container from "../../components/Container";
import NoData from "../../components/NoData";
import Small from "../../styleComponents/Small";
import Style from "styled-components";

function Certificate(){
    const [data,get,loader] = useGetDynamic();
    const {id} = useParams();
    useEffect(()=>{
        get(`${GET_CERTIFICATE}detail/${id}/`);
    },[]);
    return(
        <div>
            {
                loader ?
                    <Skeleton active/>:
                    <Container className="py-5">
                        <Identification data={Array.isArray(data) ? {} : data}/>
                    </Container>
            }
        </div>
    )
}
function Identification({data = null}){
    const {id} = useParams();
    return(
        data && Object.keys(data).length ?
            <>
                <Image
                    width={`100%`}
                    src={`${process.env.REACT_APP_SERVER_URL}/cert-service/get-cert-image/${id}`}
                    placeholder={
                        <Image
                            preview={false}
                            src={`${process.env.REACT_APP_SERVER_URL}/cert-service/get-cert-image/${id}`}
                            width={`100%`}
                        />
                    }
                />
                <Row className="mt-3">
                    <Col span={24}>
                        <div className="mb-2">
                            <Small className="text-muted">
                                <strong>Bo'lim nomi</strong>
                            </Small>
                            {data.organization.department}
                        </div>
                        <div className="mb-2">
                            <Small className="text-muted">
                                <strong>Lavozimi</strong>
                            </Small>
                            {data.user.position_uz}
                        </div>
                        <div className="mb-2">
                            <Small className="text-muted">
                                <strong>Imzolagan</strong>
                            </Small>
                            {data.organization.headman}
                        </div>
                    </Col>
                    <Col span={24} className="mt-3">
                        <IdintificationProgrees givinDate={data?.given_date} dateOff={data?.dateof_issue}/>
                    </Col>
                    {
                        data.archived !== 'false' ?
                            <IsArchived>
                                <h1>
                                    Amal qilish muddati tugagan yoki bekor qilingan!
                                </h1>
                            </IsArchived>:''
                    }
                </Row>
            </>
            :
            <NoData size="sm"/>
    )
}
const IdintificationProgrees = ({dateOff = null, givinDate = null,})=>{
    const [diffDate,setDiffDate] = useState(0);
    const [diffDNow,setDNow] = useState();
    useEffect(()=>{
        if(dateOff){
            const d = new Date(dateOff).getTime();
            const eD = new Date(givinDate).getTime();
            const seconds = (d - eD) / 1000;
            const diffDN = (d - new Date(Date.now()).getTime()) / 1000;
            setDNow(parseInt(diffDN / 60 / 60 / 24));
            setDiffDate(parseInt(seconds / 60 / 60 / 24));
        }
    },[]);
    return(
        <div>
            <Row>
                <Col span={12}>
                    <p className="mb-0">
                        {dateOff}
                    </p>
                    <Small className="text-muted">
                        Amal qilish muddati
                    </Small>
                </Col>
                <Col span={12} className="text-right">
                    <p className="mb-0">
                        {diffDNow} kunda
                    </p>
                    <Small className="text-muted">
                        Amal qilish muddati tugaydi
                    </Small>
                </Col>
            </Row>
            <Progress
                strokeColor={{
                    '100%': parseInt(((diffDate - diffDNow) * 100) / diffDate) < 50 ? '#2842C8' :
                        parseInt(((diffDate- diffDNow) * 100) / diffDate) < 75 ? '#f48924' : 'rgb(222,81,81)',
                    '0%': '#00A389',
                }}
                percent={((diffDate - diffDNow) * 100) / diffDate}
                showInfo={false}
            />
            <p className="mb-0 mt-2">
                {givinDate ? new Date(givinDate).toLocaleDateString() : '-'}
            </p>
            <Small className="text-muted">
                Berilgan sana
            </Small>
        </div>
    )
}
const IsArchived = Style.div`
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    top:0;
    background-color: rgba(255,255,255,0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
`
export default Certificate;