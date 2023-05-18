import {useState,useEffect, useMemo} from "react";
import AppTabel from "../../../../../components/AppTabel";
import {
    COMMAND_GENERATE,
    CONFIRMED_DISMISS_SHEET,
    GET_COMMAND_APPROVERS,
    GET_DISMISS_SHEET, GET_ONE_DISMISS_SHEET,
    REMOVE_GET_DISMISS_SHEET
} from "../../../../../store/types";
import {connect, useDispatch, useSelector} from "react-redux";
import {Button, Col, Dropdown, Popover, Row} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {
    IconCheckMark, IconClose,
    IconDotsHorizontal,
    IconEdit,
    IconFile,
    IconFileText,
    IconPlus,
    IconTrash
} from "../../../../../components/Icon";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import {useGetDynamic} from "../../../../../hooks/useGet";
import usePost from "../../../../../hooks/usePost";
import Req from "../../../../../store/api";

function ListData({dismissSheet}){
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
        {
            title: "Amallar",
            dataIndex: 'action',
            render:(_,col)=>{
                return(
                    <Dropdown overlay={<ListButtons item={col}/>}>
                        <ButtonDefault className="text-center w-100 text-muted">
                            <IconDotsHorizontal/>
                        </ButtonDefault>
                    </Dropdown>
                )
            }
        },
    ]);
    return(
        <>
            <Row className="mb-4">
                <Col span={20}>
                    <h3>
                        <strong>
                            Ishdan bo'shash varaqasi
                        </strong>
                    </h3>
                </Col>
            </Row>
            <AppTabel columns={columns} type={GET_DISMISS_SHEET} data={dismissSheet}/>
        </>

    )
}
function ListButtons({item}){
    const navigate = useNavigate()
    const user = useSelector(s=>s.isUser || null);
    const [generateLoader,setGenerateLoader] = useState(false);
    const [post,loader] = usePost();
    const dispatch = useDispatch();
    const onRequest = (status)=>{
        post(CONFIRMED_DISMISS_SHEET,{
            dismiss_sheet_id: item.id,
            status: status
        },()=>{
            dispatch({
                type:'reload',
                payload: Math.random()
            })
        })
    }
    const onConfirmed = ()=>{
        onRequest('confirmed')
    }
    const onRejected = ()=>{
        onRequest('rejected')
    }
    const onRemove=()=>{
        post(`${REMOVE_GET_DISMISS_SHEET}${item.id}`,null,()=>{
            dispatch({
                type:"reload",
                payload: Math.random()
            })
        })
    }
    const onDownloadPDF=()=>{
        Req({
            type: `${GET_ONE_DISMISS_SHEET}${item.id}/get_pdf/`
        }).then(res=>{
            window.open(`${res.data.pdf_file}`, "_blank");
        }).catch(err=>{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Hatolik qayta urinib ko'ring!"
                }
            })
        })
    }
    const onGenerateOrder = ()=>{
        setGenerateLoader(true)
        Req({
            type: COMMAND_GENERATE,
            data: {
                application: item.application
            }
        }).then(res=>{
            navigate(`/dashboard/orders/${res.data.id}`)
        }).catch(err=>{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Hatolik qayta urinib ko'ring!"
                }
            })
        }).finally(()=>{
            setGenerateLoader(false)
        })
    }
    return(
        <>
            {
                item.status === 'confirmed' && user.current_role === "HR" ?
                    <ButtonDefault disabled={generateLoader} className="text-left ant-btn-block ant-btn-link" onClick={onGenerateOrder}>
                        <IconFileText/> Buyruq shakillantirish
                    </ButtonDefault> :""
            }
            {
                (item.status === 'progress' || item.status === 'rejected' )&& user && user.current_role === 'HR' ?
                    <>
                        <Link to={`/dashboard/dismiss-sheet/update/${item.id}`} className="ant-btn-block ant-btn-link">
                            <IconEdit/> Taxrirlash
                        </Link>
                        <ButtonDefault disabled={loader} className="ant-btn-link ant-btn-link-danger" onClick={onRemove}>
                            <IconTrash/> O'chirish
                        </ButtonDefault>
                    </>: ""
            }
            {
                item.status === 'approved' && user.current_role === 'HO' ?
                    <>
                        <ButtonDefault onClick={onConfirmed} className="text-left ant-btn-link ant-btn-block">
                            <IconCheckMark/> Tasdiqlash
                        </ButtonDefault>
                        <ButtonDefault onClick={onRejected} className="text-left ant-btn-link ant-btn-link-danger ant-btn-block">
                            <IconClose/> Bekor qilish
                        </ButtonDefault>
                    </>
                   : ""

            }
            {
                item.status === 'confirmed' ?
                    <ButtonDefault onClick={onDownloadPDF} className="text-left ant-btn-link ant-btn-block">
                        <IconFile/> PDF yuklab olish
                    </ButtonDefault> : ""
            }
        </>
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
const stp = (state)=>{
    return{
        dismissSheet: state.dismissSheet || [],
        loader: state.loader
    }
}
export default connect(stp)(ListData);