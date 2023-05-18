import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_STAFF} from "../../store/types";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";


function useContacts(props){
    const [data,setData] = useState({});
    const [loader,setLoader] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const get = (page = 1)=>{
        setLoader(true);
        Req({
            type: GET_STAFF,
            query:{
                page: page
            }
        }).then(res=>{
            setData(res.data)
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
        .finally(()=>{
            setLoader(false)
        })
    }
    return [data,get,loader];
}
export default useContacts;