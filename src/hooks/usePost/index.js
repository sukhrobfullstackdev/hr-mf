import {useCallback, useState} from "react";
import Req from "../../store/api";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function usePost(toast=true){
    const dispatch = useDispatch();
    const [loader,setLoader] = useState(false);
    const [res,setRes] = useState(null);
    const navigate = useNavigate();
    const post = useCallback((type,data,cb = null)=>{
        setLoader(true);
        Req({
            type: type,
            data: data
        }).then(res=>{
            setRes(res);
            if(toast){
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'success',
                        message: "Saqlandi!"
                    }
                });
            }
            if(cb && typeof cb === 'function'){
                cb(res.data);
            }
        }).catch(err=>{
            const {data,status} = err.response;
            if(status < 500){
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: data?.detail
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
        }).finally(()=>{
            setLoader(false);
        })
    },[]);
    return [post,loader,res];
}
export default usePost;