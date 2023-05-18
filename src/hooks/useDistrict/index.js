import {useCallback, useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_DISTRICT} from "../../store/types";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function useDistrict(){
    const [district,setDistrict] = useState([]);
    const [loader,setLoader] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const get = useCallback((id)=>{
        if(id){
            Req({
                type: `${GET_DISTRICT}${id}`,
            })
                .then(res=>{
                    setDistrict(res.data.districts);
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
                .finally(()=>{
                setLoader(false)
            })
        }
    },[]);
    return [district,get,loader];
}
export default useDistrict;