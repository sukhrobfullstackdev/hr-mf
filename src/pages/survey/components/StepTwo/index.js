import {useDispatch, useSelector} from "react-redux";
import useRegion from "../../../../hooks/useRegion";
import useDistrict from "../../../../hooks/useDistrict";
import {Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import React, {useEffect, useMemo, useState} from "react";
import SurveyButtons from "../Buttons";
import {IconTrash} from "../../../../components/Icon";
import usePost from "../../../../hooks/usePost";
import {GET_COUNTRY, REMOVER_SURVEY_ACTIVITY, REMOVER_SURVEY_FAMILY_INFO} from "../../../../store/types";
import Req from "../../../../store/api";
import useCountry from "../../../../hooks/useCountry";
import {useGetDynamic} from "../../../../hooks/useGet";

const {Option} = Select;
function StepTwo() {
    const dispatch = useDispatch()
    const [loader,setLoader] = useState(false);
    const survey = useSelector(s => s.survey || {family_info: []})
    const current = useSelector(s => s.surveyCurrent || 0);
    const region = useRegion();
    const onFinish = (v) => {
        if(v.family_info && v.family_info.length){
            v.family_info = v.family_info.map(item => {
                return {
                    ...item,
                    dead_year: item.dead_year ? parseInt(new Date(item.dead_year).getFullYear()) : null,
                    birth_date: new Date(item.birth_date).toISOString().split('T')[0]
                }
            });
            const value = {
                activity: [],
                ...survey,
                ...v,
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
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Yaqin qarindoshlik ma'lumotlarini to'ldiring!"
                }
            })
        }
    };
    const onTrash=(name,cb)=>{
        if(survey.family_info.length && survey.family_info[name] && 'id' in survey.family_info[name]){
            const id = survey.family_info[name].id;
            setLoader(true);
            Req({
                type: `${REMOVER_SURVEY_FAMILY_INFO}${id}/`
            }).then(res=>{
                cb(name)
            }).finally(()=>{
                setLoader(false);
            })
        }else{
            cb(name)
        }
    }
    const list = useMemo(()=>{
        return (
            <Form.List name="family_info">
                {(fields, {add, remove}) => {
                    return(
                        <>
                            {fields.map(({key, name, ...restField}) =>{
                                return(
                                    (
                                        <Card
                                            className="mb-3" style={{backgroundColor: "#F5F5F5"}}
                                            key={key}
                                            align="baseline"
                                        >
                                            <Row gutter={16}>
                                                <Col span={6}>
                                                    <Form.Item label="Qarindoshlik turi" name={[name, 'type']} {...restField} rules={[
                                                        {required: true, message: 'Iltimos belgilang'}]}>
                                                        <Select placeholder="Iltimos tanlang">
                                                            <Select.Option value="F">Ota</Select.Option>
                                                            <Select.Option value="M">Ona</Select.Option>
                                                            <Select.Option value="FL">Qaynota</Select.Option>
                                                            <Select.Option value="ML">Qaynona</Select.Option>
                                                            <Select.Option value="OB">Aka</Select.Option>
                                                            <Select.Option value="LB">Uka</Select.Option>
                                                            <Select.Option value="OS">Opa</Select.Option>
                                                            <Select.Option value="LS">Singil</Select.Option>
                                                            <Select.Option value="SP">Turmush o'rtoq</Select.Option>
                                                            <Select.Option value="S">O'gli</Select.Option>
                                                            <Select.Option value="D">Qizi</Select.Option>
                                                        </Select>
                                                    </Form.Item>
                                                </Col>
                                                <Col span={18}>
                                                    <Form.Item label="Qarindoshingizni I.F.Sh." name={[name, 'full_name']} {...restField} rules={[
                                                        {required: true, message: 'Iltimos kiriting'}]}>
                                                        <Input placeholder="Qarindoshingizni I.F.Sh."/>
                                                    </Form.Item>
                                                </Col>
                                                <BirthCity value={survey?.family_info[name]} region={region} name={name} restField={restField}/>
                                                <Col span={12}>
                                                    <Form.Item label="Ish joyi va mansab" name={[name, 'job_place']} {...restField} rules={[
                                                        {required: true, message: 'Iltimos kiriting'}]}>
                                                        <Input placeholder="Ish joyi va mansabi"/>
                                                    </Form.Item>
                                                </Col>
                                                <LiveRegion value={survey.family_info.length ? survey.family_info[name] : null} region={region} name={name} restField={restField}/>
                                                <Col span={24}>
                                                    <Form.Item label="Yashash joyi ko'cha, uy raqami" name={[name, 'live_place']} {...restField}>
                                                        <Input placeholder="Yashash joyi ko'cha, uy raqami"/>
                                                    </Form.Item>
                                                </Col>
                                                <IsDead name={name} restField={restField}/>
                                            </Row>
                                            <div className="text-right">
                                                <Button disabled={loader} type="danger" size='small' onClick={()=>onTrash(name,remove)}>
                                                    <IconTrash/> O'chirish
                                                </Button>
                                            </div>
                                        </Card>
                                    )
                                )
                            })}
                            <Form.Item>
                                <Button type="dashed" className="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                    Maydon qo'shish
                                </Button>
                            </Form.Item>
                        </>
                    )
                }}
            </Form.List>
        )
    },[loader,region])
    return (
        <Form
            layout="vertical"
            initialValues={{
                family_info: survey.family_info.map(v=>{
                    const country = v?.country?.id ? {country: v.country.id} : {}
                    return {
                        ...v,
                        country: v?.country?.id
                    }
                })
            }}
            onFinish={onFinish}
        >
            {list}
            <SurveyButtons/>
        </Form>
    );
}

function BirthCity({region = null,name,restField,value}){
    const country = useSelector(s=>s.country || []);
    const [countryData,getCountry,loader] = useGetDynamic();
    const [otherRegion,setOtherRegion] = useState(false);
    const [birthCity, getBirthCity] = useDistrict();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(countryData.length){
            dispatch({
                type: 'country',
                payload: countryData
            })
        }
    },[countryData]);
    useEffect(()=>{
        if(value){
            getBirthCity(value.birth_city);
        }
        if(!countryData.length){
            getCountry(GET_COUNTRY);
        }
    },[]);
    const onChooseRegionBirthCity = (v)=>{
        getBirthCity(v)
    }
    const onChangeOtherRegion = (v)=>{
        setOtherRegion(v.target.checked);
    }
    const otherRegionForm = useMemo(()=>{
        return (
            <Col span={12}>
                <Form.Item
                    name={[name, 'country']} {...restField}
                    label="Tug'ilgan davlati"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos tanlang!"
                        }
                    ]}>
                    <Select loading={loader} placeholder="Iltimos tanlang">
                        {
                            country.map(item => {
                                return <Option key={`country${item.id}`} value={parseInt(item.id)}>{item.name_uz}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
        )
    },[otherRegion,country,loader])
    return (
        <>
            <Col span={6}>
                <Form.Item
                    name={[name, 'other_region']} {...restField}
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
                    otherRegionForm :
                    <>

                        <Col span={6}>
                            <Form.Item label="Tug'ilgan viloyati" name={[name, 'birth_city']} {...restField} rules={[
                                {required: true, message: `Iltimos to'ldiring`,}]}>
                                <Select
                                    showSearch
                                    filterOption={
                                        (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                                    }
                                    placeholder="Iltimos tanlang"
                                    onChange={onChooseRegionBirthCity}>
                                    {
                                        region.map(item => {
                                            return <Option key={`birth_city${item.id}`}
                                                           value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Tug'ilgan shahar / tuman" name={[name, 'birth_district']} {...restField} rules={[
                                {required: true, message: `Tug'ilgan shaxar / tuman belgilang`}]}>
                                <Select
                                    disabled={!birthCity.length}
                                    showSearch
                                    filterOption={
                                        (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                                    }
                                    placeholder="Iltimos tanlang">
                                    {
                                        birthCity.map(item => {
                                            return <Option key={`birth_district${item.id}`}
                                                           value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </>
            }
            <Col span={6}>
                <Form.Item label="Tug'ilgan sanasi" name={[name, 'birth_date']} {...restField} rules={[
                    {required: true, message: `Iltimos to'ldiring`,}]}>
                    <Input type="date" placeholder="Tug'ilgan sanasi"/>
                </Form.Item>
            </Col>
        </>
    )
}
function LiveRegion({region,name,restField,value}){
    const [district, getDistrict] = useDistrict();
    const onChooseRegion = (v) => {
        getDistrict(v);
    }
    useEffect(()=>{
        if(value){
            getDistrict(value.live_region);
        }
    },[])
    return (
        <>
            <Col span={6}>
                <Form.Item label="Yashash joyi viloyat" name={[name, 'live_region']} {...restField}>
                    <Select
                        showSearch
                        filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                        }
                        placeholder="Iltimos tanlang"
                        onChange={onChooseRegion}>
                        {
                            region.map(item => {
                                return <Option key={`live_region${item.id}`}
                                               value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={6}>
                <Form.Item label="Yashash joyi shahar/tuman" name={[name, 'live_district']} {...restField}>
                    <Select
                        showSearch
                        filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                        }
                        disabled={!district.length}
                        placeholder="Iltimos tanlang" >
                        {
                            district.map(item => {
                                return <Option key={`live_district${item.id}`}
                                               value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
        </>
    )
}
function IsDead({name,restField}){
    const [isDead,setIsDead] = useState(false);
    const onChange = (e)=>{
        setIsDead(e.target.checked);
    }
    return(
        <Col span={24}>
            <Form.Item
                name={[name, 'is_dead']} {...restField}
                label="Vafot etganmi?"
                valuePropName="checked"
            >
                <Checkbox defaultChecked={isDead} onChange={onChange}>
                    Ha
                </Checkbox>
            </Form.Item>
            {
                isDead ?
                    <Row gutter={16}>
                       <Col span={12}>
                           <Form.Item
                               name={[name, 'dead_year']} {...restField}
                               label="Vafot etgan sana"
                           >
                               <Input type="date"/>
                           </Form.Item>
                       </Col>
                        <Col span={12}>
                            <Form.Item
                                name={[name, 'burial_place']} {...restField}
                                label="Dafin etilgan joyi"
                            >
                                <Input placeholder="Manzili"/>
                            </Form.Item>
                        </Col>
                    </Row>:""
            }
        </Col>
    )
}

export default StepTwo;