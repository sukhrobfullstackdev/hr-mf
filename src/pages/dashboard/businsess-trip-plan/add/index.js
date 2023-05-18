import {Button, Card, Col, DatePicker, Form, Input, message, Row, Select, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {IconChevronLeft, IconChevronRight, IconSave, IconTrash, IconUpload} from "../../../../components/Icon";
import {useGetDynamic} from "../../../../hooks/useGet";
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {ADD_BUSINESS_TRIP_PLAN, GET_ORGAN_FREE, GET_STAFF} from "../../../../store/types";
import {Link, useNavigate, useParams} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";
import Req from "../../../../store/api";

const {Option} = Select;
const {RangePicker} = DatePicker;
function DashboardBusinessTripPlanAdd(){
    const {id} = useParams();
    const timeOut = useRef();
    const [fileList, setFileList] = useState([]);
    const [loader,setLoader] = useState(false);
    const [page,setPage] = useState(1)
    const [form] = Form.useForm();
    const [users,getUsers,usersLoader] = useGetDynamic();
    const [organs,getOrgans,organsLoader] = useGetDynamic();
    const navigate = useNavigate();
    useEffect(()=>{
        getUsers(GET_STAFF,{
            page: page
        });
    },[page])
    useEffect(()=>{
        return ()=>{
            if(timeOut.current){
                clearTimeout(timeOut.current);
            }
        }
    },[]);
    useLayoutEffect(()=>{
        getOrgans(GET_ORGAN_FREE);
    },[])
    const onFinish = (v)=>{
        if(v.plans.length){
            console.log(v);
            setLoader(true)
            v.plans = v.plans.map(p=>p.type);
            v.date_from = v.date[0].format('YYYY-MM-DD');
            v.date_to = v.date[1].format('YYYY-MM-DD');
            const formData = new FormData();
            v.plans.map(p=>{
                formData.append('plans',p);
            });
            fileList.map(f=>{
                formData.append('cause_files', f);
            })
            delete v.plans;
            delete v.cause_files;
            for (const vKey in v) {
                formData.append(vKey,v[vKey]);
            }
            Req({
                type: ADD_BUSINESS_TRIP_PLAN,
                data: formData,
                headers:{
                    "Content-Type": "multipart/form-data",
                }
            })
                .then(res=>{
                    navigate('/dashboard/business-trip-plan');
                })
                .catch(err=>{
                    message.error(`Hatolik qayta urinib ko'ring!`);
                })
                .finally(()=>{
                    setLoader(false);
                });
        }
        else{
            message.error(`Iltimos xizmat safari uchun rejalashtirilgan ishlarni kiriting!`)
        }
    }
    const onSearch = (v)=>{
        if(v.length){
            timeOut.current = setTimeout(()=>{
                getUsers(GET_STAFF,{
                    search: v
                });
            },1000);
        }else{
            setPage(1);
        }
    }
    const onRemove = (file) => {
        const index = fileList.indexOf(file);
        const newFileList = fileList.slice();
        newFileList.splice(index, 1);
        setFileList(newFileList);
    }
    const onAction = (option)=>{
        setFileList([...fileList,option.file]);
    }
    const userSelect = useMemo(()=>{
        return(
            users.map((item)=>{
                return (
                    <Option value={item.id} key={`organOption${item.id}`}>
                        {item.full_name}
                    </Option>
                )
            })
        )
    },[users,usersLoader]);
    return(
        <div>
            <h4 className="mb-4">
                <strong>
                    Yangi xizmat safari rejasini qo'shish
                </strong>
            </h4>
            <Card>
                <Form
                    onFinish={onFinish}
                    form={form}
                    name="businessTripForm"
                    layout={'vertical'}
                    initialValues={ id ? {}: {plans: [''] }}
                >
                    <Form.Item
                        label="Asos"
                        name='cause'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos kiriting'
                            }
                        ]}
                    >
                        <Input placeholder='Xizmat safari uchun asos'/>
                    </Form.Item>
                    <Form.Item
                        label="Xizmat safaridan ko'zlanadigan asosiy maqsad"
                        name='purpose'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos kiriting'
                            }
                        ]}
                    >
                        <TextArea placeholder={`Xizmat safaridan ko'zlanadigan asosiy maqsad`}/>
                    </Form.Item>
                    <Form.Item
                        label="Hodimlarni tanlang"
                        name="staffs"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang'
                            }
                        ]}
                    >
                        <Select
                            mode='multiple'
                            showSearch
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            notFoundContent={null}
                            onSearch={onSearch}
                            placeholder="Xizmat safarga yuborilayotgan hodimlarni tanlang! Hodimlarni F.I.SH. orqali qidiring va tanlang"
                        >
                            {userSelect}
                        </Select>

                    </Form.Item>
                    <Form.Item
                        label="Xizmat safar muddati (ketish va qaytish sanasi)"
                        name='date'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos kiriting'
                            }
                        ]}
                    >
                        <RangePicker placeholder={['Dan','Gacha']} separator={<IconChevronRight/>}/>
                    </Form.Item>
                    <Form.Item
                        label="Xizmat safari bilan yuborilayotgan tashkilot"
                        name='sending_organization'
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang'
                            }
                        ]}
                    >
                        <Select
                            showSearch
                            loading={organsLoader}
                            disabled={organsLoader}
                            filterOption={
                                (input, option) => {
                                    return option.children ? option.children.toLowerCase().indexOf(input.toLowerCase()) > - 1 : false
                                }
                            }
                            placeholder="Tashkilot yoki korxona tanlang!"
                        >
                            {
                                organs.map((item)=>{
                                    return (
                                        <Option value={item.id} key={`organOption${item.id}`}>
                                            {item.name}
                                        </Option>
                                    )
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.List name="plans"
                         rules={[
                             {
                                 required: true,
                                 message: 'Iltimos'
                             }
                         ]}
                    >
                        {(fields, {add, remove}) => {
                            return(
                                <>
                                    {fields.map(({key, name, ...restField}) =>{
                                        return(
                                            (
                                                <Card
                                                    className="mb-3" style={{backgroundColor: "#F5F5F5"}}
                                                    key={key}
                                                    align="baseline"
                                                >
                                                    <Row gutter={16} align="end">
                                                        <Col span={24}>
                                                            <Form.Item label="Reja" name={[name, 'type']} {...restField} rules={[
                                                                {required: true, message: 'Iltimos kiriting'}]}>
                                                                <Input placeholder="Reja"/>
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Button type="danger" size='small' onClick={()=>remove(name)}>
                                                        <IconTrash/> O'chirish
                                                    </Button>
                                                </Card>
                                            )
                                        )
                                    })}
                                    <Form.Item>
                                        <Button type="dashed" className="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                            Reja qo'shish
                                        </Button>
                                    </Form.Item>
                                </>
                            )
                        }}
                    </Form.List>
                    <Form.Item
                        label="Asos bo'luvchi fayil(lar) biriktirish"
                        name='cause_files'
                    >
                        <Upload
                            fileList={fileList}
                            customRequest={onAction}
                            onRemove={onRemove}
                        >
                            <Button icon={<IconUpload />}>Yuklash</Button>
                        </Upload>
                    </Form.Item>
                    <div className="text-right">
                        <Link to='/dashboard/business-trip-plan' className="ant-btn ant-btn-link">
                            <IconChevronLeft/> Ortga qaytish
                        </Link>
                        <Button type="primary" disabled={loader} htmlType="submit">
                            <IconSave/> Saqlash
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    )
}
export default DashboardBusinessTripPlanAdd