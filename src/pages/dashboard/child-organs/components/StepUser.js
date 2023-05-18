import {Button, Col, DatePicker, Form, Input, Radio, Row, Select,message} from "antd";
import React, {useEffect} from "react";
import {IconChevronLeft, IconSave, IconTrash} from "../../../../components/Icon";
import {PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import useRegion from "../../../../hooks/useRegion";
import useDistrict from "../../../../hooks/useDistrict";
import usePost from "../../../../hooks/usePost";
import {ADD_ORGAN_CHILDREN} from "../../../../store/types";
import {useNavigate} from "react-router-dom";
import moment from "moment";

const {Option} = Select;

function StepUser() {
    const {stepUsers = null,stepOrgan} = useSelector(s=>s);
    const [post,loader] = usePost();
    const region = useRegion();
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onBack = () => {
        dispatch({
            type: 'childOrganStep',
            payload: 0
        })
    }
    const onFinish = (v) => {
        if(stepOrgan){
            const users = v.users.map(v=>{
                return {
                    ...v,
                    birth_date: moment(v.birth_date).format('YYYY-MM-DD')
                }
            })
            post(ADD_ORGAN_CHILDREN,{
                ...stepOrgan,
                users: users
            },()=>{
                dispatch({
                    type: 'stepOrgan',
                    payload: null
                });
                dispatch({
                    type: 'childOrganStep',
                    payload: 0
                });
                dispatch({
                    type: 'stepUsers',
                    payload: null
                })
                navigate("/dashboard/child-organs");
            });
        }else{
            message.error(`Tashilot ma'lumotlari kiritilmagan!`);
            dispatch({
                type: 'childOrganStep',
                payload: 0
            })
        }
    }
    return (
        <div>
            <h4 className="mb-0">
                <strong>Tashkilot uchun raxbar va kadrlar bo'limi hodimini qo'shish</strong>
            </h4>
            <p className="text-muted small mb-2">
                Tashkilot-korxona uchun raxbar va min. 1 ta korxona kadrlar bo'limi hodimini qo'shishingiz mumkin. Max 1
                ta raxbar va bir nechta hodimlar bo'limi hodimi bo'lishi
                mumkin
            </p>
            <Form
                onFinish={onFinish}
                form={form}
                name="child-organ"
                layout="vertical"
                initialValues={stepUsers}
            >
                <Form.List initialValue={stepUsers} name="users">
                    {(fields, {add, remove}) => {
                        return (
                            <>
                                {fields.map(({key, name, ...restField}) => {
                                    return (
                                        (
                                            <div key={key}>
                                                <Row gutter={16}>
                                                    <Col span={24}>
                                                        <Form.Item
                                                            name={[name, 'full_name']}
                                                            label="Hodimning familiya ismi sharifi"
                                                            rules={[{
                                                                required: true,
                                                                message: "Iltimos qatorni to'ldiring!"
                                                            }]}
                                                            {...restField}
                                                        >
                                                            <Input placeholder="Hodim F.I.Sh."/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'pinfl']}
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
                                                            {...restField}
                                                        >
                                                            <Input type='number' placeholder="Hodim PNFL raqami"/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'passport_seria']}
                                                            label="Hodimning passport seriasi va raqami"
                                                            rules={[{
                                                                required: true,
                                                                message: "Iltimos qatorni to'ldiring!"
                                                            }, {
                                                                max: 10,
                                                                message: "Max 10 ta belgi!"
                                                            }]}
                                                            {...restField}
                                                        >
                                                            <Input placeholder="Hodimning passport seriasi va raqami"/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'email']}
                                                            label="Hodimning elektron pochta manzili"
                                                            rules={[{
                                                                required: true,
                                                                message: "Iltimos qatorni to'ldiring!"
                                                            }, {
                                                                type: "email",
                                                                message: "Iltimos email kiriting!"
                                                            }]}
                                                            {...restField}
                                                        >
                                                            <Input placeholder="Hodimning elektron pochta manzili"/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'mob_phone_no']}
                                                            label="Hodimning telefon raqami"
                                                            rules={[{
                                                                required: true,
                                                                message: "Iltimos qatorni to'ldiring!"
                                                            }]}
                                                            {...restField}
                                                        >
                                                            <Input type='number'
                                                                   placeholder="Hodim telefon raqami: 99897 777 77 77"/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'home_phone']}
                                                            {...restField}
                                                            label="Hodimning ish (ichki) telefon raqami"
                                                            rules={[{
                                                                required: true,
                                                                message: "Iltimos qatorni to'ldiring!"
                                                            }, {
                                                                max: 3,
                                                                message: 'Max. 3 ta raqam'
                                                            }]}
                                                        >
                                                            <Input type='number'
                                                                   placeholder="Hodimning ish (ichki) telefon raqami: 123"/>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'birth_date']}
                                                            {...restField}
                                                            label="Hodimning tug'ilgan sanasi"
                                                            rules={[
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
                                                    <ProvinceCode value={stepUsers.length ? parseInt(stepUsers[key]?.province_code) : ''} name={name} restField={restField} region={region}/>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'gender']}
                                                            label="Jinsi"
                                                            rules={[{
                                                                required: true,
                                                                message: 'Iltimos tanlang!'
                                                            }]}
                                                            {...restField}
                                                        >
                                                            <Radio.Group>
                                                                <Radio value={1}>Erkak</Radio>
                                                                <Radio value={2}>Aylol</Radio>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            name={[name, 'role']}
                                                            label="Hodim rolini tanlang"
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: 'Iltimos tanlang!'
                                                                }
                                                            ]}
                                                            {...restField}
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
                                                <div className="text-right mb-3">
                                                    <Button type="danger" size='small' onClick={() => remove(name)}>
                                                        <IconTrash/> O'chirish
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    )
                                })}
                                <Form.Item>
                                    <Button type="dashed" className="dashed" onClick={() => add()} block
                                            icon={<PlusOutlined/>}>
                                        Maydon qo'shish
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
                <div className="text-right mb-3">
                    <Button type="link" onClick={onBack}>
                        <IconChevronLeft/> 1 - qadamga qaytish
                    </Button>
                    <Button htmlType="submit" type="primary">
                        <IconSave/> Saqlash
                    </Button>
                </div>
            </Form>
        </div>
    )
}

const ProvinceCode = ({region = [], name, restField,value}) => {
    const [district, get, loader] = useDistrict();
    useEffect(()=>{
        console.log(value);
        if(value && region.length){
            const province = region.find(v => {
                return v.province_code == value
            });
            get(province.id);
        }
    },[region])
    const onChooseRegion = (v) => {
        const province = region.find(value => value.id === v);
        get(province.id);
    }
    return (
        <>
            <Col span={8}>
                <Form.Item
                    label="Tug'ilgan joyi"
                    name={[name,'birth_city']}
                    rules={[
                        {
                            required: true,
                            message: 'Tanlang!',
                        }
                    ]}
                    {...restField}
                >
                    <Select
                        allowClear
                        hasFeedback
                        placeholder="Tanlang!"
                    >
                        {
                            region.map(item=>{
                                return <Option key={`region${item.id}`} value={item.province_code}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Hodim yashash regioni"
                    name={[name, 'province_code']}
                    {...restField}
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
                            region.map(item => {
                                return <Option key={`region${item.id}`}
                                               value={item.province_code}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name={[name, 'district_code']}
                    label="Hodim yashash tumani"
                    {...restField}
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
                            district.map(item => <Option key={`district${item.id}`} value={item.district_code}>
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
                    name={[name, 'live_place']}
                    label="Hodimning yashash manzili"
                    {...restField}
                    rules={[{
                        required: true,
                        message: "Iltimos to'ldiring"
                    }]}
                >
                    <Input placeholder="Hodimgning yashash manzili: Ko'cha va uy raqami"/>
                </Form.Item>
            </Col>
        </>
    )
}
export default StepUser;