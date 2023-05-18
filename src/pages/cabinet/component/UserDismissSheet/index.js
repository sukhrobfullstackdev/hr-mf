import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useMemo, useState} from "react";
import {GET_COMMAND_APPROVERS, GET_USER_DISMISS_SHEET} from "../../../../store/types";
import {Link} from "react-router-dom";
import {Popover} from "antd";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import StatusBadge from "../../../../styleComponents/StatusBadge";
import AppTabel from "../../../../components/AppTabel";
import {connect} from "react-redux";

function UserDismissSheet({userDismissSheet,loader}){
    const [columns,setColumns] = useState([
        {
            title: "Id",
            width: '5%',
            dataIndex: 'id'
        },
        {
            title: "Hodim",
            dataIndex: 'user',
            render:(_,col)=>{
                return(
                    <span className="text-capitalize">
                        {col?.staff.full_name.toLowerCase()}
                    </span>
                )
            }
        },
        {
            title: "Ariza raqami",
            dataIndex: 'application',
            render:(_,col)=>{
                return(
                    <Link to={`/dashboard/appeal/view/${col.application}`} target="_blank">
                        No:{col.application}
                    </Link>
                )
            }
        },
        {
            title: 'Holati',
            dataIndex: 'status',
            render:(_,record)=>{
                return record.approvers.length ?
                    <Popover placement="topLeft" title={"Kelishuvchilar"} content={<ListApprovals list={record.approvers}/>} trigger="hover">
                        <ButtonDefault className="p-0">
                            <StatusBadge status={record.status}/>
                        </ButtonDefault>
                    </Popover>
                    :<StatusBadge status={record.status}/>
            }
        },
        // {
        //     title: "Amallar",
        //     dataIndex: 'action',
        //     render:(_,col)=>{
        //         return(
        //             <Dropdown overlay={<ListButtons item={col}/>}>
        //                 <ButtonDefault className="text-center w-100 text-muted">
        //                     <IconDotsHorizontal/>
        //                 </ButtonDefault>
        //             </Dropdown>
        //         )
        //     }
        // },
    ]);
    return(
        <AppTabel loader={loader} columns={columns} type={GET_USER_DISMISS_SHEET} data={userDismissSheet}/>
    )
}
function ListApprovals({list = []}){
    const [approvals,getApprovals,loaderApprovals] = useGetDynamic();
    useEffect(()=>{
        if(!approvals.length){
            getApprovals(GET_COMMAND_APPROVERS);
        }
    },[])
    return useMemo(()=>{
        return list.map(item=>{
            return  (
                <div className="small">
                    <StatusBadge status={item.status}>
                        {
                            approvals.find(v=> v.id === item.staff.id)?.full_name
                        }
                    </StatusBadge>
                </div>
            )
        });
    },[list, approvals]);
}
const stp = state=> (
    {
        userDismissSheet: state.userDismissSheet || [],
        loader: state.loader
    }
)
export default connect(stp)(UserDismissSheet)