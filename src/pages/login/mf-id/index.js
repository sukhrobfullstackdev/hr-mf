import {useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Loader from "../../../components/Loader";
import Req from "../../../store/api";
import {LOGIN_MF_ID} from "../../../store/types";
import {useDispatch} from "react-redux";

function MfId(){
    const [searchParams] = useSearchParams();
    const [loader,setLoader] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        const code = searchParams.get('code');
        if(code){
           Req({
               type: LOGIN_MF_ID,
               data: {
                   "client_id": `${process.env.REACT_APP_MF_ID}`,
                   "code":code,
                   "redirect_url": `${process.env.REACT_APP_REDIRECT_URL}/mf-id`
               }
           }).then(res=>{
               localStorage.setItem('token', res.data.token);
               navigate('/cabinet/info');
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
            navigate('/login');
        }
    },[]);
    return(
        <div className="py-5">
            {
                loader ?
                    <Loader/> :''
            }
        </div>
    )
}
export default MfId;