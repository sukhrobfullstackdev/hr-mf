import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Form, Input, Select} from "antd";
import {Option} from "antd/es/mentions";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import usePost from "../../../../hooks/usePost";
import {CREATE_ORDER_TYPES, GET_ONE_ORDER_TYPES, GET_ORDER_TYPES, UPDATE_ORDER_TYPES} from "../../../../store/types";
import {useEffect, useLayoutEffect} from "react";
import {useGetDynamic} from "../../../../hooks/useGet";
import Loader from "../../../../components/Loader";

function DashboardAddOrderTypes(){
    const [post,loader] = usePost();
    const navigate = useNavigate();
    const [data,get,getLoader,setLoader] = useGetDynamic();
    const {id} = useParams();
    const [form] = Form.useForm();
    useLayoutEffect(()=>{
        if (id){
            get(`${GET_ONE_ORDER_TYPES}${id}/`);
        }else{
            setLoader(false);
        }
    },[]);
    useEffect(()=>{
        if(Object.keys(data).length){
            console.log(data);
            form.setFieldsValue({
                ...data
            });
        }
    },[data]);
    const onFinish = (v)=>{
        const type = id ? `${UPDATE_ORDER_TYPES}${id}/` : CREATE_ORDER_TYPES;
        console.log(type,v)
        post(type,{
            ...v,
            key: 'general'
        },()=>{
            navigate('/dashboard/order-types');
        });
    }
    return(
        <Card>
            <h4 className="mb-4">
                <strong>Yangi buyuruq uchun turkum qo'shish</strong>
            </h4>
            <Form
                layout="vertical"
                onFinish={onFinish}
                form={form}
                name="orderType"
            >
                <Form.Item
                    label="Tur uchun nomni kiriting"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: 'Iltimos kiriting!'
                        }
                    ]}
                >
                    <Input placeholder="Tur uchun nomni kiriting"/>
                </Form.Item>
                <Form.Item
                    label="Tur uchun maxsus kodni tanlang"
                    name="label"
                    rules={[
                        {
                            required: true,
                            message: 'Iltimos kiriting!'
                        }
                    ]}
                >
                    <Select
                        placeholder="Tur uchun maxsus kodni tanlang"
                    >
                        <Option value="sht">SHt</Option>
                        <Option value="k">K</Option>
                        <Option value="t">T</Option>
                        <Option value="no_label">Mavjud emas</Option>
                    </Select>
                </Form.Item>
                <div className="py-3 text-right">
                    <Link to="/dashboard/order-types" className="ant-btn-link mr-2">
                        <IconChevronLeft/> Qaytish
                    </Link>
                    <Button disabled={loader} type="primary" htmlType='submit'>
                        <IconSave/> Saqlash
                    </Button>
                </div>
            </Form>
            {
                getLoader ?
                    <Loader/> :''
            }
        </Card>
    )
}
export default DashboardAddOrderTypes