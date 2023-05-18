import {Button, Card, Col, Form, Input, message, Modal, Row, Select, Skeleton, Tooltip} from "antd";
import Title from "../../../../styleComponents/Title";
import {Link, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {GET_ONE_COMMANDS, UPDATE_COMMANDS} from "../../../../store/types";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import FormItems from "../component/FormItems";
import {useGetDynamic} from "../../../../hooks/useGet";

function UpdateOrder(props) {
    const {id} = useParams();
    const [data,setData] = useState(null);
    const [order,getOrder,loader] = useGetDynamic();
    const [text, setText] = useState([]);
    const onFinish = (v) => {
        if(text && text !=''){
            if(v.approvals && v.approvals.length){
                v.approvals = v.approvals.map(value=> {
                    return {user: value}
                })
            }
            dispatch({
                type: UPDATE_COMMANDS,
                payload: {
                    ...v,
                    texts: [{
                        command: id,
                        cause: v.cause,
                        text: text
                    }],
                    redirectUrl: 'orders',
                    id:id,
                }
            });
        }else{
            message.error(`Iltimos buyruqning asosiy matnini kiriting!`);
        }
    }
    const onText = (v)=>{
        setText(v);
    }
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!order.length){
            getOrder(`${GET_ONE_COMMANDS}${id}`);
        }
    },[]);
    useEffect(()=>{
        if('texts' in order && order.texts.length){
            setText(order.texts[0].text);
        }
        if('approvals' in order && Array.isArray(order.approvals)){
            order.approvals = order.approvals.map(v=> v.user);
            setData({
                ...order,
                cause: order.texts[0].cause
            });
        }
    },[order]);
    return (
        <Card>
            <Title>
                Buyruqni taxrirlash
            </Title>
            {
                data && Object.keys(data).length ?
                    <Form
                        name='companyForm'
                        layout='vertical'
                        onFinish={onFinish}
                        initialValues={data}
                    >
                        <FormItems isUpdate={true} text={text} onText={onText}/>
                        <Form.Item className="text-right mt-4">
                            <Link to="/dashboard/orders" className="ant-btn ant-btn-danger mr-3">
                                <ArrowLeftOutlined/> Bekor qilish
                            </Link>
                            <Button type="primary" htmlType='submit'>
                                <SaveOutlined/> Saqlash
                            </Button>
                        </Form.Item>
                    </Form>:
                    <Skeleton active/>
            }
        </Card>
    )
}

export default UpdateOrder;