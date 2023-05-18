import {connect, useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {CHAT_SEND_FILE, Req} from "../saga";
import {IconAttachRotate, IconMic, IconSend} from "../../../../components/Icon";
import {message} from "antd";
import FileLoader from "./FilieLoader";

function ChatFooter({sock,userChat}) {
    const {selectedChatContact = null, chatConnection = false} = useSelector(s => s);
    const dispatch = useDispatch();
    const input = useRef()
    const file = useRef();
    const onSend = () => {
        const val = input.current.value.trim();
        if (selectedChatContact && val.length) {
            const body = {
                tempId: `chatId${selectedChatContact.chatId}&${Date.now()}`,
                chatId: parseInt(selectedChatContact.chatId),
                messageType: 'TEXT',
                text: val,
                from: {
                    ...userChat,
                    id: userChat.userId
                },
                createdDate: Date.now(),
                isSend: 'pending'
            }
            sock('send-message', body);
            input.current.value = ''
        }
    }
    const onTyping = ()=>{
        sock('send-action',{
            actionType: 'TYPING',
            chatId: selectedChatContact.chatId
        });
    }
    const onFocusFile = ()=>{
        if(chatConnection){
            file.current.click();
        }else{
            message.info(`Iltimos kuting! Server bilan bog'lanish`);
        }
    }
    const onSelectFile = ()=>{
        const selectedFile = file.current.files[0];
        if(selectedFile.size / 1024 <= 500000){
            const formData = new FormData();
            formData.append('file',selectedFile);
            dispatch({
                type: 'chatFile',
                payload: selectedFile
            })
            dispatch({
                type: 'chatFileSend',
                payload: true
            });
            Req({
                type: CHAT_SEND_FILE,
                data: formData,
                headers:{
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (event)=>{
                    dispatch({
                        type: 'fileLoaderProgress',
                        payload: Math.round((event.loaded * 100) / event.total)
                    });
                }
            })
                .then(res=>{
                const body = {
                    tempId: `chatId${selectedChatContact.chatId}&${Date.now()}`,
                    chatId: parseInt(selectedChatContact.chatId),
                    fileId: res.data.hashId,
                    messageType: res.data.fileType,
                    file: res.data,
                    from: {
                        ...userChat,
                        id: userChat.userId
                    },
                    createdDate: Date.now(),
                    isSend: 'pending'
                }
                dispatch({
                    type: CHAT_SEND_FILE,
                    payload: body
                });
                sock('send-message', body);
                dispatch({
                    type: 'chatFileSend',
                    payload: false
                })
            })
                .catch(err=>{
                    console.log(err);
                    message.error(`Fayil yuklash bilan bog'liq muamo. Qayta urinib ko'ring.`);
                    dispatch({
                        type: 'chatFileSend',
                        payload: false
                    })
                })
        }
        else{
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: 'Max. file hajmi 1Gb oshmasligi kerak'
                }
            })
        }
        file.current.value = '';
    }
    return (
        <div className="app-chat-content-footer">
            <div className="app-chat-content-footer-form">
                <div onClick={onFocusFile} className="app-chat-content-footer-button ml-3">
                    <IconAttachRotate/>
                    <input onChange={onSelectFile} type="file" hidden={true} ref={file}/>
                    <FileLoader/>
                </div>
                <div className="app-chat-content-footer-button ml-1">
                    <IconMic/>
                </div>
                <TextArea input={input} onSend={onSend} onTyping={onTyping}/>
                <div>
                    <button disabled={!chatConnection} onClick={onSend} className="app-chat-content-footer-send-button">
                        Yuborish <IconSend/>
                    </button>
                </div>
            </div>
        </div>
       )
}
const TextArea = ({onSend, onTyping, input})=>{
    const {chatConnection = false} = useSelector(s => s);
    const [isTyping,setIsTyping] = useState(false);
    const [inputH,setInputH] = useState(26);
    const timeOut = useRef();
    useEffect(()=>{
        return ()=>{
            if(timeOut.current){
                clearTimeout(timeOut.current)
            }
        }
    },[]);
    useEffect(()=>{
        if(isTyping){
            onTyping();
            timeOut.current = setTimeout(()=>{
                setIsTyping(false);
            },2000);
        }
        return()=>{
            if(timeOut.current){
                clearTimeout(timeOut.current);
            }
        }
    },[isTyping]);
    const onClear = ()=>{
        input.current.value = '';
    }
    const onKeyup = (e) => {
        const val = input.current.value;
        if(val.trim().length){
            setIsTyping(true);
            const isEnter = e.keyCode === 13 && !e.shiftKey;
            if (isEnter) {
                onSend();
                setInputH(26);
                onClear();
                return null;
            }
            if(e.keyCode === 13 && e.shiftKey){
                if(inputH < 100){
                    setInputH(inputH + 26);
                }
            }
            if(val.length <= 0 || val.trim().length <= 0){
                setInputH(26);
                onClear();
            }
        }
    }
    const onChange = ()=>{
        const h = input.current.scrollHeight % 26 + input.current.scrollHeight;
        if(input.current.scrollHeight < 100){
            setInputH(h);
        }
    }
    const textarea = useMemo(()=>{
        return (
            <textarea
                style={{height: `${inputH}px`}}
                ref={input}
                disabled={!chatConnection}
                onKeyUp={onKeyup}
                onChange={onChange}
                placeholder={chatConnection ? 'Habar yozing' : `Server bilan bog'lanish`}
            />
        )
    },[inputH, chatConnection])
    return(
        textarea
    )
}
const stp = (state)=>{
    return{
        userChat: state.userChat || null
    }
}
export default connect(stp)(ChatFooter);