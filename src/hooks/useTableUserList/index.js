import {useCallback, useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_TABLE_USER_LIST} from "../../store/types";

export default function useTableUserList(date){
    const [data,setDate] = useState([]);
    const [loader,setLoader] = useState(false);
    useEffect(()=>{
        if(date){
            setLoader(true);
            Req({
                type: GET_TABLE_USER_LIST,
                query:{
                    date
                }
            }).then(res=>{
                setDate(res.data.results);
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
            })
            .finally(()=>{
                setLoader(false);
            })
        }
    },[]);
    return {
        data,
        loader,
    }
}