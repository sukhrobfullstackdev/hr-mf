import {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import Req from "../../store/api";
import {useNavigate} from "react-router-dom";

function useGet(type,query={}){
    const dispatch = useDispatch();
    const tablePage = useSelector(s=>s.tablePage || 1);
    const [data,setData] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        if(type){
            dispatch({
                type: 'loader',
                payload: true
            })
            query = tablePage > 1 ? {...query, page: tablePage} : query
            Req({
                type: type,
                query
            }).then(res=>{
                if(Array.isArray(res.data)){
                    setData(res.data);
                }else{
                    const data = 'results' in res.data ? res.data.results : 'data' in res.data ? res.data.data : res.data;
                    setData(data);
                    if('count' in res.data){
                        dispatch({
                            type: 'tableCount',
                            payload: res.data.count
                        })
                    }
                }
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
                dispatch({
                    type: 'loader',
                    payload: false
                })
            })
        }
    },[tablePage]);
    return data
}
export function useGetDynamic(isLoader = true){
    const [data,setData] = useState([]);
    const [loader,setLoader] = useState(true);
    const [totalCount,setTotalCount] = useState(0)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const get = (type = null, query = {}, isTable = true)=>{
        if(type){
            const opt = {
                type,query
            }
            setLoader(true);
            Req(opt)
                .then(res=>{
                if(Array.isArray(res.data)){
                    setData(res.data);
                }else{
                    const data = 'results' in res.data ? res.data.results : 'data' in res.data ? res.data.data : res.data;
                    setData(data);
                    if('count' in res.data && isTable){
                        setTotalCount(res.data.count)
                        dispatch({
                            type: 'tableCount',
                            payload: res.data.count
                        })
                    }
                }
            })
                .catch(err=>{
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
            })
                .finally(()=>{
                    // console.log("Finaly")
                setLoader(false);
            })
        }
    }
    return [data,get,loader,setLoader,totalCount]
}

export function useSimpleGet(){
    const [data,setData] = useState([]);
    const [loader,setLoader] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const get = (type = null, query = {})=>{
        if(type){
            const opt = {
                type,query
            }
            setLoader(true);
            Req(opt).then(res=>{
                    setData(res.data);
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
        }
    }
    return [data,get,loader,setLoader]
}
export default useGet;
