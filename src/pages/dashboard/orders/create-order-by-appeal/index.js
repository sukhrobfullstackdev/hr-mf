import {Link, useParams} from "react-router-dom";
import Title from "../../../../styleComponents/Title";
import {Button, Card, Form} from "antd";
import FormItems from "../component/FormItems";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {useState} from "react";
import {ADD_COMMANDS} from "../../../../store/types";
import {useDispatch} from "react-redux";

function CreateOrderByAppeal(){
    const {id} = useParams();
    const [text,setText] = useState([]);
    const onFinish = (v) => {
        let a = [];
        if(v.approvals){
            a = v.approvals.map(value=> {
                return {user: value}
            });
        }
        dispatch({
            type: ADD_COMMANDS,
            payload: {
                ...v,
                approvals: a,
                texts: text,
                redirectUrl: 'orders'
            }
        })
    }
    const onText = (v)=>{
        setText(v);
    }
    const dispatch = useDispatch();

    return(
        <Card>
            <Title>
                Yangi buyruq
            </Title>
            <Form
                name='companyForm'
                layout='vertical'
                onFinish={onFinish}
            >
                <FormItems texts={text} onText={onText}/>
                <Form.Item className="text-right mt-4">
                    <Link to="/dashboard/orders" className="ant-btn ant-btn-danger mr-3">
                        <ArrowLeftOutlined/> Bekor qilish
                    </Link>
                    <Button type="primary" htmlType='submit'>
                        <SaveOutlined/> Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default CreateOrderByAppeal;