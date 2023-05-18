import {useDispatch, useSelector} from "react-redux";
import {Col, Row} from "antd";
import ChatListAvatar from "./ChatListAvatar";
import {IconClose} from "../../../../components/Icon";
import {useEffect, useMemo} from "react";
import {Typing} from "./ChatListUserName";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {useParams} from "react-router-dom";

function ChatContentHeader(){
    const {chatConnection = false,selectedChatContact} = useSelector(s=>s);
    const connection = useMemo(()=>{
        return(
            !chatConnection ?
                <p className="mb-0 small text-muted ">
                    Server bilan bog'lanish <span className="opacity">. . .</span>
                </p>:
                <ChatUserStatus user={{
                    lastSeen: selectedChatContact.lastSeen,
                    isOnline: selectedChatContact.isOnline,
                    url: selectedChatContact.photo,
                    name: selectedChatContact.fullName
                }}/>
        )
    },[chatConnection, selectedChatContact]);
    return(
        <div className='app-chat-header p-3 border-bottom'>
            <Row justify="space-between" align="middle">
                <Col className="d-flex align-items-center">
                    <ChatListAvatar
                        online={selectedChatContact.typing ? selectedChatContact.online : false}
                        img={{
                            size: "SMALL",
                            url: selectedChatContact?.photo,
                            name: selectedChatContact?.name
                        }}/>
                    <div className="px-2">
                        <strong>{selectedChatContact.name}</strong>
                        {connection}
                    </div>
                </Col>
            </Row>
            <ChatPin/>
        </div>
    )
}

function ChatUserStatus({user}) {
    return useMemo(() => {
        if (user.typing) {
            return (
                <div className="text-muted lh-sm">
                    <Typing isIcon={false}/>
                </div>
            )
        }
        if (user.isOnline) {
            return (<div className="small text-muted">Online</div>)
        }
        return (
            <div className="small text-muted">
                {new Date(user.lastSeen).toLocaleDateString()}, {new Date(user.lastSeen).toLocaleTimeString('ru-RU', {minute: 'numeric',hour:'numeric'})}
            </div>
        )
    }, [user]);
}
function ChatPin(){
    const {chatPinTop = null} = useSelector(s=>s);
    const dispatch = useDispatch();
    const {chatId} = useParams();
    useEffect(()=>{
        const chatPin = localStorage.getItem('chatPinTop');
        if(chatPin){
            dispatch({
                type: 'chatPinTop',
                payload: JSON.parse(chatPin)
            })
        }
    },[]);
    const onClose =()=>{
        localStorage.removeItem('chatPinTop');
        dispatch({
            type: 'chatPinTop',
            payload: null
        })
    }
    return useMemo(()=>{
        return(
            (
                chatPinTop && parseInt(chatId) === chatPinTop.chatId ?
                    <div className="chat-header-pin text-no-wrap">
                        {
                            chatPinTop.text
                        }
                        <ButtonDefault onClick={onClose} className="chat-header-pin-close">
                            <IconClose/>
                        </ButtonDefault>
                    </div>:''
            )
        )
    },[chatPinTop,chatId])
}
export default ChatContentHeader