import {Link, useParams} from "react-router-dom";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect} from "react";
import {GET_APPEAL_HR} from "../../../../store/types";
import {Card, Col, Row, Skeleton} from "antd";
import {IconChevronLeft} from "../../../../components/Icon";
import Container from "../../../../components/Container";

function CabinetAppealView(){
    const {id} = useParams();
    const [appeal,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(`${GET_APPEAL_HR}${id}`)
    },[])
    return(
        <Container className="py-5">
            <Card>
                {
                    loader ?
                        <Loader/>:
                        <>
                           <Row justify={"center"} className="mt-5">
                                <Col span={24}>
                                    <Row justify="end" className="text-justify">
                                        <Col span={6}>
                                            {
                                                appeal?.top
                                            }
                                        </Col>
                                    </Row>
                                    <h1 className="text-center my-4">
                                        {appeal?.middle}
                                    </h1>
                                    {
                                        appeal?.text
                                    }
                                </Col>
                            </Row>
                           <Row justify={"center"} className="mt-5">
                                <Col span={24}>
                                    <Row>
                                        <Col span={12}>
                                            Hodim: <strong>{appeal?.user.full_name}</strong>
                                        </Col>
                                        <Col span={12} className="text-right">
                                            Sana: <strong>{'created_date' in appeal ? new Date(appeal.created_date).toLocaleDateString():""}</strong>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                }
                <div className="mt-3 text-right">
                    <Link to="/cabinet/appeals">
                        <IconChevronLeft/> Arizalar
                    </Link>
                </div>
            </Card>
        </Container>
    )
}
const Loader = ()=>{
    return(
        <Row gutter={16}>
           <Col span={8}>
               <Skeleton active/>
           </Col>
           <Col span={8}>
               <Skeleton active/>
           </Col>
           <Col span={8}>
               <Skeleton active/>
           </Col>
        </Row>
    )
}
export default CabinetAppealView;