import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_SECTION} from "../../store/types";

function useSections(){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const [data,setData] = useState([]);
    const dispatch = useDispatch();
    useEffect(()=>{
        if(Object.keys(user).length){
            Req({
                type: GET_SECTION,
                query:{
                    tin: user.inn
                }
            })
                .then(res=>{
                    setData(res.data.data);
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
export default useSections;