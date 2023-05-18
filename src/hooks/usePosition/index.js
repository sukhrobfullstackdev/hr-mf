import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_POSITIONS} from "../../store/types";
import {useNavigate} from "react-router-dom";

function usePositions(){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const [data,setData] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(Object.keys(user).length){
            Req({
                type: GET_POSITIONS,
                query:{
                    tin: user.inn
                }
            })
                .then(res=>{
                    if(Array.isArray(res.data)){
                        setData(res.data);
                    }else{
                        const data = 'results' in res.data ? res.data.results : 'data' in res.data ? res.data.data : res.data;
                        setData(data);
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
        }
    },[user]);
    return data
}
export default usePositions;