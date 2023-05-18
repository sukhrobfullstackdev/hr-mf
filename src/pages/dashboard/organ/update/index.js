import {Button, Card, Col, Form, Input, Row, Select} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {UPDATE_ORGAN, GET_ONE_ORGAN} from "../../../../store/types";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";

function UpdateCompany(props){
    const organ = useSelector(state=>state.organ || {})
    const dispatch = useDispatch();
    const {id} = useParams();
    useEffect(()=>{
        if(id){
            dispatch({
                type: GET_ONE_ORGAN,
                payload: {
                   id: id,
                }
            })
        }
    },[id]);
    const onFinish = (v)=>{
        dispatch({
            type: UPDATE_ORGAN,
            payload: {
                ...organ,
                ...v,
                province_code: parseInt(v.province_code),
                redirectUrl: "organ"
            }
        })
    }
    return (
        <Card>
            <Title>
                Tashkilot qo'shish
            </Title>
            {
                Object.keys(organ).length ?
                    <Form
                        name='companyForm'
                        layout='vertical'
                        onFinish={onFinish}
                        initialValues={organ}
                    >
                        <FormItem initialValues={organ}/>
                        <Form.Item className="text-right">
                            <Link to="/dashboard/organ" className="ant-btn ant-btn-danger mr-3">
                                <ArrowLeftOutlined /> Bekor qilish
                            </Link>
                            <Button type="primary" htmlType='submit'>
                                <SaveOutlined /> Saqlash
                            </Button>
                        </Form.Item>
                    </Form> : ''
            }

        </Card>

    )
}
export default UpdateCompany;