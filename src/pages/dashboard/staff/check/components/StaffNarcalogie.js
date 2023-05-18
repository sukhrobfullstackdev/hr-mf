import {useEffect, useState} from "react";
import {Button, Col, Form, InputNumber, Row, Skeleton} from "antd";
import usePost from "../../../../../hooks/usePost";
import {IconSearch} from "../../../../../components/Icon";
import {CHECK_STAFF_NOROCLOGIE} from "../../../../../store/types";
import NoData from "../../../../../components/NoData";
import Small from "../../../../../styleComponents/Small";

function StaffNarcologie(){
    const [post,loader,res] = usePost(false);
    const [data,setData] = useState(null);
    const onSearch = (v)=>{
        post(CHECK_STAFF_NOROCLOGIE,v);
    }
    useEffect(()=>{
        if(res){
            setData(res.data.data);
        }
    },[res])
    return(
        <div>
            <Form
                name="narcologieForm"
                onFinish={onSearch}
                layout='horizontal'
            >
                <Row gutter={16} justify="end">
                    <Col>
                        <Form.Item
                            name='pinfl'
                            label="Hodim yoki fuqaro PINFL ni kiriting"
                            rules={[
                                {
                                    required: true,
                                    message: 'Iltimos kiriting!'
                                }
                            ]}
                        >
                            <InputNumber max={99999999999999} min={10000000000000} placeholder='PINFL kiriting'/>
                        </Form.Item>
                    </Col>
                    <Col>
                        <Button type="primary" htmlType="submit">
                            <IconSearch/> Qidiruv
                        </Button>
                    </Col>
                </Row>
            </Form>
            {
                loader ?
                    <Skeleton active/>:
                    data && Object.keys(data).length && 'object' in data ?
                        <>
                            <Row className="mb-3" gutter={15}>
                                <Col span={3}>
                                    <strong>{data.object.surname} {data.object.name} {data.object.middleName}</strong>
                                    <Small className={"text-muted"}>Hodim F.I.Sh.</Small>
                                </Col>
                                <Col span={4}>
                                    <strong>{data.object.pin}</strong>
                                    <Small className={"text-muted"}>PINFL</Small>
                                </Col>
                                <Col span={4}>
                                    <strong>{data.object.passportNo}</strong>
                                    <Small className={"text-muted"}>Pasport raqami</Small>
                                </Col>
                                <Col span={4}>
                                    <strong>{data.object.birthDate}</strong>
                                    <Small className={"text-muted"}>Tug'ilgan sanasi</Small>
                                </Col>
                                <Col span={4}>
                                    <strong>{data.object.gender === 1 ? 'Erkak' : 'Ayol'}</strong>
                                    <Small className={"text-muted"}>Jinsi</Small>
                                </Col>
                            </Row>
                            <Row gutter={15}>
                                <Col span={6}>
                                    <h4>Birinchi ro'yxatga qo'yilish tarixi</h4>
                                    <Row>
                                        <Col span={6}>
                                            <strong>{data.object.createdBy.medOrg.name}</strong>
                                            <Small className={"text-muted"}>Tashkilot nomi</Small>
                                        </Col>
                                        <Col span={6}>
                                            <strong>{data.object.createdBy.fullName}</strong>
                                            <Small className={"text-muted"}>Masul hodim F.I.Sh.</Small>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={6}>
                                    <h4>Oxirgi o'zgarish</h4>
                                    <Row>
                                        <Col span={6}>
                                            <strong>{data.object.updatedBy.medOrg.name}</strong>
                                            <Small className={"text-muted"}>Tashkilot nomi</Small>
                                        </Col>
                                        <Col span={6}>
                                            <strong>{data.object.updatedBy.fullName}</strong>
                                            <Small className={"text-muted"}>Masul hodim F.I.Sh.</Small>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </>:
                        <NoData message="Hodim haqida ma'lumot mavjud emas!"/>
            }
        </div>
    )
}
export default StaffNarcologie;