import {useDispatch} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";
import ChatDisplay from "./ChatDisplay";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";


function ChatContent({activeChat}) {
    const ws = useRef(new W3CWebSocket(`ws://hr.mf.uz:8001/ws/chat/${activeChat}/?token=${localStorage.getItem('token')}`));
    const dispatch = useDispatch();
    useEffect(()=>{
        ws.current.onopen= (e)=>{
            console.log('Connect');
        }
        ws.current.onclose = ()=>{
            console.log("Close connection!")
        };
        ws.current.onmessage = (message)=>{
            const messageData = JSON.parse(message.data);
            dispatch({
                type: 'chat_list',
                payload: messageData.message
            })
        }
        return ()=>{
            if(ws.current){
                ws.current.onclose();
            }
        }
    },[]);
    const onSend = (value)=>{
        ws.current.send(JSON.stringify({
            "command": "new_message",
            "message": value
        }));
    }
    return  <div className="chat-wrapper">
                <ChatHeader/>
                <ChatDisplay/>
                <ChatFooter onSend={onSend}/>
            </div>
}
export default ChatContent;