import {useDispatch, useSelector} from "react-redux";
import ChatListAvatar from "./ChatListAvatar";
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    IconArrowDown,
    IconCheckMark,
    IconClock,
    IconCopy,
    IconDownload,
    IconPlay,
    IconTag,
    IconTrash,
    IconUndoLeft
} from "../../../../components/Icon";
import {GET_MESSAGES_BY_CHAT, GET_MESSAGES_BY_CHAT_OLD} from "../saga";
import NoData from "../../../../components/NoData";
import {Col, message, Row} from "antd";
import ChatUserLoader from "../../../../components/Loader/ChatUserLoader";
import InnerHtml from "../../../../components/InnerHtml";

function ChatContentBody() {
    const {selectedChatContact = {}, sendingMessage = null, chatDontScroll = false} = useSelector(s => s);
    const [dontScrollToBottom, setDontScrollToBottom] = useState(true);
    const [inBottom,setInBottom] = useState(true);
    const dispatch = useDispatch();
    const chatBody = useRef();
    useEffect(() => {
        if(!inBottom){
            dispatch({
                type: 'isReadMessage',
                payload: {
                    chatId: selectedChatContact.chatId
                }
            })
        }
        if (dontScrollToBottom) {
            chatBody.current.scrollTop = chatBody.current.scrollHeight;
            setDontScrollToBottom(false);
            dispatch({
                type: 'sendingMessage',
                payload: Math.random()
            })
        }
    }, [selectedChatContact]);
    useEffect(() => {
        chatBody.current.scrollTop = chatBody.current.scrollHeight;
    }, [sendingMessage])
    const onScrollChatBody = () => {
        if(!chatDontScroll){
            if (chatBody.current.scrollTop <= 0 && selectedChatContact) {
                dispatch({
                    type: GET_MESSAGES_BY_CHAT_OLD,
                    payload: selectedChatContact.chatId
                })
                chatBody.current.scrollTop = 320;
            }
            setInBottom(chatBody.current.scrollHeight - chatBody.current.scrollTop > chatBody.current.clientHeight);
        }
    }
    const onScrollToBottom = ()=>{
        chatBody.current.scrollTop = chatBody.current.scrollHeight;
    }
    const toBottom = useMemo(()=>{
        if(!inBottom){
            dispatch({
                    type: 'isReadMessage',
                    payload: {
                        chatId: selectedChatContact.chatId
                    }
            })
        }
        if(selectedChatContact.message && selectedChatContact.message.length && selectedChatContact.message.length > 8) {
            return <ButtonToBottom toBottom={onScrollToBottom} isDown={inBottom}/>
        }
        return null;
    },[selectedChatContact,inBottom]);
    return (
        <div ref={chatBody} onScroll={onScrollChatBody} className="app-chat-content-body position-relative"
             style={{marginBottom: 'auto'}}>
            {
                selectedChatContact.chatId ?
                    <ChatMessages/> :
                    <ChatCreatNewMessage/>
            }
            {
                toBottom
            }
            <ContextMenu/>
        </div>
    )
}

function ChatMessages() {
    const {userChat = {}, selectedChatContact = null} = useSelector(s => s);
    const loader = useSelector(s => s.advanceLoader.indexOf(GET_MESSAGES_BY_CHAT) > -1);
    const scrollLoader = useSelector(s => s.advanceLoader.indexOf(GET_MESSAGES_BY_CHAT_OLD) > -1);
    const messages = useMemo(() => {
        return (
            selectedChatContact && 'message' in selectedChatContact ?
                selectedChatContact.message.map((message, i) => {
                    return (
                        <div key={`messageItem${i}`}
                             className={`app-chat-message mb-3 ${userChat.userId && userChat.userId == message.from.id ? 'reverse' : ''}`}>
                            <ChatListAvatar img={{
                                url: 'photo' in message.from ? message.from.photo : message.from.hashId,
                                name: message.from.fullName,
                                size: 'SMALL'
                            }}/>
                            <div className="app-chat-message-block">
                                <div className="app-chat-message-block-user">{message.from.fullName}</div>
                                <ChatMessageItem reverse={userChat.userId && userChat.userId == message.from.id}
                                                 message={message}/>
                            </div>
                        </div>
                    )
                }) : <NoData size='sm' message="Yozishmalar mavjud emas!"/>
        )
    }, [selectedChatContact, userChat]);
    return (
        loader ?
            <ChatLoader row={4}/> :
            selectedChatContact && selectedChatContact.message && selectedChatContact.message.length ?
                <>
                    {
                        scrollLoader ?
                            <ChatLoader row={2}/> : ''
                    }
                    {messages}
                </> :
                <div className="text-muted text-center py-2">
                    Bu chatda yozishmalar mavjud emas!
                </div>

    )
}

function ChatMessageItem({message, reverse = true}) {
    const dispatch = useDispatch();
    const onContextMenu = useCallback((e) => {
        dispatch({
            type: 'chatMessageContext',
            payload: {
                ...message,
                contextOption: {
                    clientX: e.clientX,
                    clientY: e.clientY,
                }
            }
        });
        e.preventDefault();
    }, [])
    return useMemo(() => {
        const date = new Date(message.createdDate).toLocaleTimeString('ru-RU',{hour: 'numeric',minute: 'numeric'});
        return (
            <div onContextMenu={onContextMenu} className="app-chat-message-item ">
                <div
                    className={`app-chat-message-item-body mt-2 ${message.messageType === 'VIDEO' || message.messageType === 'PHOTO' ? 'un-padding' : ''}`}>
                    <Message msg={message}/>
                    <div className="app-chat-message-send-status">
                        {
                            reverse ?
                                'isSend' in message && message.isSend ?
                                    <IconClock/> :
                                    'isSeen' in message && message.isSeen ?
                                        <span className="app-chat-message-status-is-seen">
                                        <IconCheckMark/>
                                        <IconCheckMark/>
                                    </span> :
                                        <IconCheckMark/> : ''

                        }
                    </div>
                </div>
                <div className="text-muted small mt-3 text-center px-2">
                    {
                        date
                    }
                </div>
            </div>
        )
    }, [message]);
}

function Message({msg}) {
    const onDownload = () => {
        const a = document.createElement('a');
        a.href = `${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${msg.fileId}`;
        a.target = '_blank';
        a.click();
        a.remove();
    }
    const iconByFile = useMemo(() => {
        if (msg.file) {
            if (msg.file.mimeType === 'application/pdf') {
                return (
                    <span>
                        <img className="app-chat-content-icon-file" src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${msg.fileId}&type=THUMBNAIL`}
                         alt=""/>
                    </span>
                )
            }
            if (msg.file.mimeType === 'application/zip') {
                return (
                    <span>
                    <img className="app-chat-content-icon-file" src="/images/zip.png"
                         alt=""/>
                </span>
                )
            }
            if (msg.file.mimeType === 'application/msword') {
                return (
                    <span>
                    <img className="app-chat-content-icon-file" src="/images/doc.png"
                         alt=""/>
                </span>
                )
            }
        }
        return (
            msg.messageType === 'FILE' ?
                <img className="app-chat-content-icon-file" src="/images/txt.png"
                     alt=""/> :
                <img className="app-chat-content-icon-file" src="/images/file.png"
                     alt=""/>
        )
    }, []);
    const message = useMemo(() => {
        if (msg.messageType === 'TEXT') {
            msg = {
                ...msg,
                text: msg.text.replaceAll('\n', '<br/>')
            }
            return <Text msg={msg}/>
        }
        if (msg.messageType === 'PHOTO') {
            return <Image msg={msg}/>
        }
        if (msg.messageType === 'VIDEO') {
            return (
                <Video msg={msg}/>
            )
        }
        if (msg.messageType === 'FILE' || msg.messageType === 'DOCUMENT') {
            return (
                <div className="app-chat-message-file">
                    <div className="app-chat-message-file-icon">
                        <span className="app-chat-message-file-icon-download">
                             {iconByFile}
                        </span>
                        <span onClick={onDownload} className="app-chat-message-file-icon-download">
                             <IconDownload/>
                        </span>
                    </div>
                    <div className="app-chat-message-file-info">
                        <strong className="text-no-wrap">{msg.file?.fileName}</strong>
                        <p className="m-0 small">
                            {msg.file ?
                                <MessageSize fileSize={msg.file.size}/> : ''}
                        </p>
                    </div>
                </div>
            )
        }
        return null
    }, [msg]);
    return message
}
// Text
function Text({msg}){
    return(
        <InnerHtml content={msg.text}/>
    )
}
//Image
function Image({msg}){
    const [size,setSize] = useState('SMALL');
    const onSetSize = ()=>{
        setSize("ORIGINAL");
    }
    return(
       <div>
           <img
               src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${msg.fileId}&type=${size}`}
               className={`app-chat-content-img ${size === 'SMALL' ? 'blur' : ''}`}/>
           {
               size === 'SMALL'?
                   <button type="button" onClick={onSetSize} className="app-chat-btn-download">
                       <IconDownload/>
                   </button>:''
           }
       </div>
    )
}
// Button
function ButtonToBottom({isDown, toBottom}){
    return(
        <div onClick={toBottom} className={`app-chat-btn-down ${ !isDown ? 'd-none' : ''}`}>
            <IconArrowDown/>
        </div>
    )
}
//Video player
function Video({msg}){
    const [isPlay,setIsPlay] = useState(false);
    const videoImage = useRef();
    const [url,_] = useState(`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${msg.fileId}&type=THUMBNAIL`)
    const onPlay = ()=>{
        setIsPlay(true);
    }
    return(
        <div className={`app-chat-content-video ${isPlay ? 'app-chat-content-video-play' : ''}`}>
            {
                isPlay ?
                   <VideoPlayer isPlay={isPlay} msg={msg}/>:
                    <>
                        <img ref={videoImage} src={url}
                             className={`app-chat-content-img ${isPlay ? '' :'blur'}`}/>
                        <button onClick={onPlay} type="button" className="app-chat-btn-download">
                            <IconPlay/>
                        </button>
                        <span className="app-chat-content-video-size">
                            <MessageSize fileSize={msg.file.size}/>
                        </span>
                    </>
            }
        </div>
    )
}
function VideoPlayer({msg,isPlay}){
    const [firstChart,setFirstChart] = useState(false);
    const [play,setPlay] =  useState(isPlay);
    const [timerDuration,setTimerDuration] = useState(0);
    const [duration,setDuration] = useState(0);
    const video = useRef();
    const videoTimer = useRef();
    useEffect(()=>{
        if(play){
            video.current.play();
        }else{
            video.current.pause();
        }
    },[play]);
    // useEffect(()=>{
    //     if(timerDuration > 0 && play){
    //         video.current.play();
    //     }
    //     if(!play){
    //         console.log("Play false")
    //         clearTimer();
    //     }
    // },[play]);
    // useEffect(()=>{
    //     if(timerDuration > 0){
    //         onTimer();
    //     }
    //     return()=>{
    //         clearTimer();
    //     }
    // },[]);
    // useEffect(()=>{
    //     if(duration > 0){
    //         setTimerDuration(duration);
    //     }
    // },[duration]);
    // useEffect(()=>{
    //     if(timerDuration > 0){
    //         onTimer();
    //     }
    // },[timerDuration]);
    // Start video
    const onTimer = ()=>{
        if(videoTimer.current){
            clearTimeout(videoTimer.current);
        }
        if(play){
            videoTimer.current = setTimeout(()=>{
                setTimerDuration(timerDuration - 1000);
            },1000);
        }
    }
    const onPlaying = ()=>{
        setFirstChart(true);
        setPlay(true);
    }
    const onLoadMetaData = (e)=>{
        setDuration(video.current.duration * 1000);
    }
    const onPlay = ()=>{
        setPlay(true);
    }
    // Stop methods
    const clearTimer =()=>{
        if(videoTimer.current){
            clearTimeout(videoTimer.current);
        }
    }
    const onWaiting = ()=>{
        setFirstChart(false);
        setPlay(false);
    }
    const onPause = (e)=>{
        setPlay(false);
    }
    // Timer
    const time = useMemo(()=>{
        const mm = parseInt((timerDuration / 1000 )/ 60);
        const ss = parseInt((timerDuration / 1000) % 60);
        return (
            mm <= 0 && ss <=0 ?
                <span>
                    00:00
                </span>:
                <span>
                    {mm > 9 ? mm : `0${mm}`} : {ss > 9 ? ss : `0${ss}`}
                </span>
        )
    },[timerDuration]);
    return(
        <div className={`app-player ${ !play ? 'app-player-loading' : ''}`}>
             <span className="app-player-size">
                <MessageSize fileSize={msg.file.size}/>
            </span>
            <video
                onClick={ play ? onPause : onPlay}
                onPause={onPause}
                onPlay={onPlay}
                // controls
                // onLoadedMetadata={onLoadMetaData}
                // onWaiting={onWaiting}
                // onPlaying={onPlaying}
                poster={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${msg.fileId}&type=THUMBNAIL`}
                ref={video}
                src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${msg.fileId}`} />
            {/*{*/}
            {/*    !firstChart ?*/}
            {/*        <span className="app-player-loader"/>:""*/}
            {/*}*/}
            {/*{*/}
            {/*    duration > 0 ?*/}
            {/*        <span className="app-player-duration">*/}
            {/*            {*/}
            {/*                time*/}
            {/*            }*/}
            {/*        </span>:''*/}
            {/*}*/}
        </div>
    )
}

//Message size
function MessageSize({fileSize = 0}) {
    return useMemo(() => {
        let kb = 0;
        let type = 'Kb';
        kb = fileSize / 1024;
        if (kb > 1024) {
            kb = kb / 1024;
            type = 'Mb'
        } else if (kb > (1024 * 1024)) {
            kb = kb / 1024 / 1024;
            type = 'Gb';
        }
        return (
            <span>{kb.toFixed(2)} {type}</span>
        )
    }, [fileSize]);
}

function ContextMenu() {
    const {chatMessageContext = null} = useSelector(s => s);
    const dispatch = useDispatch();
    const timeOut = useRef()
    useEffect(() => {
        document.addEventListener('click', () => {
            timeOut.current = setTimeout(() => {
                dispatch({
                    type: 'chatMessageContext',
                    payload: null
                })
            }, 0);
        })
        return () => {
            if (timeOut.current) {
                clearTimeout(timeOut.current);
            }
        }
    }, []);
    const onCopy = ()=>{
        if(navigator){
            navigator.clipboard.writeText(chatMessageContext.text);
            message.success("Nusxalandi! Ctl + V");
        }else{
            message.info('Bu imkoniyatdan foydalanish uchun brouzeringizni yangilang!')
        }
    }
    const onTop = useCallback(() => {
        localStorage.setItem('chatPinTop', JSON.stringify(chatMessageContext));
        dispatch({
            type: 'chatPinTop',
            payload: chatMessageContext
        })
    }, [chatMessageContext]);
    return useMemo(() => {
        return (
            chatMessageContext && Object.keys(chatMessageContext).length ?
                <ul className={`app-chat-context-menu`} style={{
                    left: chatMessageContext.contextOption.clientX,
                    top: chatMessageContext.contextOption.clientY,
                }}>
                    <li>
                        <IconUndoLeft/> Javob berish
                    </li>
                    <li>
                        <span style={{transform: "scale(-1,1)", display: 'inline-block'}}>
                            <IconUndoLeft/>
                        </span> Ulashish
                    </li>
                    <li onClick={onCopy}>
                        <IconCopy/> Nusxalash
                    </li>
                    <li onClick={onTop}>
                        <IconTag/> Top
                    </li>
                    <li className="text-danger">
                        <IconTrash/> O'chirish
                    </li>
                </ul> : ''
        )
    }, [chatMessageContext])
}

function ChatCreatNewMessage() {
    return (
        <div className="app-chat-new-message">
            <h4 className="mb-0">
                Bu foydalanuvchi va sizning o'rtangizda habarlar mavjud emas.
            </h4>
            <p className="m-0 text-muted small">
                Lekin siz yangi habar yozish imkoniga egasiz
            </p>
            <img src="/images/hi.gif" alt=""/>
        </div>
    )
}

function ChatLoader({row = 3}) {
    return (
        <Row>
            {
                Array.from(Array(row),
                    (e, i) => {
                        return (
                            i % 2 === 0 ?
                                <Col span={10}>
                                    <ChatUserLoader row={1}/>
                                </Col> :
                                <Col span={10} offset={14}>
                                    <ChatUserLoader reverse row={1}/>
                                </Col>
                        )
                    })}
        </Row>
    )
}

export default ChatContentBody;