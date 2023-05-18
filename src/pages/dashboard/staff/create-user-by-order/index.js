import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Form, Skeleton} from "antd";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {ADD_STAFF, GET_SURVEY} from "../../../../store/types";
import Title from "../../../../styleComponents/Title";
import FormItems from "../components/FormItems";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import moment from "moment";
import {useDispatch} from "react-redux";
import Req from "../../../../store/api";
import {useForm} from "antd/es/form/Form";

function CreateUserByOrder(){
    const [form] = useForm()
    const {surveyId,applicationId} = useParams();
    const [valueData,setValueData] = useState({});
    const [data,get,loader] = useGetDynamic();
    const [addLoader,setAddLoader] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        get(`${GET_SURVEY}${surveyId}`);
    },[]);
    useEffect(()=>{
        if(Object.keys(data).length){
            setValueData({
                ...data,
                nationality: data?.citizenship?.id,
                birth_city: data?.birth_city?.id,
                birth_district: data?.birth_district?.id,
                district_code: data?.live_district?.id,
                province_code: data?.live_region?.id,
                birth_date: data?.birth_date ? moment(data.birth_date) : moment()
            });
        }
    },[data]);
    useEffect(()=>{
        form.setFieldsValue(valueData);
    },[valueData])
    const onFinish = (v)=>{
        v.birth_date = v.birth_date.format('YYYY-MM-DD');
        setAddLoader(true)
       Req({
           type: ADD_STAFF,
           data:{
               ...v,
               username: v.pinfl,
               application: applicationId
           }
       }).then(res=>{
           dispatch({
               type: 'toast',
               payload: {
                   type: 'success',
                   message: `Yangi hoqim qo'shildi!`
               }
           })
            navigate(`/dashboard/orders/${res.data.id}`)
       }).catch(err=>{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: `Hatolik qayta urinib ko'ring!`
                }
            })
       }).finally(()=>{
           setAddLoader(false)
       })
    }
    return(
        <Card>
            <Title>Hodim qo'shish</Title>
            {
                loader ?
                    <Skeleton active/>:
                    <Form
                        form={form}
                        initialValues={valueData}
                        onFinish={onFinish}
                        layout="vertical"
                    >
                        <FormItems value={valueData}/>
                        <Form.Item className="text-right">
                            <Link to="/dashboard/staff" className="ant-btn ant-btn-danger mr-3">
                                <ArrowLeftOutlined /> Bekor qilish
                            </Link>
                            <Button type="primary" htmlType='submit' disabled={addLoader}>
                                <SaveOutlined /> Saqlash
                            </Button>
                        </Form.Item>
                    </Form>
            }
        </Card>
    )
}
export default CreateUserByOrder;