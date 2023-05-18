import {Badge, Button, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {IconEdit, IconPlus, IconTrash} from "../../../../../components/Icon";
import AppTable from "../../../../../components/AppTabel";
import {GET_USERS, REMOVE_USERS} from "../../../../../store/types";
import {connect, useDispatch} from "react-redux";
import {useState} from "react";

function ListData({register  = []}){
    const [columns, setColumns] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: 'F.I.Sh.',
            dataIndex: 'full_name',
        },{
            title: 'Login',
            dataIndex: 'username',
        },{
            title: 'Elektron pochta',
            dataIndex: 'email',
        },{
            title: 'Tel. raqam',
            dataIndex: 'mob_phone_no',
            render:(_,record)=>{
                return  <span className={record.mob_phone_no ? '' : 'text-light'}>
                            {
                                record.mob_phone_no ? record.mob_phone_no : 'Mavjud emas!'
                            }
                        </span>
            }
        },{
            title: 'Holati',
            dataIndex: 'status',
            render:(_,record)=>{
                return(
                    <div className="text-center">
                        <Badge
                            className="site-badge-count-109"
                            count={record.is_active ? 'Active' : 'Not active'}
                            style={{ backgroundColor: record.is_active ? '#52c41a':'#f5222d' }}
                        />
                    </div>
                )
            }
        },{
            title: 'Amallar',
            dataIndex: 'operation',
            width: '20%',
            render: (_, record) => {
                return(
                    <div className="text-center">
                        <Link to={`dashboard/organs/${record.id}`}  className="ant-btn ant-btn-primary mr-2 ant-btn-sm">
                            <IconEdit color="#fff"/> Tahrirlash
                        </Link>
                        <Button type='danger' size="small" onClick={()=>onRemove(record.id)}>
                            <IconTrash color="#fff"/> Remove </Button>
                    </div>
                )
            },
        },
    ]);
    const dispatch = useDispatch();
    const onRemove =(id)=>{
        dispatch({
            type: REMOVE_USERS,
            payload: id
        })
    }
    return(
        <Row justify='end' align='middle'>
            <Col span={20}>
                <h3>
                    <strong>Foydalanuvchilar</strong>
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
                    data={register}
                    type={GET_USERS}
                />
            </Col>
        </Row>
    )
}
export default connect(
    (state)=>{
        return {
            register: state?.register || []
        }
    }
)(ListData);