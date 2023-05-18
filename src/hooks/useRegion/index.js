import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_REGIONS} from "../../store/types";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

function useRegion(){
    const [region,setRegion] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        if(!region.length){
            Req({
                type: GET_REGIONS,
            })
                .then(res=>{
                    setRegion(res.data.data);
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
    },[]);
    return region
}
export default useRegion;