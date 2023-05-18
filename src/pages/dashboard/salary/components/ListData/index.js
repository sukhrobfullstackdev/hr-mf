import React, {useEffect, useState} from "react";
import {Button, Col, Popconfirm, Row} from "antd";
import {Link} from "react-router-dom";
import {IconEdit, IconPlus, IconTrash} from "../../../../../components/Icon";
import AppTabel from "../../../../../components/AppTabel";
import {connect, useDispatch} from "react-redux";
import {GET_SALARY, REMOVE_SALARY} from "../../../../../store/types";

function ListData({salary}){
    const dispatch = useDispatch();
    const [columns, setColumns] = useState([
        {
            title: 'id',
            dataIndex: 'id'
        },
        {
            title: 'Miqdori',
            dataIndex: 'value'
        },
        {
            title: 'Amallar',
            dataIndex: 'actions',
            width: '30%',
            render: (_,col)=>{
                return(
                    <div className="text-right">
                        <Link to={`${col.id}`} className="ant-btn ant-btn-primary ant-btn-sm mr-2">
                            <IconEdit/> Taxrirlash
                        </Link>
                        <Popconfirm placement="top" title={"O'chirishni tasdiqlang!"} onConfirm={()=>onRemove(col.id)} okText="O'chirish" cancelText={'Yopish'}>
                            <Button type="danger" size="small">
                                <IconTrash/> O'chirish
                            </Button>
                        </Popconfirm>

                    </div>
                )
            }
        }
    ]);
    const onRemove =(id)=>{
        dispatch({
            type: REMOVE_SALARY,
            payload: id
        })
    };
    useEffect(()=>{
        console.log("test");
    },[])
    return(
        <div>
            <Row>
                <Col span={20}>
                    <h3>
                        <strong>Eng kam oylik ish haqqi</strong>
                    </h3>
                </Col>
                <Col span={4} className="text-right">
                    <Link className="ant-btn ant-btn-primary" to={`add`}>
                        <IconPlus color="#fff"/> Qo'shish
                    </Link>
                </Col>
            </Row>
            <AppTabel columns={columns} data={salary} type={GET_SALARY}/>
        </div>
    )
}
const stp = (state)=>{
    return{
        salary: state.salary || []
    }
}
export default connect(stp)(ListData);