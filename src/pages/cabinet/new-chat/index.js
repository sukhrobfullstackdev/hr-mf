import ChatList from "./components/ChatList";
import ChatSider from "./components/ChatSider";
import ChatContent from "./components/ChatContent";
import './index.scss';
import {connect, useDispatch} from "react-redux";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import * as SockJS from 'sockjs-client';
import * as Stomp from "webstomp-client";
import {GET_CHAT_HASHID, ON_MESSAGE} from "./saga";
import {ChatButton} from "../../../components/Chat";
import useChats from "../../../hooks/useChats";

function NewChat({chatContactList,selectedChatContact,chatConnection = false,chatList,userChat,isReadMessage = null}){
    const [retry,setRetry] = useState(null);
    const [newChat,createChat, chatLoader] = useChats();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stompClient = useRef(null);
    const timeOut = useRef();
    const [connectionTry,setConnectionTry] = useState(1);
    const [sokUrl,setSokUrl] = useState(`${process.env.REACT_APP_SERVER_URL}/newchat/api/v1/websocket`);
    // Create new chat by chat id
    useEffect(()=>{
        if(newChat && Object.keys(newChat).length){
            const newMessageList = selectedChatContact?.message || [];
            newMessageList.push(newChat.lastMessage);
            if(chatContactList && chatContactList.length){
                const newContactList = chatContactList.map(contact =>{
                    if(contact.id === selectedChatContact.id){
                        return{
                            ...contact,
                            chatId: newChat.chat.chatId,
                        }
                    }
                    return contact;
                });
                dispatch({
                    type: 'chatContactList',
                    payload: newContactList
                });
            }
            if(chatList && 'data' in chatList){
                const data = chatList.data;
                data.unshift({
                    chat: {
                        ...selectedChatContact,
                        id: newChat.chat.chatId,
                        isOnline:false,
                        unreadMessageCount:0,
                        photo: selectedChatContact.photo,
                    },
                    lastMessage: newChat.lastMessage
                });
                dispatch({
                    type: 'chatList',
                    payload: {
                        ...chatList,
                        data: data
                    }
                })
            }
            onSend('send-message', newChat.lastMessage);
        }
    },[newChat]);
    //
    useLayoutEffect(()=>{
        dispatch({
            type: GET_CHAT_HASHID
        });
    },[]);
    useEffect(()=>{
        if(userChat && 'subscribeId' in userChat){
            onConnection();
        }
    },[userChat]);
    useEffect(()=>{
        if(selectedChatContact && selectedChatContact.chatId){
            navigate(`/cabinet/chat/${selectedChatContact.chatId}`);
        }else{
            navigate(`/cabinet/chat`);
        }
    },[selectedChatContact]);
    useEffect(()=>{
        dispatch({
            type: GET_CHAT_HASHID
        });
    },[]); /// userChat bo'lishi kerak
    useEffect(()=>{
        return ()=>{
            if(stompClient.current && stompClient.current.disconnect && chatConnection){
                stompClient.current.disconnect(()=>{
                    dispatch({
                        type: 'chatConnection',
                        payload: false
                    })
                });
            }
            if(timeOut.current){
                clearInterval(timeOut.current);
            }
        }
    },[]);
    useEffect(()=>{
        if(isReadMessage){
            const candidate = chatList.data.find(v=>v.chat.id === isReadMessage.chatId);
            if(candidate && 'unreadMessageCount' in candidate.chat && candidate.chat.unreadMessageCount > 0 ){
                onSend('read-message',{chatId: isReadMessage.chatId});
            }
        }
    },[isReadMessage]);
    useEffect(()=>{
        if(stompClient.current && 'connection' in stompClient.current){
            dispatch({
                type: 'chatConnection',
                payload: stompClient.current.connection
            })
        }
    },[stompClient.current]);
    const onConnection = ()=>{
        if(timeOut.current){
            clearTimeout(timeOut.current);
        }
        const socket = new SockJS(sokUrl);
        stompClient.current = Stomp.over(socket);
        stompClient.current.connect(
            { Authorization: `Bearer ${localStorage.token}`},
            function(frame) {
                dispatch({
                    type: 'chatConnection',
                    payload: true
                })
                stompClient.current.subscribe(`/topic/user/${userChat.subscribeId}`, function(data) {
                    const message = JSON.parse(data.body);
                    onMessage(message);
                });
            },
            function (error){
                console.log("Connection error");
                console.log(error,);
                onReconnect();
            }
        );
    }
    const onReconnect = ()=> {
        dispatch({
            type: "chatConnection",
            payload: false
        });
        timeOut.current = setTimeout(() => {
            onConnection();
            setConnectionTry(connectionTry + 1);
        }, connectionTry * 1000);
    }
    const onMessage = useCallback((message) =>{
        dispatch({
            type: ON_MESSAGE,
            payload: message
        });
    },[chatList]);

    //SEND MESSAGE
    const onSend = useCallback((url,body)=>{
        try{
            if(stompClient.current && stompClient.current.connected){
                if(selectedChatContact.chatId === 0){
                    if (url === 'send-message') {
                        createChat({
                            chatType: "PRIVATE",
                            chatUsers: [
                                selectedChatContact.id
                            ],
                            message: body
                        });
                    }
                }
                if(selectedChatContact.chatId !== 0){
                    if(url === 'send-message'){
                        const newChatList = chatList.data.map(item=>{
                            const message = item.message || [];
                            message.push(body);
                            return{
                                ...item,
                                message: message
                            }
                        });
                        dispatch({
                            type: 'chatList',
                            payload: {
                                ...chatList,
                                data: newChatList
                            },
                        });
                        const newMessageList = selectedChatContact?.message || [];
                        newMessageList.push(body);
                        dispatch({
                            type: 'selectedChatContact',
                            payload: {
                                ...selectedChatContact,
                                message: newMessageList
                            }
                        });
                    }
                    stompClient.current.send(
                        `/app/${url}`, JSON.stringify(body)
                    );
                    dispatch({
                        type: 'sendingMessage',
                        payload: Math.random()
                    })
                }
            }else{
                dispatch({
                    type: 'chatConnection',
                    payload: false
                });
                onReconnect();
            }
        }
        catch (err){
            console.log(err, "Error");
        }
    },[selectedChatContact])
    return(
        <div className="app-chat">
            <ChatList/>
            <ChatContent sock={onSend}/>
            <ChatSider/>
            <ChatButton type='home'/>
        </div>
    )
}
const stp = (state)=>{
    return{
        selectedChatContact: state.selectedChatContact || null,
        chatConnection: state.chatConnection || false,
        chatList: state.chatList || [],
        userChat: state.userChat || null,
        isReadMessage: state.isReadMessage || null,
        chatContactList: state.chatContactList || null
    }
}
export default connect(stp)(NewChat);