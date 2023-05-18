import {useEffect, useState} from "react";
import AppTabel from "../../components/AppTabel";
import {connect, useDispatch} from "react-redux";
import {GET_NOTICE, REMOVE_NOTICE} from "../../store/types";
import {Col, Dropdown, Row} from "antd";
import {Link} from "react-router-dom";
import {
    IconCheckMark,
    IconDotsHorizontal,
    IconEdit,
    IconEye, IconFile,
    IconFillUsers,
    IconPlus,
    IconTrash
} from "../Icon";
import StatusBadge from "../../styleComponents/StatusBadge";
import ButtonDefault, {ButtonLink} from "../../styleComponents/ButtonDefault";
import usePost from "../../hooks/usePost";
import Small from "../../styleComponents/Small";


const ListUserByNotice = ({list = []})=>{
    return(
        <div>
            {
                list.map(user=>{
                    return (
                        <div className="px-2 py-1" key={`userNotice${user.id}`}>
                            {user.staff.full_name}
                        </div>
                    )
                })
            }
        </div>
    )
}
const ButtonList = ({item,user})=>{
    const dispatch = useDispatch();
    const [post,loader] = usePost();
    const [urlView,setUrlView] = useState(`/cabinet/notice/view/${item.id}`);
    useEffect(()=>{
        if(user && 'current_role' in user && user.current_role ==='HO'){
            setUrlView(`/dashboard/notice/view/${item.id}`);
        }
    },[user]);
    const onRemove = ()=>{
        post(`${REMOVE_NOTICE}${item.id}`,null,()=>{
            dispatch({
                type: 'reload',
                payload: Math.random()
            })
        })
    }

    return(
        <>
            {
                (item.status === 'new' || item.status === 'rejected') && ( user && 'current_role' in user && user.current_role !=='HO') ?
                    <>
                        <Link to={`/cabinet/notice/update/${item.id}`} className="ant-btn-block ant-btn-link">
                            <IconEdit/> Taxrirlash
                        </Link>
                        <ButtonLink disabled={loader} onClick={onRemove} className="ant-btn-block ant-btn-link text-left ant-btn-link-danger">
                            <IconTrash/> O'chirish
                        </ButtonLink>
                    </> : ""
            }
            {
                item.status === 'confirmed' ?
                    <a className="ant-btn-link" href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/v1/notice/${item.id}/pdf/`} target="_blank">
                        <IconFile/> .pdf ko'rish
                    </a>:''
            }
            <Link to={urlView} className="ant-btn-block ant-btn-link">
                <IconEye/> Ko'rish
            </Link>
        </>
    )
}
function Notice({notice,loader,user}){
    const [columns,setColumns] = useState([
        {
            title: 'Id',
            dataIndex: 'id'
        },{
            title: "Turi",
            dataIndex: "type",
            render:(_,col)=>{
                return(
                    col.type === "premium_employees" ? "Hodimga shaxsiy ustama belgilash" : "Mexnat safari"
                )
            }
        },{
            title: "Raqami",
            dataIndex: "confirmed_number",
            render:(_,col)=>{
                return(
                    col.confirmed_number === "" ? <span className="text-muted">Mavjud emas!</span> : col.confirmed_number
                )
            }
        },{
            title: "Mazmuni",
            dataIndex: "text",
            width: '30%',
            render:(_,col)=>{
                return(
                    <span className="text-ellipses-3">{col.text}</span>
                )
            }
        },{
            title: "Hodim (lar)",
            dataIndex: "status",
            render:(_,col)=>{
                return(
                    col.premiums.length ?
                        col.premiums.length > 1 ?
                            <Dropdown overlay={<ListUserByNotice list={col.premiums}/>} placement="bottomLeft">
                                <ButtonDefault>
                                    <IconFillUsers/> Hodimlar
                                </ButtonDefault>
                            </Dropdown>
                            : col.premiums[0].staff.full_name :
                        <Small className={"small text-muted"}>Biriktirilmagan</Small>
                )
            }
        },{
            title: "Holati",
            dataIndex: "status",
            render:(_,col)=>{
                return(
                    col.status ?
                        <StatusBadge status={col.status}/>:
                        <Small className={"small text-muted"}>Mavjud emas!</Small>
                )
            }
        },{
            title: "Amallar",
            dataIndex: "action",
            render:(_,col)=>{
                return(
                    <div className="text-center">
                        <Dropdown overlay={<ButtonList user={user} item={col}/>} placement="bottomLeft">
                            <ButtonDefault className="text-muted">
                                <IconDotsHorizontal/>
                            </ButtonDefault>
                        </Dropdown>
                    </div>
                )
            }
        }
    ]);
    return(
        <div>
            <Row align="middle">
                <Col span={12}>
                    <h3 className="py-4 m-0">
                        <strong>
                            Bildirgilar
                        </strong>
                    </h3>
                </Col>
                {
                    user && 'current_role' in user && user.current_role !== 'HO'?
                        <Col span={12} className="text-right">
                            <Link to={'/cabinet/notice/add'}>
                                <IconPlus/> Yangi yaratish
                            </Link>
                        </Col>:''
                }
            </Row>
            <AppTabel type={GET_NOTICE} data={notice} loader={loader} columns={columns}/>
        </div>
    )
}
const stp = state=>(
    {
        loader: state.loader,
        notice: state.notice || [],
        user: state.isUser || null
    }
)
export default connect(stp)(Notice);