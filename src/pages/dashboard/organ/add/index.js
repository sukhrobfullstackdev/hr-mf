import {Button, Card, Form} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {ADD_ORGAN} from "../../../../store/types";
import {useDispatch} from "react-redux";

function AddCompany(props){
    const dispatch = useDispatch();
    const onFinish = (v)=>{
        dispatch({
            type: ADD_ORGAN,
            payload: {
                ...v,
                province_code: v.province_code,
                redirectUrl: "organ"
            }
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
                    <Link to="/dashboard/organ" className="ant-btn ant-btn-danger mr-3">
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
export default AddCompany;