import {useLocation, useParams} from "react-router-dom";
import ChatHeader from "../component/ChatContent/ChatHeader";
import ChatDisplay from "../component/ChatContent/ChatDisplay";
import ChatFooter from "../component/ChatContent/ChatFooter";
import {useCallback, useEffect, useRef, useState} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";
import {GET_CHAT_BY_ID} from "../../../../store/types";
import {connect, useDispatch} from "react-redux";

function ChatById(props){
    const {chat_data_list,chatForward = null, chatForwardTo = null,
        trashMessageId = null} = props;
    const {id} = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const mws = useRef(null);
    const [connection, setConnection] = useState(false);
    const audio = useRef();
    const set = (l = {})=>{
        dispatch({
            type: 'chat_data_list',
            payload: l
        });
    }
    const clear = ()=>{
        if(connection){
            setConnection(false);
            dispatch({
                type: 'chat_data_list',
                payload: null
            });
            console.log("Close connection!");
        }
    };
    const connectWs = useCallback((newUrl)=>{
        mws.current = new W3CWebSocket(newUrl);
        mws.current.onopen= (e)=>{
            console.log('Connect');
            setConnection(true);
        }
        mws.current.onclose = function (){
            clear();
        }
        mws.current.onmessage = function (message){
            const messageData = JSON.parse(message.data);
            if(messageData.command === 'delete_message'){
                dispatch({
                    type: "remove_chat_message",
                    payload: messageData.message
                })
            }else if(messageData.command === 'edit_message'){
                dispatch({
                    type: "edit_message",
                    payload: messageData.message
                })
            }else{
                set(messageData.message);
                const messageSound = localStorage.getItem('chatMessageSound') || 'on';
                if(audio && messageSound === 'on'){
                    audio.current.play();
                }
            }
        }
        mws.current.onerror=(error)=>{
            console.log("Chat error!");
            console.log(error);
        }
    },[location.pathname, chat_data_list]);
    useEffect(()=>{
        const newUrl = `ws://hr.mf.uz/ws/chat/${id}/?token=${localStorage.getItem('token')}`;
        if(mws.current && mws.current.onclose && connection){
            mws.current.onclose();
        }
        connectWs(newUrl);
    },[location.pathname, id]);
    useEffect(()=>{
        if(id){
            clear();
            dispatch({
                type: GET_CHAT_BY_ID,
                payload: {
                    id: id
                }
            });
        }
    },[location.pathname]);
    const onSend = useCallback((value)=>{
        if(connection){
            mws.current.send(JSON.stringify({
                "command": 'new_message',
                "message": value,
            }));
        }else{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Server bilan bog'lana olmadik!"
                }
            })
        }
    },[connection]);
    const onForward = useCallback((messageId)=>{
        if(connection && chatForwardTo !== id){
            const a = setTimeout(()=>{
                if(mws.current.readyState){
                    mws.current.send(JSON.stringify({
                        "command": "new_message",
                        "messageId": messageId,
                        "isForwarding": true
                    }));
                }
            },1000);
        }
        dispatch({
            type: "chatForward",
            payload: null
        })
    },[connection,mws.current]);
    const onUpdate = useCallback((message,messageId)=>{
        if(connection){
            mws.current.send(JSON.stringify({
                "command":"edit_message",
                "messageId": messageId,
                "message": message
            }));
        }
        dispatch({
            type: "replayedMessageId",
            payload: null
        })
        dispatch({
            type: "replayedMessage",
            payload: null
        })
    },[connection, ]);
    const onReplay = useCallback((message,answeredTo)=>{
        if(connection && message && answeredTo){
            mws.current.send(JSON.stringify({
                "command": "new_message",
                "message": message,
                "answeredTo": answeredTo
            }));
        }
    },[connection]);
    const onTrash = useCallback(()=>{
        if(connection && trashMessageId){
            mws.current.send(JSON.stringify({
                "command": "delete_message",
                "messageId": trashMessageId,
            }));
        }
    },[connection,trashMessageId]);
    const onUploadFile = useCallback((data)=>{
        if(connection){
            const {id,file} = data;
            let type = file.split('.');
            mws.current.send(JSON.stringify({
                "command": "new_message",
                "message": type[type.length-1],
                "attachments": [id]
            }));
        }
    },[connection]);
    useEffect(()=>{
        dispatch({
            type: 'isVisibleModalChatForward',
            payload: false
        });
        if(chatForward && connection && chatForwardTo){
            onForward(chatForward)
        }
    },[id]);
    useEffect(()=>{
        if(trashMessageId){
            onTrash()
        }
    },[trashMessageId])
    return <div className="chat-wrapper">
                <ChatHeader/>
                <ChatDisplay connection={connection}/>
                <ChatFooter onFileUpload={onUploadFile} connection={connection} onUpdate={onUpdate} onReplay={onReplay} onSend={onSend}/>
                <audio src="/sound/message.mp3" ref={audio}/>
            </div>
}


export default connect((s)=>{
    return{
        chat_data_list: s.chat_data_list,
        chatForward: s?.chatForward,
        chatForwardTo: s?.chatForwardTo,
        replayedMessageId: s?.replayedMessageId,
        replayedMessage: s?.replayedMessage,
        trashMessageId: s?.trashMessageId,
    }
})(ChatById);