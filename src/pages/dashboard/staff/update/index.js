import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {GET_ONE_STAFF, UPDATE_STAFF} from "../../../../store/types";
import useGetById from "../../../../hooks/useGetById";
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Form, Skeleton} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItems from "../components/FormItems";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import moment from "moment";

function StaffUpdate(){
    const loader = useSelector(s=>s?.loader);
    const [valueData,setValueData] = useState({});
    const {id} = useParams();
    const data = useGetById(GET_ONE_STAFF,id);
    const dispatch = useDispatch();
    const onFinish = (v)=>{
        v.birth_date = v.birth_date.format('YYYY-MM-DD');
        dispatch({
            type: UPDATE_STAFF,
            payload:{
                ...v,
                username: data.username,
                id: id,
                redirectUrl:"staff"
            }
        })
    }
    useEffect(()=>{
        if(Object.keys(data).length){
            setValueData({
                ...data,
                birth_date: data.birth_date ? moment(data.birth_date) : moment()
            });
        }
    },[data]);
    return(
        <Card>
            <Title>
                Hodim ma'lumotlarini taxrirlash
            </Title>
            {
                loader ?
                    <Skeleton active/> :
                    Object.keys(valueData).length ?
                        <Form
                            layout='vertical'
                            name='update_staff_form'
                            onFinish={onFinish}
                            initialValues={valueData}
                        >
                            <FormItems value={valueData}/>
                            <Form.Item className="text-right">
                                <Link to="/dashboard/staff" className="ant-btn ant-btn-danger mr-3">
                                    <ArrowLeftOutlined /> Bekor qilish
                                </Link>
                                <Button type="primary" htmlType='submit'>
                                    <SaveOutlined /> Saqlash
                                </Button>
                            </Form.Item>
                        </Form>:  <Skeleton active/>
            }
        </Card>
    )
}
export default StaffUpdate;