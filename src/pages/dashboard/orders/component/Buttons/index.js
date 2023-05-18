import {Link} from "react-router-dom";
import {
    IconCheckMark,
    IconClose,
    IconDotsHorizontal,
    IconDownload,
    IconEdit, IconEye,
    IconTrash
} from "../../../../../components/Icon";
import {Button, Dropdown} from "antd";
import {REMOVE_COMMAND, REMOVE_ORGAN} from "../../../../../store/types";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo} from "react";
import useOrder from "../../../../../hooks/useOrder";
import ButtonDefault, {ButtonLink} from "../../../../../styleComponents/ButtonDefault";


function SwitchButton({item = {}}){
    const dispatch = useDispatch();
    const {check,confirmed,status,loader} = useOrder();
    const user = useSelector(s=>s.isUser || {});
    const onRemove =()=>{
        dispatch({
            type: REMOVE_COMMAND,
            payload: item.id
        })
    };
    const onConfirm = ()=>{
        if(user.current_role === "HR"){
            check(item.id);
        }
        if(user.current_role === 'HO'){
            confirmed(item.id);
        }
    }
    useEffect(()=>{
        if(status){
            dispatch({
                type: 'toast',
                payload: {
                    type: status,
                    message: status === 'error' ? "Hatolik! Qayta urunib ko'ring!" :  "Saqlandi!"
                }
            })
        }
        if(status && status !=='error'){
            dispatch({
                type: 'reload',
                payload: Math.random()
            });
        }
    },[status]);
    return <div className="text-left">
                    {
                        item.status === 'confirmed' ?
                            <div>
                                <a href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/v1/command-pdf/${item.id}/`} target={"_blank"} className="ant-btn-link ant-btn-block">
                                    <IconDownload/>.pdf
                                </a>
                            </div>: ""
                    }
                    {
                        (item.status === 'new' || item.status === 'rejected') && user.current_role === 'HR' ?
                            <div>
                                <Link disabled={loader} to={`/dashboard/orders/${item.id}`}  className="text-left ant-btn-link ant-btn-block">
                                    <IconEdit color="#fff"/> Tahrirlash
                                </Link>
                            </div>:""
                    }
                    {
                        (item.status === 'new' && user.current_role === 'HR') ?
                            <div>
                                <ButtonLink disabled={loader} className="text-left ant-btn-link ant-btn-block" onClick={onConfirm}>
                                    <IconCheckMark/> Tasdiqlash
                                </ButtonLink>
                            </div>:""
                    }
                    {
                        item.status === 'new' && user.current_role === 'HR' ?
                            <div>
                                <ButtonLink disabled={loader} className="text-left ant-btn-link ant-btn-block ant-btn-link-danger" onClick={onRemove}>
                                    <IconTrash color="#fff"/> O'chirish
                                </ButtonLink>
                            </div> : ""
                    }
                    <Link to={`/dashboard/orders/view/${item.id}`} className='text-left ant-btn-link ant-btn-block'>
                        <IconEye/> Ko'rish
                    </Link>
                </div>
}

function Buttons({item}){
    return  useMemo(()=>{
        return (
            <Dropdown overlay={<SwitchButton item={item}/>}>
                <div className="text-center">
                    <ButtonDefault className="text-muted">
                        <IconDotsHorizontal/>
                    </ButtonDefault>
                </div>
            </Dropdown>
        )
    },[item])
}
export default Buttons