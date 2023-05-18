import {Button, Card, Col, Form, Input, message, Row, Select, Tooltip} from "antd";
import Title from "../../../../styleComponents/Title";
import {Link, useParams} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {
    ADD_COMMANDS,
    GET_APPEAL_HR,
    GET_COMMAND_APPROVERS,
    GET_COMMANDS_TYPES,
    GET_STAFF
} from "../../../../store/types";
import {useDispatch} from "react-redux";
import Blank from "../../../../components/Blank";
import {useEffect, useState} from "react";
import {useGetDynamic} from "../../../../hooks/useGet";
import Editor from "../../../../components/Editor";

const {Option} = Select;
function AddOrder(props) {
    const dispatch = useDispatch();
    const {appealId} = useParams();
    const [activeText,setActiveText] = useState({});
    const [staffs,get,loader,setGetLoader] = useGetDynamic();
    const [approvals,getApprovals,loaderApprovals] = useGetDynamic();
    const [type,getType,loaderType] = useGetDynamic();
    const [editor,setEditor] = useState(null);
    const onFinish = (v) => {
        let a = [];
        if(activeText && activeText !==''){
            if(v.approvals){
                a = v.approvals.map(value=> {
                    return {user: value}
                })
            }
            dispatch({
                type: ADD_COMMANDS,
                payload: {
                    ...v,
                    approvals: a,
                    texts: [{
                        cause: v.cause,
                        text: editor
                    }],
                    redirectUrl: 'orders'
                }
            })
        }else{
            message.error("Iltimos buyuruqni asosiy matnini kiriting!")
        }
    }
    useEffect(()=>{
        if(appealId){
            get(`${GET_APPEAL_HR}${appealId}`);
        }else{
            setGetLoader(false)
        }
    },[]);
    useEffect(()=>{
        if(!type.length){
            getType(GET_COMMANDS_TYPES,{
                key: 'general'
            });
        }
    },[])
    useEffect(()=>{
        getApprovals(GET_COMMAND_APPROVERS);
    },[])
    const onChangeEditor=(v)=>{
        setEditor(v)
    }
    return (
        <Card>
            <Title>
                Yangi buyuruq
            </Title>
            <Form
                name='companyForm'
                layout='vertical'
                onFinish={onFinish}
            >
                <Blank>
                    <Row className="mt-3" justify="center">
                        <Col span={4}>
                            <Tooltip title="Buyruq turini tanlang">
                                <Form.Item
                                    name='type'
                                    rules={[{
                                        required: true,
                                        message: "Iltimos tanlang!"
                                    }]}
                                >
                                    <Select
                                        showSearch
                                        filterOption={
                                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >-1
                                        }
                                        placeholder="Buyruq turini tanlang"
                                        allowClear
                                        loading={loader}>
                                        {
                                            type.map(item=>{
                                                return  <Option value={item.id} key={`staff${item.id}`}>
                                                            {item.title}
                                                        </Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Tooltip>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name='cause'
                                label='Buyuruq uchun asos'
                                rules={[
                                    {
                                        required: true,
                                        message: "Iltimos kiriting!"
                                    }
                                ]}
                            >
                                <Input placeholder="Buyruq uchun asos!"/>
                            </Form.Item>
                            <div className="mb-3">
                                <Editor value={editor} onChange={onChangeEditor}/>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <p className="mb-0">
                               <strong>
                                   Kelishish uchun hodim tanlang
                               </strong>
                            </p>
                            <Form.Item
                                name='approvals'
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    filterOption={
                                        (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >-1
                                    }
                                    placeholder="Kelishish uchun hodim tanlang"
                                    allowClear
                                    loading={loaderApprovals}
                                >
                                    {
                                        approvals.map(item=>{
                                            return <Option key={`approvals${item.id}`} value={item.id}>{item.full_name}</Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>

                    </Row>
                </Blank>
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

export default AddOrder;