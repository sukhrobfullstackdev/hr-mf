import {useState} from "react";
import {Col, Dropdown, Row} from "antd";
import {Link} from "react-router-dom";
import {IconClock, IconDotsHorizontal, IconEdit, IconLock, IconPlus, IconUnLock} from "../../../../components/Icon";
import AppTab from "../../../../components/AppTab";
import AppTable from "../../../../components/AppTabel";
import {connect, useDispatch} from "react-redux";
import {CHANGE_STATUS_ORDER_TYPES, GET_ORDER_TYPES} from "../../../../store/types";
import {ButtonLink} from "../../../../styleComponents/ButtonDefault";
import usePost from "../../../../hooks/usePost";

function ListData({data}){
    const [columns,setColumns] = useState([
        {
            title: 'T/R',
            dataIndex: 'id',
            width: '5%',
            render:(_,col,index)=>{
                return(
                    <div className="text-center">
                        {index + 1}
                    </div>
                )
            }
        },
        {
            title: 'Nomi',
            dataIndex: 'title'
        },
        {
            title: 'Maxsus kodi',
            dataIndex: 'label',
            render:(_,col)=>{
                return (
                    <div className="small text-center">
                        {
                            col.label === 'no_label' ?'Mavjud emas': col.label
                        }
                    </div>
                )
            }
        },{
            title: 'Holati',
            dataIndex: 'is_archive',
            render:(_,col)=>{
                return (
                    <div className="small text-center">
                        {
                            col.is_archive ? 'Arxivda' : 'Aktiv'
                        }
                    </div>
                )
            }
        },
        {
            title: 'Amallar',
            dataIndex: 'action',
            width: '5%',
            render: (_,col)=>{
                return(
                    <div className="text-center">
                        <Dropdown overlay={<Buttons item={col}/>}>
                            <ButtonLink className="text-muted">
                                <IconDotsHorizontal/>
                            </ButtonLink>
                        </Dropdown>
                    </div>
                )
            }
        }
    ]);
    return(
        <div>
            <Row align="middle" className="mb-3">
                <Col span={12}>
                    <h4 className="m-0">
                        <strong>
                            Buyruq turlari
                        </strong>
                    </h4>
                </Col>
                <Col span={12} className="text-right">
                    <Link to="add" className="ant-btn ant-btn-primary">
                        <IconPlus/> Qo'shish
                    </Link>
                </Col>
            </Row>
            <AppTable type={GET_ORDER_TYPES} columns={columns} data={data}/>
        </div>
    )
}

const Buttons = ({item})=>{
    const [post,loader]= usePost();
    const dispatch = useDispatch();
    const onArchive = ()=>{
        post(`${CHANGE_STATUS_ORDER_TYPES}${item.id}/`,{},
            ()=>{
                dispatch({
                    type: 'reload',
                    payload: Math.random()
                })
            }
        )
    }
    return(
        <div>
            <div>
                <ButtonLink onClick={onArchive} className={item.is_archive ? '' : 'text-danger'}>
                    {
                        item.is_archive ?
                            <>
                                <IconUnLock/> Arxivdan chiqarish
                            </>:
                            <>
                                <IconLock/> Arxivlash
                            </>
                    }
                </ButtonLink>
            </div>
            <div>
                <Link to={`add/${item.id}`} className="ant-btn-link">
                   <IconEdit/> Taxrirlash
                </Link>
            </div>
        </div>
    )
}


const stp = state =>{
    return{
        data: state.orderTypes || []
    }
}
export default connect(stp)(ListData)