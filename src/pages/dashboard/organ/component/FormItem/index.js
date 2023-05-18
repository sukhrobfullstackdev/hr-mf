import {Col, Form, Input, Row, Select} from "antd";
import useRegion from "../../../../../hooks/useRegion";
import {useEffect, useState} from "react";
import useDistrict from "../../../../../hooks/useDistrict";
import useCompanyType from "../../../../../hooks/useCompanyType";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {GET_ORGAN} from "../../../../../store/types";

const {Option} = Select;
function FormItem({initialValues = {}}){
    const region = useRegion();
    const [district,get,loader] = useDistrict();
    const [organs, getOrgans, organsLoader] = useGetDynamic();
    useEffect(()=>{
        if(!organs.length){
            getOrgans(GET_ORGAN);
        }
    },[]);
    const companyType = useCompanyType();
    const onChooseRegion = (v)=>{
        const province = region.find(value=> value.id === v);
        get(province.id)
    }
    useEffect(()=>{
        if(!district.length){
            get(initialValues.province_code);
        }
    },[initialValues])
    return(
        <Row gutter={16}>
            <Col span={24}>
                <Form.Item
                    label="Tashkilotning to'liq nomi"
                    name='name'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Maxsus korxona"
                    />
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
            <Col span={8}>
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
                    label="Tashkilot bo'ysinuvchi tashkilotni tanlang"
                    name='parent'
                >
                    <Select
                        allowClear
                        hasFeedback
                        loading={organsLoader}
                        placeholder="Tanlang!"
                        showSearch
                        filterOption={
                            (input, option) => {
                                return option.children ? option.children.toLowerCase().indexOf(input.toLowerCase()) > -1 : false
                            }
                        }
                    >
                        {
                            organs.map(item=>{
                                return <Option key={`organ${item.id}`} value={parseInt(item.id)}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="organization_tin"
                    label="Tashkilot INN si"
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting!`,
                        },{
                            max: 9,
                            message: `Max 9 honali son`
                        }
                    ]}
                >
                    <Input
                        type='number'
                        maxLength={9}
                        placeholder="123456789"
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}
export default FormItem;