import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_STRUCTURE} from "../../store/types";

function useStructure(props){
    const dispatch = useDispatch();
    const isUser = useSelector(s=>s.isUser || null);
    const [data,setData] = useState([]);
    useEffect(()=>{
        if(isUser){
            dispatch({
                type: 'loader',
                payload: true
            })
            Req({
                type: GET_STRUCTURE,
            })
                .then(res=>{
                    dispatch({
                        type: 'loading',
                        payload: false
                    })
                    setData(res.data.data);
                    dispatch({
                        type: 'loader',
                        payload: false
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
                dispatch({
                    type: 'loader',
                    payload: true
                })
            })

        }
    },[]);
    return data;
}
export default useStructure;