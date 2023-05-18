import {useCallback, useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_ALL_CHATS} from "../../store/types";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

export function useChat(props){
    const reload = useSelector(s=>s.reload);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [data,setData] = useState([]);
    const [loader,setLoader] = useState(false);
    const set = useCallback((newData)=>{
        setData(newData);
    },[])
    const get = (cb)=>{
        cb(data)
    }
    useEffect(()=>{
        setLoader(true);
        Req({
            type: GET_ALL_CHATS
        }).then(res=>{
            setData(res.data);
            dispatch({
                type: "userAndChats",
                payload: res.data
            });
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
        }).finally(()=>{
            setLoader(false);
        })
    },[reload]);
    return [data, loader, set, get]
}