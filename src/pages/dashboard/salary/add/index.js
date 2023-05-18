import {Button, Card, Form} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import FormItem from "../components/FormItem";
import {CREATE_SALARY} from "../../../../store/types";
import usePost from "../../../../hooks/usePost";

function AddSalary (){
    const navigate = useNavigate();
    const [post,loader] = usePost();
    const onFinish=(v)=>{
        post(CREATE_SALARY,v,()=>{
            navigate('/dashboard/salary')
        })
    }
    return(
        <Card>
            <Form
                name="add_salary_form"
                layout='vertical'
                onFinish={onFinish}
            >
                <FormItem/>
                <Form.Item className="text-right">
                    <Link to='/dashboard/salary' className="text-danger mr-3">
                        <IconChevronLeft/> Bekor qilish
                    </Link>
                    <Button disabled={loader} type="primary" htmlType="submit">
                        <IconSave/> Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default AddSalary;