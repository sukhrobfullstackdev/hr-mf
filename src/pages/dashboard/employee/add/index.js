import {Button, Card, Form} from "antd";
import Title from "../../../../styleComponents/Title";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import FormItems from "../components/FormItems";
import {ADD_EMPLOYEE_FOR_ADMIN, ADD_STAFF} from "../../../../store/types";
import {useDispatch} from "react-redux";


function AddEmployee(props){
    const dispatch = useDispatch();
    const onFinish = (v)=>{
        v.birth_date = v.birth_date.format('YYYY-MM-DD');
        dispatch({
            type: ADD_EMPLOYEE_FOR_ADMIN,
            payload:{
                ...v,
                role: ['S',v.role],
                username: v.pinfl,
                redirectUrl:"employee"
            }
        })
    }
    return  <Card>
                <Title>
                    Hodim qo'shish
                </Title>
                <Form
                    layout='vertical'
                    name='add_staff_form'
                    onFinish={onFinish}
                >
                    <FormItems/>
                    <Form.Item className="text-right">
                        <Link to="/dashboard/employee" className="ant-btn ant-btn-danger mr-3">
                            <ArrowLeftOutlined /> Bekor qilish
                        </Link>
                        <Button type="primary" htmlType='submit'>
                            <SaveOutlined /> Saqlash
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
}
export default AddEmployee;