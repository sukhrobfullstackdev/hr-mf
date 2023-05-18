import {useEffect, useRef, useState} from "react";
import {CREATE_CHAT, Req} from "../../pages/cabinet/new-chat/saga";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

function useChats(){
    const {selectedChatContact = {}} = useSelector(s=>s);
    const [chat,setChat] = useState(null);
    const [chatCreateLoader,setChatCreateLoader] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const createChat = (data)=>{
        setChatCreateLoader(true);
        Req({
            type: CREATE_CHAT,
            data
        })
            .then(res=>{
                setChat({
                    chat: res.data,
                    lastMessage: {
                        ...data.message,
                        chatId: res.data.chatId
                    }
                });
                dispatch({
                    type: 'selectedChatContact',
                    payload: {
                        ...selectedChatContact,
                        chatId: res.data.chatId
                    }
                })
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
                setChatCreateLoader(false)
            })
    }
    return [chat,createChat,chatCreateLoader];
}
export function useChatTypingChange(){
    const {chatList = null ,selectedChatContact = null } = useSelector(s=>s);
    const dispatch = useDispatch();
    const timeOut = useRef();
    useEffect(()=>{
        return ()=>{
            if(timeOut.current){
                clearTimeout(timeOut.current);
            }
        }
    },[])
    const onChange = (chatId)=>{
        timeOut.current = setTimeout(()=>{
            const newChatList = chatList.data.map(item=>{
                if(item.chat.id == chatId){
                    return{
                        ...item,
                        lastMessage: {
                            ...item.lastMessage,
                            typing: false
                        }
                    }
                }
                return item;
            });
            dispatch({
                type: 'chatList',
                payload: {
                    ...chatList,
                    data: newChatList
                }
            });
            dispatch({
                type: 'selectedChatContact',
                payload: {
                    ...selectedChatContact,
                    lastMessage:{
                        ...selectedChatContact.lastMessage,
                        typing: false
                    }
                }
            })
        }, 2500);

    }
    return onChange
}
export default useChats;