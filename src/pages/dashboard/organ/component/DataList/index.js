import {useState} from "react";
import {Link, Outlet, useOutlet} from "react-router-dom";
import {IconEdit, IconPlus, IconTrash} from "../../../../../components/Icon";
import {Button, Col, Row} from "antd";
import {connect, useDispatch} from "react-redux";
import {GET_ORGAN, REMOVE_ORGAN} from "../../../../../store/types";
import AppTable from "../../../../../components/AppTabel";

function DataList({organs = []}){
    const [columns, setColumns] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: 'Tashkilot',
            dataIndex: 'head_organization',
            render: (_,record)=>{
                return  <>
                    <p className="m-0">Nomi: {record.name || 'Mavjud emas!'}</p>
                    <p className="m-0 small text-muted">
                        Direktor:
                        {
                            record.head_org && 'full_name' in record.head_org ?
                                record.head_org.full_name.toUpperCase():
                                "Biriktirilmagan"
                        }
                    </p>
                </>

            }
        },{
            title: 'Toifasi',
            dataIndex: 'organ_types',
        },{
            title: 'INN',
            dataIndex: 'organization_tin',
        },{
            title: 'Holati',
            dataIndex: 'status',
            render:(_,record)=>{
                return(
                    <span className="short-text-2">{record.titleEn}</span>
                )
            }
        },{
            title: 'Amallar',
            dataIndex: 'operation',
            width: '20%',
            render: (_, record) => {
                return(
                    <div className="text-center">
                        <Link to={`/dashboard/organ/${record.id}`}  className="ant-btn ant-btn-primary mr-2 ant-btn-sm">
                            <IconEdit color="#fff"/> Tahrirlash
                        </Link>
                        <Button type='danger' size="small" onClick={()=>onRemove(record.id)}>
                            <IconTrash color="#fff"/> Remove
                        </Button>
                    </div>
                )
            },
        },
    ]);
    const dispatch = useDispatch();
    const outlet = useOutlet();
    const onRemove =(id)=>{
        dispatch({
            type: REMOVE_ORGAN,
            payload: id
        })
    }
    return(
        outlet ? <Outlet/>:
            <Row justify='end' align='middle'>
                <Col span={20}>
                    <h3>
                        <strong>Tashkilotlar</strong>
                    </h3>
                </Col>
                <Col span={4} className="text-right">
                    <Link className="ant-btn ant-btn-primary" to={`add`}>
                        <IconPlus color="#fff"/> Qo'shish
                    </Link>
                </Col>
                <Col span={24}>
                    <AppTable
                        columns={columns}
                        data={organs}
                        type={GET_ORGAN}
                    />
                </Col>
            </Row>
    )
}

export default connect(
    (state)=>{
        return {
            organs: state?.organs
        }
    }
)(DataList);