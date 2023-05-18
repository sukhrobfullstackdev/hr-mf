import {BrowserRouter as Router, useLocation, useNavigate, useRoutes} from "react-router-dom";
import React, {Suspense, useEffect, useMemo, useState} from "react";
import path from './path';
import {connect, useDispatch} from "react-redux";
import TestMode from "../components/TestMode";
import Loader from "../components/Loader";

function AppRoute() {
    const location = useLocation();
    const dispatch = useDispatch();
    const router = useRoutes(path);
    useEffect(()=>{
        dispatch({
            type: 'tableCount',
            payload: 0,
        })
        dispatch({
            type: 'pageSize',
            payload: 0,
        })
    },[location.pathname]);
    return useMemo(()=>{
        return router
    },[location.pathname])
}

function Redirect(props) {
    const {to = null} = props;
    const navigate = useNavigate();
    const [url,setUrl] = useState('/');
    const location = useLocation();
    const dispatch = useDispatch();
    useEffect(() => {
        if (to && url !== to) {
            setUrl(to)
            navigate(to);
        }
    }, [to]);
    useEffect(()=>{
        dispatch({
            type: 'redirect',
            payload: location?.pathname || '/'
        });
        dispatch({
            type: 'single',
            payload: {}
        });
        document.documentElement.scrollTo(0, 0);
    },[location]);
    return <></>;
}

const loader = ()=> <Loader/>;

function AppRouter({redirect = null}) {
    const dispatch = useDispatch();
    useEffect(()=>{
        if(window){
            dispatch({
                type: 'windowWidth',
                payload: window.innerWidth
            })
        }
    },[window.innerWidth]);
    const rout = useMemo(()=>{
        return <Redirect to={redirect}/>
    },[redirect]);
    return  <Suspense fallback={loader}>
                <Router>
                    <AppRoute/>
                    <TestMode/>
                    {
                        rout
                    }
                </Router>
            </Suspense>;
}
const stateToProps=(state)=>{
    return{
        redirect: state?.redirect
    }
}
export default connect(stateToProps)(AppRouter);