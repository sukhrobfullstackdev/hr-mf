import {useEffect, useState} from "react";
import Req from "../../store/api";
import {GET_CLASSIFICATOR} from "../../store/types";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function useClassifcator(props){
    const [data,setData] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
       if(!data.length){
           Req({
               type: GET_CLASSIFICATOR,
               query:{
                   search: ''
               }
           })
               .then(res=>{
                  setData(res.data.data)
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
    },[])
    return data
}
export default useClassifcator