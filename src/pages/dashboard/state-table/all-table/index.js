import {Card} from "antd";
import AppTable from "../../../../components/AppTabel";
import {useState} from "react";
import {GET_ALL_TIME_TABLE} from "../../../../store/types";
import {connect} from "react-redux";

function DashboardAllTable({allTimeTable}){
    const [columns, setColumns] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: "Vaqt bo'yicha turi",
            dataIndex: 'name',
            render: (_,record)=>{
                return <strong>{record.name}</strong>
            }
        },{
            title: 'Amallar',
            dataIndex: 'status',
        }
    ]);
    return(
        <Card>
            <h3 className="m-0 pb-3 border-bottom">
                <strong>Tabellar</strong>
            </h3>
            <AppTable columns={columns} data={allTimeTable} type={GET_ALL_TIME_TABLE}/>
        </Card>
    )
}
const stp = (state)=>{
    return{
        allTimeTable: state.allTimeTable || []
    }
}
export default connect(stp)(DashboardAllTable);