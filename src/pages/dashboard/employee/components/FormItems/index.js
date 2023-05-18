import {Col, DatePicker, Form, Input, Radio, Row, Select, TreeSelect} from "antd";
import {useEffect, useState} from "react";
import useRegion from "../../../../../hooks/useRegion";
import useDistrict from "../../../../../hooks/useDistrict";
import useTree from "../../../../../hooks/useTree";
import Req from "../../../../../store/api";
import {GET_ORGAN, GET_POSITIONS_BY_DEPARTMENT} from "../../../../../store/types";
import {useDispatch} from "react-redux";
import useGet from "../../../../../hooks/useGet";

const {Option} = Select;

function FormItems({value = {}}) {
    const [regionId,setRegionId] = useState(null);
    const organ = useGet(GET_ORGAN);
    const region = useRegion();
    const [district,get,loader] = useDistrict();
    const onChooseRegion = (v)=>{
        const province = region.find(value=> value.id === v);
        get(province.id)
    }
    useEffect(()=>{
        if(Object.keys(value).length){
            // get(value.)
        }
    },[]);
    return <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name='full_name'
                        label="Hodimning familiya ismi sharifi"
                        rules={[{
                            required: true,
                            message: "Iltimos qatorni to'ldiring!"
                        }]}
                    >
                        <Input placeholder="Hodim F.I.Sh."/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='pinfl'
                        label="Hodimning PNFL raqmi"
                        rules={[{
                            required: true,
                            message: "Iltimos qatorni to'ldiring!"
                        }, {
                            max: 14,
                            message: "Max 14 ta raqam!"
                        }, {
                            min: 14,
                            message: "Min 14 ta raqam!"
                        }]}
                    >
                        <Input value={value.birth_date} type='number' placeholder="Hodim PNFL raqami"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='passport_seria'
                        label="Hodimning passport seriasi va raqami"
                        rules={[{
                            required: true,
                            message: "Iltimos qatorni to'ldiring!"
                        }, {
                            max: 10,
                            message: "Max 10 ta belgi!"
                        }]}
                    >
                        <Input placeholder="Hodimning passport seriasi va raqami"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='email'
                        label="Hodimning elektron pochta manzili"
                        rules={[{
                            required: true,
                            message: "Iltimos qatorni to'ldiring!"
                        }, {
                            type: "email",
                            message: "Iltimos email kiriting!"
                        }]}
                    >
                        <Input placeholder="Hodimning elektron pochta manzili"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='mob_phone_no'
                        label="Hodimning telefon raqami"
                        rules={[{
                            required: true,
                            message: "Iltimos qatorni to'ldiring!"
                        }]}
                    >
                        <Input type='number' placeholder="Hodim telefon raqami: 99897 777 77 77"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='home_phone'
                        label="Hodimning ish (ichki) telefon raqami"
                        rules={[{
                            required: true,
                            message: "Iltimos qatorni to'ldiring!"
                        }, {
                            max: 3,
                            message: 'Max. 3 ta raqam'
                        }]}
                    >
                        <Input type='number' placeholder="Hodimning ish (ichki) telefon raqami: 123"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name='birth_date'
                        label="Hodimning tug'ilgan sanasi"
                        rules={ [
                            {
                                type: 'object',
                                required: true,
                                message: 'Iltimos sana tanlang!',
                            },
                        ]}
                    >
                        <DatePicker placeholder="Hodim tug'ilgan sanasi!"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="Hodim yashash regioni"
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
                        label="Hodim yashash tumani"
                        rules={[
                            {
                                required: true,
                                message: 'Tanlang!',
                            }
                        ]}
                    >
                        <Select
                            placeholder="Tanlang!"
                            disabled={!district.length}
                            loading={loader}
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
                        name='live_place'
                        label="Hodimning yashash manzili"
                        rules={[{
                            required: true,
                            message: "Iltimos to'ldiring"
                        }]}
                    >
                        <Input placeholder="Hodimgning yashash manzili: Ko'cha va uy raqami"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="gender"
                        label="Jinsi"
                        rules={[{
                            required: true,
                            message: 'Iltimos tanlang!'
                        }]}
                    >
                        <Radio.Group>
                            <Radio value={1}>Erkak</Radio>
                            <Radio value={2}>Aylol</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="organizations"
                        label="Tashkilotni tanlang"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang!'
                            }
                        ]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            hasFeedback
                            showSearch
                            filterOption={
                                (input, option) => {
                                    return  option.children ? option.children
                                            .toString()
                                            .toLowerCase()
                                            .includes(input.toLowerCase()) : -1
                                }
                            }
                            placeholder="Tanlang!"
                        >
                            {
                                organ.map(item=>{
                                    return <Option key={`position${item.id}`} value={item.id}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name="role"
                        label="Hodim rolini tanlang"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang!'
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            hasFeedback
                            showSearch
                            placeholder="Tanlang!"
                        >
                            <Option value={'HR'}>HR</Option>
                            <Option value={'HO'}>HO</Option>
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
}

export default FormItems;