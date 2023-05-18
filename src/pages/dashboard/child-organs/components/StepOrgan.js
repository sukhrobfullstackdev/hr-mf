import {Button, Col, Form, Input, InputNumber, Row, Select} from "antd";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import React, {useEffect} from "react";
import useRegion from "../../../../hooks/useRegion";
import useDistrict from "../../../../hooks/useDistrict";
import useCompanyType from "../../../../hooks/useCompanyType";
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

const {Option} = Select;
function StepOrgan(){
    const {stepOrgan = null} = useSelector(s=>s);
    const [form] = Form.useForm();
    const region = useRegion();
    const [district,get,loader] = useDistrict();
    const companyType = useCompanyType();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(stepOrgan){
            get(stepOrgan.province_code);
            form.setFieldsValue({...stepOrgan});
        }
    },[stepOrgan])
    const onChooseRegion = (v)=>{
        const province = region.find(value=> value.id === v);
        get(province.id);
    }
    const onFinish = (v)=>{
        dispatch({
            type: 'stepOrgan',
            payload: v
        });
        dispatch({
            type :'childOrganStep',
            payload: 1
        });
    }
    return(
        <Form
            onFinish={onFinish}
            form={form}
            name="child-organ"
            layout="vertical"
        >
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name="name"
                        label="Tashkilot-korxona nomi (Uz)"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos kiriting'
                            }
                        ]}
                    >
                        <Input placeholder="Tashkilot-korxona nomi (Uz)"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="name_ru"
                        label="Tashkilot-korxona nomi (Ru)"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos kiriting'
                            }
                        ]}
                    >
                        <Input placeholder="Tashkilot-korxona nomi (Ru)"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="name_en"
                        label="Tashkilot-korxona nomi (En)"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos kiriting'
                            }
                        ]}
                    >
                        <Input placeholder="Tashkilot-korxona nomi (En)"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="organization_tin"
                        label="Korxona va tashkilot STIR"
                        rules={[
                            {
                                required: true,
                                message: 'Kiriting!',
                            },
                        ]}
                    >
                        <InputNumber min={100000000} max={999999999} placeholder="STIR (INN)"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="organ_types"
                        label="Turi"
                        rules={[
                            {
                                required: true,
                                message: 'Tanlang!',
                            }
                        ]}
                    >
                        <Select
                            placeholder="Tanlang!"
                        >
                            {
                                companyType.map(item=><Option key={`companyType${item.id}`} value={item.id}>{item.name_uz}</Option> )
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Region"
                        name='province_code'
                        rules={[
                            {
                                required: true,
                                message: 'Tanlang!',
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            hasFeedback
                            placeholder="Tanlang!"
                            onChange={onChooseRegion}
                        >
                            {
                                region.map(item=>{
                                    return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="district_code"
                        label="Tuman"
                        rules={[
                            {
                                required: true,
                                message: 'Tanlang!',
                            }
                        ]}
                    >
                        <Select
                            loading={loader}
                            placeholder="Tanlang!"
                            disabled={!district.length}
                        >
                            {
                                district.map(item=><Option key={`district${item.id}`} value={parseInt(item.id)}>
                                    {
                                        item.name_uz_lat
                                    }
                                </Option>)
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="chapter_code"
                        label="Bo'lim kodi"
                        rules={[
                            {
                                required: true,
                                message: 'Kiriting',
                            }
                        ]}
                    >
                        <InputNumber placeholder="Moliya vazirligi shtatlar jadvali bo'yicha bo'lim kodi"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="department_code"
                        label="Kichik bo'lim kodi"
                        rules={[
                            {
                                required: true,
                                message: 'Kiriting',
                            }
                        ]}
                    >
                        <InputNumber placeholder="Moliya vazirligi shtatlar jadvali bo'yicha kichik bo'lim kodi"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="small_department_code"
                        label="Bob kodi"
                        rules={[
                            {
                                required: true,
                                message: 'Kiriting',
                            }
                        ]}
                    >
                        <InputNumber placeholder="Moliya vazirligi shtatlar jadvali bo'yicha bob kodi"/>
                    </Form.Item>
                </Col>
            </Row>
            <div className="text-right">
                <Link to="/dashboard/child-organs" className="ant-btn ant-btn-link">
                    <IconChevronLeft/> Orqaga qaytish
                </Link>
                <Button type="primary" htmlType="submit">
                    <IconSave/> Saqlash
                </Button>
            </div>
        </Form>
    )
}
export default StepOrgan;