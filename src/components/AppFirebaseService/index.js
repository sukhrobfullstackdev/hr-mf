import {useCallback, useEffect, useLayoutEffect} from "react";
import {getCurrentToken, onMessageListener} from "../../firebase";
import {connect, useDispatch} from "react-redux";

function AppFirebaseService({fbmMessages,fbmToken =  null}){
    const dispatch = useDispatch()
    useLayoutEffect(()=>{
        getCurrentToken(setToken);
       if(window && 'addEventListener' in window){
           window.addEventListener('message',listener)
       }
    },[]);
    useEffect(()=>{
        dispatch({
            type: 'userFbmToken',
            payload: fbmToken
        })
    },[fbmToken]);
    const setToken = (token)=>{
        dispatch({
            type: 'fbmToken',
            payload: token
        })
    }
    const listener = useCallback(()=>{
        onMessageListener().then(payload => {
            const middleMessages = fbmMessages || [];
            middleMessages.push({
                isRead: false,
                title: payload.notification.title,
                body: payload.notification.body,
                idKey: payload.collapseKey
            });
            dispatch({
                type: 'fbmMessages',
                payload: middleMessages
            });
            const notRead = middleMessages.map(v=>!v.isRead);
            dispatch({
                type: 'notReadFbmMessage',
                payload: notRead.length
            });
            dispatch({
                type: 'toast',
                payload: {
                    type: 'info',
                    message: `Sizga yangi habar bor!`
                }
            })
        }).catch(err => console.log('failed: ', err));
    },[fbmMessages]);
    return null
}
const stp = (state)=>({
    fbmMessages: state.fbmMessages || [],
    fbmToken: state.fbmToken
})
export default connect(stp)(AppFirebaseService)