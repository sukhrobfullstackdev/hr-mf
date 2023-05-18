import {Button, Card, Col, Form, Input, Row, Select} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {UPDATE_ORGAN,GET_ONE_ORGAN} from "../../../../store/types";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

function UpdateCompany(props){
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(()=>{
        if(id){
            dispatch({
                type: GET_ONE_ORGAN,
                payload: {
                    id: id,
                    redirectUrl: 'register'
                }
            })
        }
    },[id])
    const onFinish = (v)=>{
        dispatch({
            type: UPDATE_ORGAN,
            payload: v
        })
    }
    return (
        <Card>
            <Title>
                Tashkilot qo'shish
            </Title>
            <Form
                name='companyForm'
                layout='vertical'
                onFinish={onFinish}
            >
                <FormItem/>
                <Form.Item className="text-right">
                    <Link to="/dashboard/company" className="ant-btn ant-btn-danger mr-3">
                        <ArrowLeftOutlined /> Bekor qilish
                    </Link>
                    <Button type="primary" htmlType='submit'>
                        <SaveOutlined /> Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Card>

    )
}
export default UpdateCompany;