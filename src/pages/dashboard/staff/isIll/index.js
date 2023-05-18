import {Button, Card, Col, Divider, Form, Row, Skeleton} from "antd";
import {useDispatch, useSelector} from "react-redux";
import UserAvatar from "../../../../styleComponents/UserAvatar";
import {useEffect, useState} from "react";
import Req from "../../../../store/api";
import {useNavigate, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import FormItems from "./component/FormItems";

function IsIll(props){
    const activeStaff = useSelector(s=>s.activeStaff || {});
    const [loader,setLoader] = useState(false);
    const {userId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        {
            if(!Object.keys(activeStaff).length){
                setLoader(true)
                Req({
                    type: `get user/passport_citizen/${userId}`
                }).then(res=>{
                    dispatch({
                        type: 'activeStaff',
                        payload: res.data
                    })
                }).catch(err=>{
                    const {data,status} = err.response;
                    if(status <= 500){
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
                }).finally(()=>{
                    setLoader(false)
                })
            }
        }
    },[]);
    const onFinish = (v)=>{
        setLoader(true)
        Req({
            type: 'post v1/calendar/sickness/table/',
            data: {
                ...v,
                staff: userId
            }
        }).then(res=>{
           toBack();
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
        }).finally(()=>{
            setLoader(false)
        })
    }
    const toBack = ()=>{
        dispatch({
            type: 'activeStaff',
            payload: {}
        })
        navigate('/dashboard/staff');
    }
    return  <Card>
                {
                    Object.keys(activeStaff).length ?
                        <div>
                            <Form
                                onFinish={onFinish}
                                layout='vertical'
                                initialValues={activeStaff}
                            >
                                <FormItems/>
                                <Form.Item className="text-right">
                                    <Button onClick={toBack} type="danger" className="mr-2">
                                        <ArrowLeftOutlined /> Bekor qilish
                                    </Button>
                                    <Button disabled={loader} type="primary" htmlType='submit'>
                                        <SaveOutlined /> Saqlash
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        :
                        <Skeleton active/>
                }
            </Card>
}
export default IsIll;