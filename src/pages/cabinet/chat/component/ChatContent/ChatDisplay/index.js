import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {connect, useDispatch} from "react-redux";
import ChatLoader from "../../../../../../components/Loader/ChatLoader";
import UserAvatar from "../../../../../../styleComponents/UserAvatar";
import {LoadingOutlined} from "@ant-design/icons";
import store from "../../../../../../store";
import {useParams} from "react-router-dom";
import {
    IconAllDone,
    IconArrowUpLeft,
    IconArrowUpRight,
    IconCheckMark,
    IconEdit, IconFile,
    IconTrash
} from "../../../../../../components/Icon";
import {Modal, message, Button} from "antd";
import ChatModal from "../../ChatModal";


const Chat = function (props) {
    const {item = {}, userId,} = props;
    const [user, setUser] = useState(item.author);
    const [diff,setDiff] = useState(0);
    const dispatch = useDispatch();
    const contentRef = useRef();
    const text = useRef();
    useEffect(()=>{
        const updated = new Date(item.updated_at);
        const created = new Date(item.created_at);
        setDiff(Math.abs(created.getTime() - updated.getTime()) / 60);
    },[])
    useEffect(() => {
        let lastUser = item.author;
        let fullName = lastUser.full_name.split(' ');
        fullName = fullName.map(v => v.toLowerCase());
        fullName = fullName.join(' ');
        lastUser.full_name = fullName;
        setUser(lastUser);
    }, [item]);
    const onDbClick = ()=>{
        const inputElement = document.createElement('input')
        // inputElement.setAttribute('hidden','hidden');
        inputElement.setAttribute('value',item.text);
        text.current.appendChild(inputElement);
        inputElement.select();
        const ok = document.execCommand('copy');
        if(ok){
            message.info('Matnidan nusxa olindi!')
        }
        text.current.removeChild(inputElement);
    }
    const forward = ()=>{
        dispatch({
            type: 'isVisibleModalChatForward',
            payload: true
        })
        dispatch({
            type: 'chatForward',
            payload: item.id
        });
    }
    const replayMessage = ()=>{
        dispatch({
            type: 'replayedMessageId',
            payload: item
        })
        dispatch({
            type: "editMessage",
            payload: null
        });
    }
    const trashMessage = ()=>{
        dispatch({
            type: "trashMessageId",
            payload: item.id
        })
    }
    const editMessage = ()=>{
        dispatch({
            type: "editMessage",
            payload: item
        });
        dispatch({
            type: 'replayedMessageId',
            payload: null
        })
    }
    return  <div className={`chat-display-item ${userId == item.author.id ? 'align-right' : ''}`}>
                <div className="chat-display-item-user">
                    <div className="chat-display-item-user-avatar">
                        {
                            user.image ?
                                <img src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/${user.image}`} alt={user?.full_name}/> :
                                <UserAvatar name={user?.full_name}/>
                        }
                    </div>
                </div>
                <div className="px-2 chat-display-item-content">
                    <p className="mt-0 mb-2 chat-display-item-user-name">
                        {user?.full_name.toLowerCase()}
                    </p>
                    <div className="chat-display-item-message" ref={contentRef}>
                        <div className="chat-display-item-message-content">
                            <img src="/images/chat-effect.svg" alt="" className="chat-display-item-message-content-effect"/>
                            {
                                item.answered_to ?
                                    <div className="chat-display-item-answer">
                                        <div className="chat-display-item-user-name">
                                            {
                                                item.answered_to.author.full_name.toLowerCase()
                                            }
                                        </div>
                                        <div className="text-ellipses-3">
                                            {item.answered_to?.text}
                                        </div>
                                    </div>: ""
                            }
                            {
                                item.forwarded_from ?
                                    <div className="chat-item-small-text chat-display-item-forwarded">
                                        <span className="chat-display-item-user-name">
                                            {item.forwarded_from?.full_name.toLowerCase()}
                                        </span>
                                        <span className="pl-1">
                                            dan uzatilgan habar
                                        </span>
                                    </div>:''
                            }
                            {
                                item.attachments && item.attachments.length ?
                                    item.text === 'png' || item.text === 'jpg' || item.text === 'jpeg' ?
                                        <ChatImage image={item.attachments[0]}/> :
                                        <ChatFile text={item.text} file={item.attachments[0]}/>
                                        :
                                        <span ref={text} onDoubleClick ={onDbClick}>
                                            {item.text}
                                        </span>
                            }
                            <div className="text-right small text-muted">
                                {
                                    diff > 0 ? 'Taxrirlangan' : ''
                                }
                                <span>
                                    {
                                        item.is_read ? <IconAllDone/>:<IconCheckMark/>
                                    }
                               </span>
                            </div>
                            <div className="chat-display-item-message-action rounded">
                                <div>
                                    <button type="button" className="chat-display-action-button" onClick={replayMessage}>
                                        <IconArrowUpLeft/>
                                    </button>
                                    <button type="button" className="chat-display-action-button" onClick={()=>forward(item)}>
                                        <IconArrowUpRight/>
                                    </button>
                                </div>
                                {
                                    userId == item.author.id ?
                                        <div className="text-center">
                                            {
                                                item.forwarded_from ? "" :
                                                    <button type="button" className="chat-display-action-button" onClick={editMessage}>
                                                        <IconEdit/>
                                                    </button>
                                            }
                                            <button type="button" className="chat-display-action-button text-danger" onClick={trashMessage}>
                                                <IconTrash/>
                                            </button>
                                        </div>  : ""
                                }
                            </div>
                        </div>
                        <div className="chat-display-item-message-time">
                            <p className="m-0">
                                {
                                    `${new Date(item.created_at).getHours()}
                                :
                                ${new Date(item.created_at).getMinutes() <= 9 ? `0${new Date(item.created_at).getMinutes()}`: new Date(item.created_at).getMinutes()}`
                                }
                            </p>
                            <p className="m-0">
                                {
                                    new Date(item.created_at).toLocaleDateString()
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
}

function ChatDisplay(props) {
    const {user = {}, chatList = {}, loader = false, connection, chatReload, isVisibleModalChatForward = false} = props;
    const [chatData, setChat] = useState([]);
    const chatDisplay = useRef();
    const {id} = useParams();
    const dispatch = useDispatch();
    useLayoutEffect(() => {
        setChat([]);
    }, [id]);
    useEffect(() => {
        setChat(store.getState().list)
    }, [chatReload]);
    useEffect(() => {
        if (chatData && chatList && chatDisplay.current) {
            chatDisplay.current.scrollTop = chatDisplay.current.scrollHeight;
        }
    }, [chatReload, chatList]);
    const handleCancel =()=>{
        dispatch({
            type: 'isVisibleModalChatForward',
            payload: false
        })
    }
    return loader ?
        <ChatLoader/> :
        <div className="chat-display p-3" ref={chatDisplay}>
            {
                'messages' in chatList ? chatList.messages.map(chat => {
                    return <Chat userId={user.id} key={`chat${chat.id}`} item={chat}/>
                }) : ""
            }
            {
                chatData.map(chat => {
                    return Object.keys(chat).length ? <Chat userId={user.id} key={`chat${chat.id}`} item={chat}/> :""
                })
            }
            {
                !connection ?
                    <div className="chat-display-connection">
                        <div className="text-center">
                            <LoadingOutlined/>
                            <p className="text-muted mt-2">
                                Server bilan bog'lanish. Iltimos kuting!
                            </p>
                        </div>
                    </div> : ''
            }
            <Modal title="Biron chatni tanlang!"
                   visible={isVisibleModalChatForward}
                   onCancel={handleCancel}
                   footer={null}
            >
                <ChatModal/>
            </Modal>
        </div>

}
function ChatImage({image}){
    return(
        <img src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/${image.file}`} className="chat-image" alt=""/>
    )
}
function ChatFile({file,text}){
    return(
        <a className="chat-file" href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}${file.file}`} target="_blank">
           <span className="chat-file-icon mr-3">
                <IconFile/>
           </span>
            .{
              text
            } turidagi file
        </a>
    )
}
export default connect((s) => {
    return {
        user: s?.isUser,
        loader: s?.loader,
        chatList: s?.chatList,
        list: s.list,
        chatReload: s.chatReload,
        isVisibleModalChatForward: s?.isVisibleModalChatForward
    }
})(ChatDisplay);