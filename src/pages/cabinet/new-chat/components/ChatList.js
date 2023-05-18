import {connect, useDispatch, useSelector} from "react-redux";
import UserAvatar from "../../component/UserAvatar";
import {useEffect, useRef, useState} from "react";
import ChatListUserName from "./ChatListUserName";
import ChatListAvatar from "./ChatListAvatar";
import {GET_CHAT, GET_MESSAGES_BY_CHAT_OLD} from "../saga";
import ChatUserLoader from "../../../../components/Loader/ChatUserLoader";
import NoData from "../../../../components/NoData";
import {useParams} from "react-router-dom";


function ChatList({user = {},chatConnection = false}) {
    return (
        <div className="app-chat-list p-3">
            <div className="app-chat-user">
                <UserAvatar className='m-0' size={'sm'} file={user?.images} gender={user?.gender}/>
                <div className="app-chat-user-name">
                    <p className="mb-0">
                        <strong className="text-capitalize text-ellipses-2">
                            {user?.full_name.toLowerCase()}
                        </strong>
                    </p>
                    <span className='text-muted'>
                        {
                            !chatConnection ?
                            <>Bog'lanish <span className="opacity">. . .</span></>:
                            <>Online</>
                        }
                    </span>
                </div>
            </div>
            <ChatListContent/>
        </div>
    )
}
// Chat all list by user
function ChatListContent() {
    const chatListBlock = useRef();
    const [page,setPage] = useState(0);
    const {chatList = null} = useSelector(s=>s);
    const dispatch = useDispatch();
    const loader = useSelector(s=>s.advanceLoader.indexOf(GET_CHAT) > -1);
    useEffect(()=>{
        dispatch({
            type:GET_CHAT,
            payload: {
                page: page,
            }
        })
    },[page]);
    const onScroll = ()=>{
        if(chatList.pages > page + 1){
            const isBottom = chatListBlock.current.scrollHeight - chatListBlock.current.scrollTop <= chatListBlock.current.clientHeight;
            if(isBottom){
                setPage(page + 1);
            }
        }
    }
    return (
        <div className="app-chat-list-content">
            <div className="app-chat-title">
                Chatlar
            </div>
            <div className="app-chat-list-items" onScroll={onScroll} ref={chatListBlock}>
                {
                    loader ?
                        <ChatUserLoader row={4}/> :
                        chatList && 'data' in chatList && chatList.data.length ?
                            chatList.data.map((item) => {
                                return (
                                    <ChatListItem chat={item.chat} lastMessage={item.lastMessage || {}} key={`chatListItem${item.chat.id}`}/>
                                )
                            }) :
                            <NoData message="Sizda chatlar mavjud emas!" size="sm"/>
                }
            </div>
        </div>
    )
}
// Chat list item by map
function ChatListItem({chat,lastMessage}) {
    return (
        <div className="app-chat-list-content-item mb-3">
            <ChatListAvatar img={chat.photo ? {
                url: chat.photo,
                name: chat.name,
                size: 'SMALL'
            } : chat.name } online={chat.isOnline}/>
            <ChatListUserName chatId={chat.id} isOnline={chat.isOnline} chatType={chat.type} lastMessage={lastMessage} userName={chat.name}/>
            <ChatListLink chat={chat}/>
            {
                chat.unreadMessageCount ?
                    <NewMessage count={chat.unreadMessageCount}/>: null
            }
        </div>
    )
}
function ChatListLink({chat}){
    const dispatch = useDispatch();
    const {chatId} = useParams();
    const onSetChatId = ()=>{
        if(chat.id != chatId){
            dispatch({
                type :'selectedChatContact',
                payload: {
                    ...chat,
                    user_name: chat.name,
                    chatId: chat.id
                }
            })
        }
    }
    return(
        <span className="app-chat-list-item-link" onClick={onSetChatId}/>
    )
}
function NewMessage({count}){
    return(
        <span className="app-chat-new-message-badge">
            {count}
        </span>
    )
}
const stp = (state) => {
    return {
        user: state.isUser || null,
        chatConnection: state.chatConnection
    }
}
export default connect(stp)(ChatList);