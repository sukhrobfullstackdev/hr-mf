import {useEffect, useState} from "react";
import Loader from "../Loader";
import {useLocation, useNavigate} from "react-router-dom";
import {USER_ME} from "../../store/types";
import {connect, useDispatch} from "react-redux";

function Auth({children, is_user = false}){
    const [isUser,setIsUser] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token && token !== undefined && token !== 'undefined'){
            dispatch({
                type: USER_ME,
                payload: {
                    activeUrl: location.pathname
                }
            });
        }
        else{
            localStorage.removeItem('token');
            dispatch({
                type: 'isUser',
                payload: null
            });
            dispatch({
                type: 'is_user',
                payload: false
            })
            const timeOut = setTimeout(()=>{
                navigate('/login');
                clearTimeout(timeOut)
            },500);
        }
    },[]);
    useEffect(()=>{
        setIsUser(is_user);
    },[is_user]);
    return isUser ? children : <Loader full/>;
}
export default connect(s=>{
    return {
        is_user: s?.is_user,
        user: s.isUser || null
    }
})(Auth);