import {IconEdit, IconFileText, IconFolder, IconImage, IconMic, IconVideo} from "../../../../components/Icon";
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useChatTypingChange} from "../../../../hooks/useChats";
import moment from "moment";

function ChatListUserName({lastSeen = null, chatId = null, isOnline = false, chatType = "PRIVATE",status= null, userName = '', lastMessage = {}}) {
    return (
        <div className="app-chat-user-name">
        <p className="mb-0 text-capitalize text-no-wrap">
            {
                userName.toLowerCase()
            }
        </p>
        <p className="mb-0 small text-muted">
            <StateChatItem state={{
                lastSeen: lastSeen,
                chatType: chatType,
                lastMessage: lastMessage,
                status: status,
                isOnline: isOnline,
                chatId: chatId
            }}/>
        </p>
    </div>
        )
}
function StateChatItem({state}){
    const setTyping = useChatTypingChange()
    const changeTyping = ()=>{
        if(state.chatId && state.typing){
            setTyping(state.chatId);
        }
    }
    return useMemo(()=>{
        if(state.lastMessage?.typing && state.isOnline){
            changeTyping();
            return <Typing/>
        }
        if(state.lastMessage.messageType){
            if(state.lastMessage.messageType === 'TEXT'){
                return (
                    <span className="text-no-wrap d-block">
                        Xabar: {state.lastMessage.text}
                    </span>
                )
            }
            if(state.lastMessage.messageType === 'PHOTO'){
                return (
                    <span className="text-no-wrap d-block">
                       <img className="app-chat-list-photo" src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${state.lastMessage.fileId}&type=SMALL`}/>
                        {state.lastMessage.file.fileName}
                    </span>
                )
            }
            if(state.lastMessage.messageType === 'AUDIO'){
                return (
                    <span>
                        <IconMic/> Ovozli habar
                    </span>
                )
            }
            if(state.lastMessage.messageType === 'VIDEO'){
                return (
                    <span>
                        <IconVideo/> Video habar
                    </span>
                )
            }
            if(state.lastMessage.messageType === 'FILE'){
                return (
                    <span className="text-no-wrap d-block">
                        <IconFileText/> {state.lastMessage.file.fileName}
                    </span>
                )
            }
            if(state.lastMessage.messageType === 'DOCUMENT'){
                if(state.lastMessage.file.mimeType === 'application/pdf'){
                    return (
                        <span>
                            <img className="app-chat-list-photo" src="/images/pdf.png" alt=""/> {state.lastMessage.file.fileName}
                        </span>
                    )
                }
                if(state.lastMessage.file.mimeType === 'application/zip'){
                    return (
                        <span>
                            <img className="app-chat-list-photo" src="/images/zip.png" alt=""/> {state.lastMessage.file.fileName}
                        </span>
                    )
                }
                if(state.lastMessage.file.mimeType === 'application/msword' || state.lastMessage.file.mimeType === 'application/doc' || state.lastMessage.file.mimeType === 'application/docx' ){
                    return (
                        <span>
                            <img className="app-chat-list-photo" src="/images/doc.png" alt=""/> {state.lastMessage.file.fileName}
                        </span>
                    )
                }
                return (
                    <span>
                        <IconFolder/> {state.lastMessage.file.fileName}
                    </span>
                )
            }
        }
        return (
            <span className="small">
               {new Date(state.lastSeen).toLocaleDateString()},
                {new Date(state.lastSeen).toLocaleTimeString('ru-RU', {minute: 'numeric',hour:'numeric'})}
            </span>
        )
    },[state]);
}

// Local components
export function Typing({isIcon = true}) {
    const timeOut = useRef();
    const [text,setText] = useState('');
    useEffect(()=>{
        const t = 'Yozmoqda...';
        if(text.length === t.length){
            timeOut.current = setTimeout(()=>{
                setText('')
            },3000);
        }else{
            timeOut.current = setTimeout(()=>{
                setText(t.substring(0,text.length + 1))
            },200);
        }
        return ()=>{
            if(timeOut.current){
                clearTimeout(timeOut.current);
            }
        }
    },[text]);
    return (
        <span className='typing'>
            {
                isIcon ? <IconEdit/> : null
            }
             {text}
            <span className="typing-cursor">|</span>
        </span>
    )
}

export default ChatListUserName;