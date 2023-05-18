import {Button, Card, Col, Form, Input, Modal, Row, Select, Tooltip} from "antd";
import Small from "../../../../../styleComponents/Small";
import {ButtonDefault, OrderButtons} from "../../../../../styleComponents/ButtonDefault";
import {IconEdit} from "../../../../../components/Icon";
import NoData from "../../../../../components/NoData";
import Blank from "../../../../../components/Blank";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useMemo, useState} from "react";
import {connect} from "react-redux";
import {GET_COMMAND_APPROVERS, GET_COMMANDS_TYPES, GET_STAFF} from "../../../../../store/types";
import Editor from "../../../../../components/Editor";


const {Option} = Select;
function FormItems({isUpdate,onText,text}){
    const [type,getType,loaderType] = useGetDynamic();
    const [approvals, getApprovals, loaderApprovals] = useGetDynamic();
    useEffect(()=>{
        if(!approvals.length){
            getApprovals(GET_COMMAND_APPROVERS);
        }
    },[])
    useEffect(()=>{
        if(!type.length){
            getType(GET_COMMANDS_TYPES, isUpdate?{}:
                {
                    key: 'general'
                }
            );
        }
    },[])
    const onChangeEditor=(v)=>{
        onText(v)
    }
    return(
        <>
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
                                    disabled={isUpdate}
                                    showSearch
                                    filterOption={
                                        (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >-1
                                    }
                                    loading={loaderType}
                                    placeholder="Buyruq turini tanlang"
                                    allowClear
                                >
                                    {
                                        type.map(item=>{
                                            return  (
                                                <Option value={item.id} key={`orderType${item.id}`}>
                                                    {item.title}
                                                </Option>
                                            )
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
                            <Editor value={text} onChange={onChangeEditor}/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='approvals'
                            lable="Kelishish uchun"
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
        </>
    )
}
const stp = (state)=>{
    return{
        tableCount: state.tableCount || 0
    }
}
export default connect(stp)(FormItems);