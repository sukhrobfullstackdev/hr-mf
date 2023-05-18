import {Col, Row, Skeleton} from "antd";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import {
    IconClose,
    IconFileText,
    IconImage,
    IconMenu,
    IconMic,
    IconUsers,
    IconVideo,
    IconVolumeUp
} from "../../../../components/Icon";
import {useDispatch, useSelector} from "react-redux";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import ChatCreateListener from "./ChatCreateListner";
import ChatContactList from "./ChatContactList";
import UserAvatar from "../../component/UserAvatar";
import {GET_CHAT_HASHID} from "../saga";
import ChatUserAvatar from "./ChatUserAvatar";

function ChatSider(){
    const {selectedChatContact = null,chatCreateGroup = false,chatCreateChannel = false} = useSelector(s=>s);
    return(
        <div className="app-chat-sider">
            {
                chatCreateChannel || chatCreateGroup ?
                    <ChatCreateListener/>:
                selectedChatContact ?
                    <ChatSelectedUserSider user={selectedChatContact}/>:
                    <ChatUserSider/>
            }
        </div>
    )
}
function ChatUserSider(){
    const dispatch = useDispatch();
    const user = useSelector(s=>s.userChat || null);
    const setSelectUser = (contact)=>{
        dispatch({
            type: 'selectedChatContact',
            payload: {
                ...contact,
                contacts: contact.contacts,
                name: contact.fullName
            }
        });
    }
    return(
        <>
            <div style={{height: '28%', overflowX: 'hidden', overflowY: 'auto'}}>
                <UserData user={user}/>
            </div>
            <ChatContactList cb={setSelectUser}/>
        </>
    )
}
function ChatSelectedUserSider({user = null}){
    useEffect(()=>{
        // console.log(user,"=======");
    },[user])
    return(
        <div>
            <UserData burger={false} user={user}/>
            <div className="p-3 border-bottom">
                <Row justify="space-between">
                    <Col span={24}>
                        <strong className="text-muted small text-uppercase">Kontakt ma'lumotlari</strong>
                    </Col>
                    <Col span={24}>
                        <span className="text-muted small">Telefon raqami</span>
                        <div className="pt-1 small">
                            <strong className="text-muted">
                                {
                                    user?.contacts?.phoneNumber ?
                                        <a href={`tel:${user.contacts.phoneNumber}`}>
                                            {user.contacts.phoneNumber}
                                        </a>
                                    : ` Ma'lumot mavjud emas!`
                                }
                            </strong>
                        </div>
                    </Col>
                    <Col span={24}>
                        <span className="text-muted small">Ichki telefon</span>
                        <div className="pt-1 small">
                            <strong className="text-muted">
                                {
                                    user?.contacts?.homeNumber || ` Ma'lumot mavjud emas!`
                                }
                            </strong>
                        </div>
                    </Col>
                    <Col span={24}>
                        <span className="text-muted small">Elektron pochta manzili</span>
                        <div className="pt-1 small">
                            <strong className="text-muted">
                                {
                                    user?.contacts?.email || ` Ma'lumot mavjud emas!`
                                }
                            </strong>
                        </div>
                    </Col>
                </Row>
            </div>
            <div className="p-3">
                <Row justify="space-between mb-3">
                    <Col>
                        <strong className="text-muted small text-uppercase">Media</strong>
                    </Col>
                </Row>
                <ChatMedia user={user}/>
            </div>
        </div>
    )
}

// Style components for media

function ChatMedia({user}){
    return(
        <>
            <div className="d-flex mb-1">
                <IconBlock>
                    <IconFileText/>
                </IconBlock>
                <div className="pl-3">
                    Xujjatlar
                    <div className="text-muted small">
                        {user.chatId} Mb
                    </div>
                </div>
            </div>
            <div className="d-flex mb-1">
                <IconBlock>
                    <IconImage/>
                </IconBlock>
                <div className="pl-3">
                    Fotolar
                    <div className="text-muted small">
                        {user.chatId} Mb
                    </div>
                </div>
            </div>
            <div className="d-flex mb-1">
                <IconBlock>
                    <IconMic/>
                </IconBlock>
                <div className="pl-3">
                    Audiolar
                    <div className="text-muted small">
                        {user.chatId} Mb
                    </div>
                </div>
            </div>
            <div className="d-flex mb-1">
                <IconBlock>
                    <IconVideo/>
                </IconBlock>
                <div className="pl-3">
                    Videolar
                    <div className="text-muted small">
                        {user.chatId} Mb
                    </div>
                </div>
            </div>
        </>
    )
}
function IconBlock({children}){
    return(
        <div className="chat-icon-block">
            {children}
        </div>
    )
}


// User data in sider
function UserData({user = null, burger = true}){
    const loader = useSelector(s=> s.advanceLoader.indexOf(GET_CHAT_HASHID) >=0);
    const [approvedUser,setApprovedUser] = useState(false);
    useLayoutEffect(()=>{
        if(user && (user?.fullName || user?.name) && (user?.hashId || user?.photo)){
            setApprovedUser(true)
        }
    },[user]);
    const userBlock = useMemo(()=>{
        return(
            approvedUser ?
                <>
                   <ChatUserAvatar user={user}/>
                    <p className="mb-0 mt-2 app-chat-sider-user-name">
                        <div className="text-capitalize text-no-wrap px-2">
                            {
                                'fullName' in user ?
                                    user.fullName.toLowerCase():
                                    user.name.toLowerCase()
                            }
                        </div>
                        {
                            'nick' in user ?
                                <p className="m-0 px-2 text-muted small">
                                    @NICK
                                </p>:''
                        }
                        {
                            'lastSeen' in user?
                                <span className="text-muted small">
                                   {new Date(user.lastSeen).toLocaleDateString()},
                                    {new Date(user.lastSeen).toLocaleTimeString('ru-RU', {minute: 'numeric',hour:'numeric'})}
                                </span>:''
                        }
                    </p>
                </>
                // <>
                //     {
                //         approvedUser ?
                //             <>
                //                 <img
                //                     className="app-chat-sider-user-avatar"
                //                     src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${'hashId' in user ? user.hashId : user.photo}&type=SMALL`}/>
                //                 <p className="mb-0 mt-2 app-chat-sider-user-name">
                //                     <div className="text-capitalize text-no-wrap px-2">
                //                         {
                //                             'fullName' in user ?
                //                                 user.fullName.toLowerCase():
                //                                 user.name.toLowerCase()
                //                         }
                //                     </div>
                //                     {
                //                         'nick' in user ?
                //                             <p className="m-0 px-2 text-muted small">
                //                                 @NICK
                //                             </p>:''
                //                     }
                //                     {
                //                         'lastSeen' in user?
                //                             <span className="text-muted small">
                //                    {new Date(user.lastSeen).toLocaleDateString()}, {new Date(user.lastSeen).toLocaleTimeString()}
                //                 </span>:''
                //                     }
                //                 </p>
                //             </> :
                //         <HrUser/>
                //     }
                // </>
            :
                <div className="px-4">
                    <Skeleton active/>
                </div>
        )
    },[user,approvedUser]);
    return(
        <div className="text-center border-bottom py-4 app-chat-sider-user">
            <Burger burger={burger}/>
            {
                loader ?
                    <div className="px-3">
                        <Skeleton active/>
                    </div> : userBlock
            }
        </div>
    )
}
function HrUser(){
    const user = useSelector( s => s.isUser || null);
    return(
        user ?
            <>
                <div className="app-chat-user border-bottom-0 mb-0 pb-1">
                    <UserAvatar className='m-0' size={'sm'} file={user?.images} updated={false} gender={user?.gender}/>
                    <div className="app-chat-user-name text-left">
                        <p className="mb-0">
                            <span className="text-capitalize text-ellipses-2 d-block">
                                {user?.full_name.toLowerCase()}
                            </span>
                        </p>
                    </div>
                </div>
                 <p className="small text-muted m-0 px-2">
                    Tasdiqlanmagan foydalanuvchi. Iltimos hr.mf.uz tizim administratoriga murojaat qiling
                </p>
            </>

        :''
    )
}
//Burger
function Burger({burger}){
    const [toggle,setToggle] = useState(false);
    const dispatch = useDispatch();
    const onToggle = ()=>{
        setToggle(!toggle);
    }
    const onCreateGroup = ()=>{
        dispatch({
            type: 'chatCreateGroup',
            payload: true
        })
    }
    const onCreateChannel = ()=>{
        dispatch({
            type: 'chatCreateChannel',
            payload: true
        })
    }
    const onClose = ()=>{
        dispatch({
            type: 'selectedChatContact',
            payload: null
        })
    }
    return(
        <div className="app-chat-sider-menu">
            <ButtonDefault onClick={burger ? onToggle : onClose} className={`app-chat-sider-burger ${toggle ? 'toggle' : ''}`}>
                {
                    burger ? <IconMenu/> : <IconClose/>
                }
            </ButtonDefault>
            {
                toggle ?
                    <ul className="app-chat-sider-menu-context">
                       <li onClick={onCreateGroup}>
                           <IconVolumeUp/> Yangi kanal
                       </li>
                       <li onClick={onCreateChannel}>
                           <IconUsers/> Yangi gurux
                       </li>
                    </ul> : ""
            }
        </div>
    )
}


export default ChatSider;