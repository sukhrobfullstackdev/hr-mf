import {Button, Card, Col, Form, Input, InputNumber, Row, Select, Skeleton} from "antd";
import SideBar from "../component/SideBar";
import {connect, useDispatch} from "react-redux";
import {useEffect, useLayoutEffect, useState} from "react";
import Req from "../../../store/api";
import useRegion from "../../../hooks/useRegion";
import useDistrict from "../../../hooks/useDistrict";
import Loader from "../../../components/Loader";
import {Link, useNavigate} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useGetDynamic} from "../../../hooks/useGet";
import {GET_DISTRICT} from "../../../store/types";

const {Option} = Select;
function Settings({loader= false}){
    const [userInfo,setUserInfo] = useState({});
    const [regionId,setRegionId] = useState(null);
    const [district,getDistrict, loaderDistrict] = useGetDynamic();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const region = useRegion();
    useEffect(()=>{
        if(regionId){
            getDistrict(`${GET_DISTRICT}${regionId}`);
        }
    },[regionId]);
    useLayoutEffect(()=>{
        Req({
            type: 'get user/allusersinfo/detail/'
        })
            .then(res=>{
                const data = res.data.data;
                setUserInfo(data);
                if('province_code' in data && 'district_code' in data){
                    setRegionId(data.province_code);
                }
            })
            .catch(err=>{
                const {data,status} = err.response;
                if(status < 500){
                    dispatch({
                        type: 'toast',
                        payload: {
                            type: 'error',
                            message: data?.message
                        }
                    });
                    if(status === 401 || status === '401'){
                        localStorage.removeItem('token');
                        dispatch({
                            type: 'isUser',
                            payload: null
                        });
                        navigate('/login')
                    }
                }else{
                    dispatch({
                        type: 'toast',
                        payload: {
                            type: 'error',
                            message: "Tizim hatoligi qayta urinib ko'ring!"
                        }
                    });
                }
            })
    },[]);
    const onChooseRegion = (v)=>{
        setRegionId(v);
    }
    const onFinish = (v)=>{
        Req({
            type: 'put user/allusersinfo/detail/',
            data: {
                ...v,
                mob_phone_no: `+998${v.mob_phone_no}`
            }
        }).then(res=>{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'success',
                    message: "Saqlandi!"
                }
            })
            navigate('/cabinet/info');
        }).catch(err=>{
            const {data,status} = err.response;
            if(status < 500){
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: data?.message
                    }
                });
                if(status === 401 || status === '401'){
                    localStorage.removeItem('token');
                    dispatch({
                        type: 'isUser',
                        payload: null
                    });
                    navigate('/login')
                }
            }else{
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Tizim hatoligi qayta urinib ko'ring!"
                    }
                });
            }
        })
    }
    return <Row gutter={24} className="mt-4">
                <Col span={7}>
                    {
                        loader ?
                            <Card className="h-100">
                                <Skeleton active/>
                            </Card>:
                            <SideBar/>
                    }
                </Col>
                <Col span={17}>
                    <Card className="h-100">
                        {
                            Object.keys(userInfo).length ?
                                <Form
                                    onFinish={onFinish}
                                    initialValues={{
                                        ...userInfo,
                                        mob_phone_no: userInfo.mob_phone_no ? userInfo.mob_phone_no.substring(userInfo.mob_phone_no.length-9,userInfo.mob_phone_no.length) : null
                                    }}
                                    name="formChangeForUserInfo"
                                    layout="vertical"
                                >
                                    <Form.Item
                                        name='email'
                                        label='Tashkilot elektron pochta manzili'
                                        rules={[{
                                            required: true,
                                            message: "Iltimos to'ldiring!"
                                        },{
                                            type: 'email',
                                            message: 'Email kiriting'
                                        }]}
                                    >
                                        <Input placeholder="Email"/>
                                    </Form.Item>
                                    <Form.Item
                                        name='mob_phone_no'
                                        label='Telefon raqam (mob)'
                                        rules={[{
                                            required: true,
                                            message: "Iltimos to'ldiring!"
                                        },]}
                                    >
                                        <InputNumber min={0} max={999999999} addonBefore={'+998'} type='number' placeholder="Tel raqam"/>
                                    </Form.Item>
                                    <Form.Item
                                        name='work_phone'
                                        label='Xizmat tel. raqami'
                                        rules={[{
                                            required: true,
                                            message: "Iltimos to'ldiring!"
                                        },]}
                                    >
                                        <InputNumber min={0} max={999999999} addonBefore={'+998'} type='number' placeholder="Tel raqam"/>
                                    </Form.Item>
                                    <Form.Item
                                        name='home_phone'
                                        label='Ichki tel. raqam'
                                        rules={[{
                                            required: true,
                                            message: "Iltimos to'ldiring!"
                                        },]}
                                    >
                                        <InputNumber min={100} placeholder="Tel raqam" max='999'/>
                                    </Form.Item>
                                    <Row gutter={16}>
                                        <Col span={8}>
                                            <Form.Item
                                                label="Tug'ilgan joyi"
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
                                                    hasFeedback
                                                    placeholder="Tanlang!"
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
                                                label="Yashash viloyati"
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
                                                label="Yashash tumani"
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: 'Tanlang!',
                                                    }
                                                ]}
                                            >
                                                <Select
                                                    loading={loaderDistrict}
                                                    placeholder="Tanlang!"
                                                    disabled={!("districts" in district && district.districts.length)}
                                                >
                                                    {
                                                        "districts" in district && district.districts.length ?
                                                        district.districts.map(item=><Option key={`district${item.id}`} value={parseInt(item.id)}>
                                                            {
                                                                item.name_uz_lat
                                                            }
                                                        </Option>) : ""
                                                    }
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Form.Item
                                        name='live_place'
                                        label="Yashash manzili (ko'cha, uy)"
                                        rules={[{
                                            required: true,
                                            message: "Iltimos to'ldiring!"
                                        },]}
                                    >
                                        <Input placeholder="Palonchi ko'cha, 123-uy" />
                                    </Form.Item>
                                    <Form.Item className="text-right">
                                        <Link to="/cabinet/info" className="ant-btn ant-btn-danger mr-3">
                                            <ArrowLeftOutlined /> Bekor qilish
                                        </Link>
                                        <Button type="primary" htmlType='submit'>
                                            <SaveOutlined /> Saqlash
                                        </Button>
                                    </Form.Item>
                                </Form> : <Loader full={false}/>
                        }
                    </Card>
                </Col>
            </Row>
}
export default connect(
    s=>{
        return {
            loader : s?.loader
        }
    }
)(Settings);