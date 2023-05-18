import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_USER_JOBS} from "../../store/types";
import {useNavigate} from "react-router-dom";

function useJob(){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const [jobs,setJobs] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(Object.keys(user).length){
            Req({
                type: GET_USER_JOBS,
                query:{
                    id: 1,
                    pinfl: user.pinfl
                }
            }).then(res=>{
                setJobs(res.data.result.positions);
            }).catch(err=>{
                console.log(err)
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
            });
        }
    },[user]);
    return jobs
}
export default useJob;