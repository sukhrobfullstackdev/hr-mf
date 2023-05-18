import useGet, {useGetDynamic} from "../../../../hooks/useGet";
import {useLayoutEffect} from "react";
import {GET_EDUCATION} from "../../../../store/types";
import {Col, Row, Skeleton} from "antd";
import NoData from "../../../../components/NoData";
import Small from "../../../../styleComponents/Small";

function UserEducation(){
    const [data,get,loader] = useGetDynamic()
    useLayoutEffect(()=>{
        get(GET_EDUCATION);
    },[])
    return  <div className="mt-4">
                <h2 className="mb-3">
                    <strong>Ta'limga oid ma'lumotlar</strong>
                </h2>
                {
                    loader ?
                        <Skeleton active/>
                        :
                        Object.keys(data).length ?
                            <Row>
                                {
                                    data.map(item=>{
                                        return  <Col key={`diplomNumber${item.id}`} span={12}>
                                                    <div className="border-bottom mb-3">
                                                        <Small className="text-muted">{item.degree_name}</Small>
                                                        <Small className="pt-1">
                                                            <strong>
                                                                {
                                                                    item.institution_name
                                                                }
                                                            </strong>
                                                        </Small>
                                                    </div>
                                                    <div className="border-bottom mb-3">
                                                        <Small className="text-muted">Olingan sanasi</Small>
                                                        <Small className="pt-1">
                                                            <strong>
                                                                {
                                                                    new Date(item.diploma_given_date).toLocaleDateString()
                                                                }
                                                            </strong>
                                                        </Small>
                                                    </div>
                                                    <div className="border-bottom mb-3">
                                                        <Small className="text-muted">Seriasi va raqami</Small>
                                                        <Small className="pt-1">
                                                            <strong>
                                                                {
                                                                    item.diploma_serial
                                                                }-
                                                                {
                                                                    item.diploma_number
                                                                }
                                                            </strong>
                                                        </Small>
                                                    </div>
                                                </Col>
                                    })
                                }
                            </Row>:
                            <NoData size='sm' message="Ma'lumot mavjud emas!"/>
                }

            </div>
}
export default UserEducation;