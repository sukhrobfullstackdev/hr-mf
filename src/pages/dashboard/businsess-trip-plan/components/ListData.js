import {Card, Col, Dropdown, Row} from "antd";
import {Link} from "react-router-dom";
import {IconDotsHorizontal, IconDotsVertical, IconPlus} from "../../../../components/Icon";
import AppTabel from "../../../../components/AppTabel";
import {useState} from "react";
import {GET_BUSINESS_TRIP_PLAN} from "../../../../store/types";
import {connect} from "react-redux";
import StatusBadge from "../../../../styleComponents/StatusBadge";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import BusinessTripButton from "./BusinessTripButton";


function ListData({data}){
    const [columns,setColumns] = useState([
        {
            title: 'T/R',
            dataIndex: 'tr',
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
            title: 'Asos',
            dataIndex: 'cause'
        },
        {
            title: 'Maqsad',
            dataIndex: 'purpose'
        },
        {
            title: 'Davr',
            dataIndex: 'date_from',
            render:(_,col)=>{
                return(
                    <div className="text-center">
                        <strong className="px-1">
                            {col.date_from}
                        </strong>dan
                        <strong className="px-1">
                            {col.date_to}
                        </strong>gacha
                    </div>
                )
            }
        },
        {
            title: 'Hodimlar',
            dataIndex: 'staffs',
            render:(_,col)=>{
                return(
                    <div className="text-center">
                        {col.licences.length} ta
                    </div>
                )
            }
        },
        {
            title: 'Holati',
            dataIndex: 'status',
            render:(_,col)=>{
                return(
                    <StatusBadge status={col.status}/>
                )
            }
        },
        {
            title: 'Amallar',
            dataIndex: 'acion',
            width: '5%',
            render:(_,col)=>{
                return(
                    <div className="text-center">
                        <Dropdown overlay={<BusinessTripButton item={col}/>}>
                            <ButtonDefault className="text-muted">
                                <IconDotsHorizontal/>
                            </ButtonDefault>
                        </Dropdown>
                    </div>
                )
            }
        }
    ])
    return(
        <div>
            <Row justify="space-between" className="mb-4">
                <Col span={12}>
                    <h4 className="mb-0">
                        <strong>Xizmat safar rejalari</strong>
                    </h4>
                </Col>
                <Col span={12} className="text-right">
                    <Link to={'add'} className="ant-btn ant-btn-primary">
                        <IconPlus/> Yangi reja
                    </Link>
                </Col>
            </Row>
            <AppTabel type={GET_BUSINESS_TRIP_PLAN} data={data} columns={columns}/>
        </div>
    )
}
const stp =(state)=>{
    return{
        data: state.businessPlan || []
    }
}
export default connect(stp)(ListData)