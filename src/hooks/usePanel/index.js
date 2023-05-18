import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_TOTAL_COUNTS} from "../../store/types";
import {useNavigate} from "react-router-dom";

function usePanel(){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const [data,setData] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(Object.keys(user).length){
            dispatch({
                type: 'loader',
                payload: true
            })
            Req({
                type: GET_TOTAL_COUNTS,
                query:{
                    tin: user.inn
                }
            })
                .then(res=>{
                    dispatch({
                        type: 'loader',
                        payload: false
                    })
                    setData(res.data);
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
                    dispatch({
                        type: 'loader',
                        payload: false
                    })
                })
        }
    },[user]);
    return data;
}
export default usePanel;