import {useEffect, useState} from "react";
import Req from "../../store/api";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function useGetById(type,id){
    const [data,setData] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(type && id){
            dispatch({
                type: 'loader',
                payload: true
            })
            Req({
                type: `${type}${id}`,
            }).then(res=>{
                setData(res.data.data ? res.data.data : res.data);
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
    },[])
    return data;
}
export default useGetById;