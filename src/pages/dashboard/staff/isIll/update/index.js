import {Button, Card, Col, Divider, Form, Row, Skeleton} from "antd";
import FormItems from "../component/FormItems";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
import Req from "../../../../../store/api";
import {useGetDynamic} from "../../../../../hooks/useGet";

function UpdateIsIll(){
    const {id} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [data,get,loader] = useGetDynamic();
    useEffect(()=>{
        if(id){
            get(`get v1/calendar/sickness/table/${id}`);
        }
    },[]);
    const onFinish = (v)=>{
        Req({
            type: `put v1/calendar/sickness/table/${id}/`,
            data: {
                ...v,
                staff: data.staff.id
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
        })
    }
    const toBack = ()=>{
        dispatch({
            type: 'activeStaff',
            payload: {}
        })
        navigate('/dashboard/staff');
    }
    return      <Card>
                    {
                        Object.keys(data).length ?
                            <Form
                                onFinish={onFinish}
                                layout='vertical'
                                initialValues={{...data, full_name:data.staff.full_name }}
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
                            :
                            <Skeleton active/>
                    }
                </Card>
}
export default UpdateIsIll;