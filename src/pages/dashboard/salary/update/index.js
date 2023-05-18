import {Button, Card, Form, Skeleton} from "antd";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import {Link, useNavigate, useParams} from "react-router-dom";
import usePost from "../../../../hooks/usePost";
import {CREATE_SALARY, GET_ONE_SALARY, UPDATE_SALARY} from "../../../../store/types";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect} from "react";
import FormItem from "../components/FormItem";

function UpdateSalary (){
    const navigate = useNavigate();
    const {id} = useParams();
    const [data,get,getLoader] = useGetDynamic();
    const [post,loader] = usePost();
    useEffect(()=>{
        get(`${GET_ONE_SALARY}${id}`);
    },[])
    const onFinish=(v)=>{
        post(`${UPDATE_SALARY}${id}/`,v,()=>{
            navigate('/dashboard/salary')
        })
    }
    return(
        <Card>
            {
                getLoader ?
                    <Skeleton active/>:
                    <Form
                        name="add_salary_form"
                        layout='vertical'
                        initialValues={data}
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
            }
        </Card>
    )
}
export default UpdateSalary;