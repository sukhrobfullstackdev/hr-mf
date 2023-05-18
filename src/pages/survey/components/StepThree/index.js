import {Button, Card, Checkbox, Col, DatePicker, Form, Input, Row, Select, Space, Upload} from "antd";
import {useDispatch, useSelector} from "react-redux";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import useRegion from "../../../../hooks/useRegion";
import useDistrict from "../../../../hooks/useDistrict";
import Loader from "../../../../components/Loader";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import SurveyButtons from "../Buttons";
import {IconTrash, IconUpload} from "../../../../components/Icon";
import {ADD_SURVEY, REMOVER_SURVEY_ACTIVITY, REMOVER_SURVEY_FAMILY_INFO} from "../../../../store/types";
import Req from "../../../../store/api";
import {useNavigate} from "react-router-dom";
import moment from "moment";

const {Option} = Select;

function StepThree({userOnFinish = null}) {
    const survey = useSelector(s => s?.survey || { activity : [] });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loader, setLoader] = useState(false);
    const [file, setFile] = useState(false);
    const region = useRegion();
    const sendData=(formData)=>{
        if(userOnFinish){
            userOnFinish(formData);
        }else{
            Req({
                type: ADD_SURVEY,
                data: formData,
                headers: { "Content-Type": "multipart/form-data" },
            }).then(res => {
                dispatch({
                    type: 'survey',
                    payload: null
                });
                dispatch({
                    type: 'current',
                    payload: 0
                })
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'success',
                        message: "Murojatingiz yuborildi!"
                    }
                })
                navigate(`/survey/${res.data.key}`);
            }).catch(err => {
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Hatolik! Qayta urunib ko'ring!"
                    }
                })
            }).finally(() => {
                setLoader(false)
            })
        }
    }
    const onFinish = (v) => {
        if(v.activity && v.activity.length){
            if(
                (file && Object.keys(file).length) || (typeof v.image === 'string')
            ){
                v.activity = v.activity.map((item)=>{
                    return {
                        ...item,
                        completed_at: item.completed_at ? new Date(item.completed_at).toISOString().split('T')[0] : null,
                        entered_at: item.entered_at ? new Date(item.entered_at).toISOString().split('T')[0] : null,
                    }
                });
                const value = {
                    ...survey,
                    family_info: JSON.stringify(survey.family_info),
                    activity: JSON.stringify(v.activity)}
                delete value.image;
                const formData = new FormData();
                for (const key in value) {
                    formData.append(key,value[key]);
                }
                if(typeof v.image !== 'string'){
                    formData.append('image',file.file);
                }
                setLoader(false);
                sendData(formData);
            }else{
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Rasm tanlang!"
                    }
                })
            }
        }
        else{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Mehnat faliyati haqidagi ma'lumotlari to'ldirilmagan!"
                }
            })
        }
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: `Rasm jpeg yoki png formatida bo'lishi kerak!`
                }
            })
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: `Rasm 2Mb kichik bo'lishi kerak!`
                }
            })
        }
        return isJpgOrPng && isLt2M;
    };
    const customRequest = (v)=>{
        setFile(v)
    }
    const onTrash = useCallback((name,cb)=>{
        if(survey.activity.length && survey.activity[name] && 'id' in survey.activity[name]){
            const id = survey.activity[name].id;
            setLoader(true);
            Req({
                type: `${REMOVER_SURVEY_ACTIVITY}${id}/`
            }).then(res=>{
                cb(name);
            }).finally(()=>{
                setLoader(false)
            })
        }else{
            cb(name);
        }
    },[loader]);
    return (
        <Form
            layout="vertical"
            initialValues={{
                activity: survey?.activity,
                image: survey.image
            }}
            onFinish={onFinish}
        >
            <Form.List name="activity">
                {(fields, {add, remove}) => (
                    <div>
                        {fields.map(({key, name, ...restField}) => (
                            <Card
                                className="mb-3" style={{backgroundColor: "#F5F5F5"}}
                                key={key}
                                align="baseline"
                            >
                                <Row gutter={16}>
                                    <ChooseDate value={survey?.activity?.length ? survey.activity[name] : false} name={name} restField={restField}/>
                                    <Col span={24}>
                                        <Form.Item label="O'quv yoki korxona nomlari va xarbiy qism raqami"
                                                   name={[name, 'position']} {...restField} rules={[
                                            {required: true, message: 'Please input your position'}]}>
                                            <Input.TextArea placeholder="O'quv yuri, korxona nomi to'liq yoki xarbiy qisim raqami ko'rsatilgan holda egallagan lavozim / mansabingiz"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <h3>
                                            <strong>
                                                O'quv yurti, korxona, muassasa, xarbiy qisim manzili
                                            </strong>
                                        </h3>
                                    </Col>
                                    <RegionAddress region={region} value={survey.activity && survey.activity.length ? survey.activity[name] : null } restField={restField} name={name}/>
                                    <Col span={8}>
                                        <Form.Item label="Ko'cha, uy raqami" name={[name, 'place']} {...restField}>
                                            <Input placeholder="Ko'cha nomi uy taqami"/>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="text-right">
                                    <Button type="danger" size='small' onClick={()=>onTrash(name,remove)}>
                                        <IconTrash/> O'chirish
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        <Form.Item>
                            <Button type="dashed" className="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                Maydon qo'shish
                            </Button>
                        </Form.Item>
                    </div>
                )}
            </Form.List>
            <Form.Item
                label="Rasmingizni yuklang"
                rules={[
                    {
                        required: true,
                        message: "Iltimos rasm yuklang"
                    }
                ]}
                name="image">
                <Upload
                    customRequest={customRequest}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    listType="picture-card"
                >
                    {
                        file && Object.keys(file).length ?
                            <>
                                <IconUpload/>
                                <p className="small">
                                    { file.file.name}
                                </p>
                            </>
                           :
                            survey.image ?
                                <img className="img-fluid" src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/${survey.image}`} alt={`${survey.image}`}/>
                                 : <IconUpload/>
                    }
                </Upload>
            </Form.Item>
            <SurveyButtons/>
        </Form>

    );
}
function RegionAddress({name,value,restField,region}){
    const [district, getDistrict] = useDistrict();
    const onChooseRegion = (v) => {
        getDistrict(v);
    }
    useEffect(()=>{
        if(value){
            getDistrict(value.region);
        }
    },[])
    return(
        <>
            <Col span={8}>
                <Form.Item label="Viloyat" name={[name, 'region']} {...restField}>
                    <Select
                        showSearch
                        filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                        }
                        placeholder="Iltimos tanlang"
                        onChange={onChooseRegion}>
                        {
                            region.map(item => {
                                return (
                                    <Option key={`region${item.id}`}
                                            value={parseInt(item.id)}>
                                        {item.name_uz_lat}
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Shahar / tuman" name={[name, 'district']} {...restField}>
                    <Select
                        showSearch
                        filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                        }
                        disabled={!district.length}
                        placeholder="Iltimos tanlang">
                        {
                            district.map(item => {
                                return <Option key={`region${item.id}`}
                                               value={parseInt(item.id)}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
        </>
    )
}
function ChooseDate({name,restField, value = null}){
    const [isWorkingNow,setIsWorkingNow] = useState(value?.completed_at ? false : true);
    const onChange = (v)=>{
        setIsWorkingNow(v.target.checked);
    }
    return(
        <>
            <Col span={8}>
                <Form.Item label="Kirgan sana" name={[name, 'entered_at']} {...restField} rules={[
                    {required: true, message: `Iltimos to'ldirng`}]}>
                    <DatePicker picker="month" placeholder="Sana"/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item label="Bo'shagan sana" disabled={true} name={[name, 'completed_at']} {...restField}
                           rules={[
                               {required: !isWorkingNow, message: `Iltimos to'ldirng`}]}
                >
                    <DatePicker disabled={isWorkingNow} picker="month" placeholder="Sana"/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Hozirda aynan shu joyda ishlaysizmi?"
                >
                    <Checkbox defaultChecked={value?.completed_at ? false : true} onChange={onChange}>
                        Hozirda shu joyda ishlayman
                    </Checkbox>
                </Form.Item>
            </Col>
        </>
    )
}
export default StepThree