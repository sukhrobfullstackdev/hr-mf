import {useDispatch, useSelector} from "react-redux";
import useRegion from "../../../../hooks/useRegion";
import useDistrict from "../../../../hooks/useDistrict";
import {Checkbox, Col, Form, Input, message, Radio, Row, Select} from "antd";
import React, {useEffect, useState} from "react";
import SurveyButtons from "../Buttons";
import useCountry from "../../../../hooks/useCountry";
import {useGetDynamic} from "../../../../hooks/useGet";
import {GET_NATIONALITY, GET_ORGAN_FREE} from "../../../../store/types";
import {useForm} from "antd/es/form/Form";

const {Option} = Select;
function StepOne(){
    const [infoSurvey] = Form.useForm();
    const [otherRegion,setOtherRegion] = useState(false);
    const [page,setPage] = useState(1);
    const [pageOrgans,setPageOrgans] = useState([]);
    const dispatch = useDispatch();
    const [country,loader] = useCountry();
    const [nationality,getNationality,loaderNationality] = useGetDynamic();
    const survey = useSelector(s => s.survey || {});
    const current = useSelector(s => s.surveyCurrent || 0);
    const region = useRegion();
    const [district, getDistrict] = useDistrict();
    const [liveDistrict, getLiveDistrict] = useDistrict();
    const [organs,get,organLoaders] = useGetDynamic();
    useEffect(()=>{
        if(Object.keys(survey).length){
            if('birth_city' in survey) {
                getDistrict(survey.birth_city);
            }
            if('live_region' in survey) {
                getLiveDistrict(survey.live_region);
            }
            infoSurvey.setFieldsValue({
                ...survey
            });
        }
    },[survey])
    useEffect(()=>{
        get(GET_ORGAN_FREE,{
            page: page
        });
    },[page]);
    useEffect(()=>{
        if(!nationality.length){
            getNationality(GET_NATIONALITY)
        }
    },[]);
    useEffect(()=>{
        setPageOrgans([...pageOrgans, ...organs]);
    },[organs])
    const onChooseRegion = (v) => {
        getDistrict(v);
    }
    const onChooseLiveRegion = (v)=>{
        getLiveDistrict(v);
    }
    const onFinish = (v) => {
        if(v.organization){
            const value = {
                family_info: [],
                ...survey,
                ...v,
                birth_date: new Date(v.birth_date).toISOString().split('T')[0],
                passport_expire_date: new Date(v.passport_expire_date).toISOString().split('T')[0]
            }
            if(!otherRegion){
                delete value['country'];
            }
            dispatch({
                type: 'survey',
                payload: value
            });
            dispatch({
                type: 'surveyCurrent',
                payload: current + 1
            });
        }else{
            message.error('Tashkilot tanlang!')
        }

    };
    const onChangeOtherRegion = (v)=>{
        setOtherRegion(v.target.checked);
    }
    return (
        <Form
            name="userInfo"
            layout="vertical"
            form={infoSurvey}
            initialValues={{
                organization: '',
                email: '',
                has_name_changed:'',
                birth_village:'',
                academic_degree:'',
                dimploma_number:'',
                conviction:"Yo'q",
                family_conviction:"Yo'q",
                abroad:"Yo'q",
                family_living_abroad:"Yo'q",
                ...survey,
                country: survey?.country?.id
            }}
            onFinish={onFinish}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        label="Murojat etiluvchi korxona, tashkilotni tanlang"
                        name='organization'
                    >
                        <Select
                            showSearch
                            loading={organLoaders}
                            disabled={organLoaders}
                            filterOption={
                                (input, option) => {
                                    return option.children ? option.children.toLowerCase().indexOf(input.toLowerCase()) > - 1 : false
                                }
                            }
                            placeholder="Tashkilot yoki korxona tanlang!"
                        >
                            {
                                pageOrgans.map((item)=>{
                                    return (
                                        <Option value={item.id} key={`organOption${item.id}`}>
                                            {item.name}
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="F.I.Sh."
                        name="full_name"
                        rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input placeholder="F.I.Sh."/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="F.I.Sh. o'zgartirgan bo'lsangiz"
                        name="has_name_changed"
                    >
                        <Input placeholder="F.I.Sh. o'zgartirgan bo'lsangiz"/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Tug'ilgan sana"
                        name="birth_date" rules={[
                        {required: true, message: `Iltimos to'ldiring`,}]}>
                        <Input type="date" placeholder="Tug'ilgan san"/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item
                        label="Boshqa davlatda tug'ilganmisiz?"
                    >
                        <Checkbox
                            onChange={onChangeOtherRegion}
                        >
                            Ha
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
                                    label="Tug'ilgan viloyati"
                                    name="birth_city"
                                    rules={[
                                        {required: true, message: `Iltimos to'ldiring`,}]}>
                                    <Select placeholder="Tug'uilgan viloyat" onChange={onChooseRegion}>
                                        {
                                            region.map(item => {
                                                return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="Tug'ilgan shahar / tuman"
                                    name="birth_district"
                                    rules={[
                                        {required: true, message: `Iltimos to'ldiring`}]}>
                                    <Select
                                        disabled={!district.length}
                                        placeholder="Tug'ilgan shaxar / tuman tanlang">
                                        {
                                            district.map(item => {
                                                return <Option key={`district${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </>
                }
                <Col span={24}>
                    <Form.Item
                        label="Tug'ilgan qishloq"
                        name="birth_village">
                        <Input placeholder="Tug'ilgan qishloq"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Fuqarolingiz"
                        name="citizenship"
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
                </Col>
                <Col span={12}>
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
                <Col span={12}>
                    <Form.Item label="Malumotingiz" name="education" rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input placeholder="Malumotingiz"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Qachon va qaysi o'quv yurtini tugallagansiz"
                        name="education_completed"
                        rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input placeholder ="O'quv davri, o'quv yurti nomi"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Mutaxassisligingiz" name="specialty" rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input placeholder="Mutaxassisligingiz"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Ilmiy darajangiz" name="academic_degree">
                        <Input placeholder="Ilmiy darajangiz"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Diplom va shaxodatnoma raqami" name="dimploma_number">
                        <Input placeholder="Diplom va shaxodatnoma raqami"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Tergov ostida bo'lganmisiz yoki sud javobgarligiga tortilganmisiz" name="conviction">
                        <Input placeholder="Ha / Yo'q"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Yaqin qarindoshlaringiz tergov ostida bo'lganmisiz yoki sud javobgarligiga tortilganmisiz" name="family_conviction">
                        <Input placeholder="Ha / Yo'q"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Chet elda bo'lganmisiz" name="abroad">
                        <Input placeholder="Ha / Yo'q"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Qarindoshlar chet elda yashaydilarmi" name="family_living_abroad">
                        <Input placeholder="Ha / Yo'q"/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Yashash viloyat" name="live_region" rules={[
                        {required: true, message: 'Iltimos kiriting'}]}>
                        <Select placeholder="Yashash viloyat" onChange={onChooseLiveRegion}>
                            {
                                region.map(item => {
                                    return <Option key={`live_region${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Yashash shahar / tuman" name="live_district" rules={[
                        {required: true, message: 'Iltimos kiriting'}]}>
                        <Select
                            disabled={!liveDistrict.length}
                            placeholder="Yashash shahar / tuman"
                        >
                            {
                                liveDistrict.map(item => {
                                    return <Option key={`live_district${item.id}`} value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Yashash ko'cha, uy raqami" name="live_place" rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input placeholder="Ko'cha va uy raqami"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Telefon raqami" name="mob_phone_no" rules={[
                        {
                            required: true, message: `Iltimos to'ldiring`
                        },
                        {
                            pattern: /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/,
                            message: 'Tel. raqam kiriting, misol uchun - 998977777777'
                        },
                        {
                            max: 12,
                            message: "Max. 12 ta raqam"
                        },
                        {
                            min: 12,
                            message: "Min. 12 ta raqam"
                        },
                        ]}>
                        <Input type="number" placeholder="Telefon raqami"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Aloqa uchun email" name="email" rules={[
                        {
                          required: true,
                          message: "Iltimos to'ldiring!"
                        },
                       {
                            type: 'email',
                            message: 'Email kiriting!'
                        }]}>
                        <Input placeholder="Email"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Passport seriyasi va raqami" name="passport_seria" rules={[
                        {required: true, message: 'Please input your passport'},]}>
                        <Input placeholder="AA 0000000"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Kim tomonidan berilgan" name="passport_giver" rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input placeholder="IIV bo'lim nomi yoki raqami"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Amal qilish sanasi" name="passport_expire_date" rules={[
                        {required: true, message: `Iltimos to'ldiring`}]}>
                        <Input type='date' placeholder="Amal qilish sanasi"/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="PNFL raqamingiz" name="pinfl" rules={[
                        {
                            required: true, message: `Iltimos to'ldiring`,
                        },{
                            len: 14,
                            message: '14 ta raqam'
                        }
                        ]}>
                        <Input type="number" placeholder="PNFL raqam"/>
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
            </Row>
            <SurveyButtons/>
        </Form>
    );
}
export default StepOne;