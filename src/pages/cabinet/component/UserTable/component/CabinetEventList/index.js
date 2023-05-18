import {connect} from "react-redux";
import {Modal, Row} from "antd";
import AppTabel from "../../../../../../components/AppTabel";
import {GET_USER_CALENDAR_VIEW} from "../../../../../../store/types";
import {useState} from "react";

const Title = ({date})=>{
    return  <Row justify='space-between'>
                <div>
                    <strong>Kirish-chiqishlar tarixi</strong>
                </div>
                <div className="pr-5">
                    <strong>{date}</strong>
                </div>
            </Row>
}

function CabinetEventList({selectedDay,isShow,onClose,calendarViews, userId = null}){
    const [query,setQuery] = useState({
        date: selectedDay,
        user_id: userId,
    })
    const [columns,setColumns] = useState([
        {
            title: "Turi",
            dataIndex: 'type',
            render:(_,col)=>{
                return col.type === 'out' ? 'Chiqish' : 'Kirish'
            }
        },{
            title: 'Hona raqami',
            dataIndex: 'room',
        },{
            title: 'Vaqti',
            dataIndex: 'time',
            render: (_,col)=>{
                return( new Date(col.time).toLocaleTimeString())
            }
        }
    ])
    return(
        <Modal
            width="70%"
            title={<Title date={selectedDay}/>}
            visible={isShow}
            footer={null}
            onCancel={onClose}
        >
            <AppTabel search={query} data={calendarViews} columns={columns} type={GET_USER_CALENDAR_VIEW}/>
        </Modal>
    )
}
const stp = (state)=>{
    return{
        calendarViews: state.calendarViews || []
    }
}
export default connect(stp)(CabinetEventList)