import {Button, Checkbox, Col, DatePicker, Form, Input, Radio, Row, Select} from "antd";
import {useEffect, useState} from "react";
import useRegion from "../../../../../hooks/useRegion";
import useDistrict from "../../../../../hooks/useDistrict";
import {GET_NATIONALITY} from "../../../../../store/types";
import {useGetDynamic} from "../../../../../hooks/useGet";
import useCountry from "../../../../../hooks/useCountry";
import StaffDepartmentPosition from "../StaffDepartmentPosition";
import {IconPlus, IconTrash} from "../../../../../components/Icon";

const {Option} = Select;

function FormItems({value = {}}) {
    const [nationality,getNationality,loaderNationality] = useGetDynamic();
    const [country,loader] = useCountry();
    const [otherRegion,setOtherRegion] = useState(false);
    const region = useRegion();
    const [district,getDistrict,districtLoader] = useDistrict();
    const [birthDistrict,getBirthDistrict,birthLoaderDistrict] = useDistrict();
    useEffect(()=>{
        if('birth_city' in value && value.birth_city){
            getBirthDistrict(value.birth_city);
        }
        if('province_code' in value && value.province_code){
            getDistrict(value.province_code);
        }
    },[value]);
    useEffect(()=>{
        if(!nationality.length){
            getNationality(GET_NATIONALITY)
        }
    },[]);
    const onChooseRegion = (v)=>{
        getDistrict(v);
    }
    const onChooseBirthRegion=(v)=>{
        getBirthDistrict(v)
    }
    const onChangeOtherRegion = (v)=>{
        setOtherRegion(v.target.checked);
    }
    return (
        <Row gutter={16}>
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
                <Form.Item label="Millatingiz" name="nationality" rules={[
                    {required: true, message: `Iltimos to'ldiring`}]}>
                    <Select
                        placeholder="Iltimos tanlang!"
                    >
                        {
                            nationality.map(item=>{
                                return(
                                    <Option key={`nationanity${item.id}`} value={item.id}>
                                        {item.name}
                                    </Option>
                                )
                            })
                        }
                    </Select>
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
                        // required: true,
                        // message: "Iltimos qatorni to'ldiring!"
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
                        // required: true,
                        // message: "Iltimos qatorni to'ldiring!"
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
                        // required: true,
                        // message: "Iltimos qatorni to'ldiring!"
                    }, {
                        max: 3,
                        message: 'Max. 3 ta raqam'
                    }]}
                >
                    <Input type='number' placeholder="Hodimning ish (ichki) telefon raqami: 123"/>
                </Form.Item>
            </Col>
            <Col span={6}>
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
            <Col span={6}>
                <Form.Item
                    label="Boshqa davlatda tug'ilganmi?"
                >
                    <Checkbox
                        onChange={onChangeOtherRegion}
                    >
                        Ha / Yo'q
                    </Checkbox>
                </Form.Item>
            </Col>
            {
                otherRegion ?
                    <Col span={12}>
                        <Form.Item
                            label="Tug'ilgan davlati"
                            name="country"
                            rules={[
                                {
                                    required: true,
                                    message: "Iltimos tanlang!"
                                }
                            ]}>
                            <Select placeholder="Iltimos tanlang">
                                {
                                    country.map(item => {
                                        return <Option key={`country${item.id}`} value={parseInt(item.id)}>{item.name_uz}</Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>:
                    <>
                        <Col span={6}>
                            <Form.Item
                                label="Hodim tug'ilgan regioni"
                                name='birth_city'
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
                                    onChange={onChooseBirthRegion}
                                >
                                    {
                                        region.map(item=>{
                                            return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item shouldUpdate
                                       name="birth_district"
                                       label="Hodim tug'ilgan tumani"
                                       rules={[
                                           {
                                               required: true,
                                               message: 'Tanlang!',
                                           }
                                       ]}
                            >
                                <Select
                                    placeholder="Tanlang!"
                                    loading={birthLoaderDistrict}
                                    disabled={!birthDistrict.length}
                                >
                                    {
                                        birthDistrict.map(item=>{
                                            return <Option key={`district${item.id}`} value={parseInt(item.id)}>
                                                {
                                                    item.name_uz_lat
                                                }
                                            </Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </>

            }
            <Col span={8}>
                <Form.Item
                    label="Hodim yashash regioni"
                    name='province_code'
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: 'Tanlang!',
                    //     }
                    // ]}
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
                    label="Hodim yashash tumani"
                    name='district_code'
                    // rules={[
                    //     {
                    //         required: true,
                    //         message: 'Tanlang!',
                    //     }
                    // ]}
                >
                    <Select
                        allowClear
                        placeholder="Tanlang!"
                        disabled={!district.length}
                        loading={districtLoader}
                    >
                        {
                            district.map(item=>{
                                return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name='live_place'
                    label="Hodimning yashash manzili"
                    // rules={[{
                    //     required: true,
                    //     message: "Iltimos to'ldiring"
                    // }]}
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
                        <Radio value={2}>Ayol</Radio>
                    </Radio.Group>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    valuePropName='checked'
                    name="is_approver"
                    label="Xujjatlarni kelishish"
                >
                    <Checkbox>
                        Xujjatlarni kelishik imkoniyati
                    </Checkbox>
                </Form.Item>
            </Col>
            <Col span={24}>
                <h2>
                    Lavozim bo'yicha ma'lumotlar
                </h2>
                <Form.List name="jobs">
                    {(fields, {add, remove}) => {
                        return(
                            <>
                                {fields.map(({key, name, ...restField}) =>{
                                    return(
                                        <div key={`formListByStaff${key}`}>
                                            <StaffDepartmentPosition name={name} restField={restField} value={'jobs' in value && value.jobs.length ? value.jobs[name] : {}}/>
                                            <div className="text-right">
                                                <Button type="danger" size='small' onClick={()=>remove(name)}>
                                                    <IconTrash/> O'chirish
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                                <Form.Item className="mt-3">
                                    <Button type="dashed" className="dashed" onClick={() => add()} block icon={<IconPlus/>}>
                                        Maydon qo'shish
                                    </Button>
                                </Form.Item>
                            </>
                        )
                    }}
                </Form.List>
            </Col>
        </Row>
    )
}

export default FormItems;
