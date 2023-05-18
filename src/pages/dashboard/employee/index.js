import {Card, Col, Row, Skeleton} from "antd";
import {Link, Outlet, useOutlet} from "react-router-dom";
import {GET_EMPLOYEE_FOR_ADMIN} from "../../../store/types";
import {connect, useSelector} from "react-redux";
import useGet from "../../../hooks/useGet";
import {IconPlus} from "../../../components/Icon";
import AppTable from "../../../components/AppTabel";
import {useState} from "react";
import UserAvatar from "../../../styleComponents/UserAvatar";

function Employee({adminusers}){
    const loader = useSelector(s=>s?.loader);
    const staffs = useGet(GET_EMPLOYEE_FOR_ADMIN);
    const outlet = useOutlet();
    const [column,setColumn] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: 'Avatar',
            width: '4%',
            render: (_,record)=>{
                return <UserAvatar user={record}/>
            }
        },{
            title: 'F.I.Sh.',
            dataIndex: "full_name",
            render: (_,record)=>{
                return  <>
                            <strong className="text-capitalize">{record.full_name.toLowerCase()}</strong>
                            <div className="text-muted small">
                                Rol: {record.role.join(', ')}
                            </div>
                        </>
            }
        },{
            title: 'Email',
            dataIndex: "email"
        },{
            title: 'Passport',
            dataIndex: "passport_seria"
        },
    ])
    return(
        outlet ? <Outlet/>:
        <Row justify='end' align='middle'>
            <Col span={20}>
                <h3>
                    <strong>Hodimlar</strong>
                </h3>
            </Col>
            <Col span={4} className="text-right">
                <Link className="ant-btn ant-btn-primary" to={`/dashboard/employee/add`}>
                    <IconPlus color={"#fff"}/> Qo'shish
                </Link>
            </Col>
            <Col span={24}>
                <AppTable type={GET_EMPLOYEE_FOR_ADMIN} columns={column} data={adminusers}/>
            </Col>
        </Row>
    )
}
const stp = (state)=>{
    return{
        adminusers: state.adminusers || []
    }
}
export default connect(stp)(Employee);