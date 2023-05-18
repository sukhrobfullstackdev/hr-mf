import Req from "../../store/api";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

function useOrder(){
    const [loader,setLoader] = useState(false);
    const [status,setStatus] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const api = (type,data = {})=>{
        if(type){
            setLoader(true)
            Req({
                type: `post v1/${type}`,
                data: data
            }).then(res=>{
                setStatus('success');
                dispatch({
                    type: 'reload',
                    payload: Math.random()
                })
            }).catch(err=>{
                const {data,status} = err.response;
                if(status < 500){
                    dispatch({
                        type: 'toast',
                        payload: {
                            type: 'error',
                            message: data?.message
                        }
                    });
                    if(status === 401 || status === '401'){
                        localStorage.removeItem('token');
                        dispatch({
                            type: 'isUser',
                            payload: null
                        });
                        navigate('/login')
                    }
                }else{
                    dispatch({
                        type: 'toast',
                        payload: {
                            type: 'error',
                            message: "Tizim hatoligi qayta urinib ko'ring!"
                        }
                    });
                }
                setStatus('error');
            }).finally(()=>{
                setLoader(false)
            })
        }
    }
    const approved = (id)=>{
        api(`approvals/${id}/approve/`);
    }
    const check = (id)=>{
        api(`command/${id}/check/`,{
            status: 'checked'
        });
    }
    const confirmed = (id, body)=>{
        api(`command/${id}/confirm/`,{
            ...body,
            status: 'confirmed'
        });
    }
    const rejected = (id, body)=>{
        api(`command/${id}/confirm/`,{
            ...body,
            status: 'rejected'
        });
    }
    return {
        approved,
        confirmed,
        check,
        rejected,
        loader,status
    };
}
export default useOrder;