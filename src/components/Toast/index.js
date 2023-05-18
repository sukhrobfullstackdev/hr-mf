import {connect, useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css'

const Toast = (props)=>{
    const {toastContent = {}} = props;
    const {message = null,type = null} = toastContent;
    const dispatch = useDispatch();
    useEffect(()=>{
        if(Object.keys(toastContent).length && message && type){
            const m = Array.isArray(message) ? message.join(', ') : message;
            switch (type){
                case 'error':
                    toast.error(m);
                    dispatch({
                        type: 'toast',
                        payload: {}
                    })
                    break;
                case 'success':
                    toast.success(m);
                    dispatch({
                        type: 'toast',
                        payload: {}
                    })
                    break;
                case 'info':
                    toast.info(m);
                    dispatch({
                        type: 'toast',
                        payload: {}
                    })
                    break;
                case 'warning':
                    toast.info(m);
                    dispatch({
                        type: 'toast',
                        payload: {}
                    })
                    break;
            }
        }
    },[toastContent]);
    return <ToastContainer/>
}
const propsToState = state => {
    return {toastContent: state?.toast}
};
export default connect(propsToState, null)(Toast);