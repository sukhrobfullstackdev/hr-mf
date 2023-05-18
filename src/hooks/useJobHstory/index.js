import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_USER_JOB_HISTORY} from "../../store/types";
import {useNavigate} from "react-router-dom";

function useJobHistory(){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const dispatch = useDispatch();
    const [loader,setLoader] = useState(false);
    const [jobs,setJobs] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        if(Object.keys(user).length){
            setLoader(true);
            Req({
                type: GET_USER_JOB_HISTORY,
                query:{
                    id: 11,
                    pinfl: user.pinfl
                }
            }).then(res=>{
                setLoader(false)
                const data = res.data
                setJobs(data);
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
                setLoader(false);
            })
        }
    },[user]);
    return {
        jobs,
        loader: loader
    }
}
export default useJobHistory;