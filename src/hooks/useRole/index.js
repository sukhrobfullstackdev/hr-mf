import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_ROLES} from "../../store/types";
import {useDispatch} from "react-redux";


function useRole(){
    const [data,setData] = useState([]);
    const dispatch = useDispatch();
    useEffect(()=>{
       if(!data.length){
           Req({
               type: GET_ROLES
           })
               .then(res=>{
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
               })
       }
    },[]);
    return data;
}
export default useRole;