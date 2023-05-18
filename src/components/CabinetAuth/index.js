import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Style from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import Req from "../../store/api";
import {GET_USER_DATE} from "../../store/types";

const Wrapper = Style.div`
    width: 100%;
    padding: 54px;
    height: 100vh;
    overflow: auto;
    background-color: #F5F5F5;
    display: flex;
    flex-direction: column;
`
function CabinetAuth({children}){
    const [isUser,setIsUser] = useState(false);
    const mode = useSelector(s=>s.mode ? s.mode : false);
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        if(user && Object.keys(user).length){
            setIsUser(true);
        }else{
            localStorage.removeItem('isUser');
            localStorage.removeItem('token');
            navigate('/');
        }
    },[])
    return isUser ?
        <Wrapper className={mode ? 'dark-mode' : 'light-mode' }>
            {children}
        </Wrapper>: ''
}
export default CabinetAuth