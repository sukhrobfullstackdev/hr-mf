import {Button, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {IconEdit, IconPlus, IconTrash} from "../../../../components/Icon";
import AppTable from "../../../../components/AppTabel";
import {GET_ORGAN_CHILDREN} from "../../../../store/types";
import {useState} from "react";
import {connect} from "react-redux";

function ListData({childOrgans}){
    const [columns,setColumns] = useState([
        {
            title: 'T/R',
            dataIndex: 'tr',
            render:(_,col,index)=>{
                return(
                    index+1
                )
            }
        },{
            title: 'Tashkilot nomi',
            dataIndex: 'name'
        },{
            title: 'Tashkilot raxbari',
            dataIndex: 'full_name'
        },{
            title: 'Tashkilot STIR si',
            dataIndex: 'organization_tin'
        },{
            title: 'Korxona kodi',
            dataIndex: 'chapter_code',
            render: (_,col)=>{
                return(
                    <div>
                        <div> Bo'lim kodi: {col.chapter_code}</div>
                        <div> Kichik bo'lim kodi: {col.department_code},</div>
                        <div> Bob kodi: {col.small_department_code}</div>
                    </div>
                )
            }
        },{
            title: 'Amallar',
            dataIndex: 'action',
            width: '20%',
            render:(_,col)=>{
                return(
                    <div className="text-right">
                        <Button size="small" type="danger" className="mr-2">
                            <IconTrash/> O'chirish
                        </Button>
                        <Link to={`${col.id}`} className="ant-btn ant-btn-primary ant-btn-sm">
                            <IconEdit/> Taxrirlash
                        </Link>
                    </div>
                )
            }
        },
    ])
    return(
        <div>
            <Row gutter={16} align="middle" justify="space-between" className="mb-4">
                <Col span={12}>
                    <h3 className="m-0">
                        <strong>Quyi korxona va tashkilotlar</strong>
                    </h3>
                </Col>
                <Col span={12} className="text-right">
                    <Link to='add' className="ant-btn ant-btn-primary">
                        <IconPlus/> Qo'shish
                    </Link>
                </Col>
            </Row>
            <AppTable expandedRowRender={null} columns={columns} type={GET_ORGAN_CHILDREN} data={childOrgans}/>
        </div>
    )
}
const stp = (state)=>{
    return{
        childOrgans: state.childOrgans || []
    }
}
export default connect(stp)(ListData);