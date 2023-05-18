import {Button, Card, Col, Form, Input, Row, Select} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {ADD_SECTION} from "../../../../store/types";
import {useDispatch} from "react-redux";

function AddSections(props){
    const dispatch = useDispatch();
    const onFinish = (v)=>{
        dispatch({
            type: ADD_SECTION,
            payload: {
                ...v,
                redirectUrl: 'sections/'
            }
        })
    }
    return (
        <Card>
            <Title>
                Bo'lim yoki gurux qo'shish
            </Title>
            <Form
                name='sectionForm'
                layout='vertical'
                onFinish={onFinish}
            >
                <FormItem/>
                <Form.Item className="text-right">
                    <Link to="/dashboard/sections" className="ant-btn ant-btn-danger mr-3">
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
export default AddSections;