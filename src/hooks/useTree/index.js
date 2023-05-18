import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_DEPARTMENT} from "../../store/types";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";


function useTree(){
    const department = useSelector(s=>s.department || []);
    const isUser = useSelector(s=>s.isUser || null);
    const dispatch = useDispatch();
    const [sections,setSections] = useState([]);
    const navigate = useNavigate();
    useEffect(()=>{
        if(isUser && !department.length){
            Req({
                type: GET_DEPARTMENT,
            })
                .then(res=>{
                    let data = [];
                    if(Array.isArray(res.data)){
                        data = res.data
                    }else{
                        data = 'results' in res.data ? res.data.results : 'data' in res.data ? res.data.data : res.data;
                    }
                    setSections(data);
                    dispatch({
                        type: 'department',
                        payload: data
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
            })
        }else{
            setSections(department);
        }
    },[]);
    return sections
}
export default useTree;