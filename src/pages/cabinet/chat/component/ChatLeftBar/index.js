import {Card, Col, Divider, Input, Row, Skeleton} from "antd";
import UserAvatar from "../../../component/UserAvatar";
import {useSelector} from "react-redux";
import UserName from "../../../../../styleComponents/UserName";
import Style from "styled-components";
import {SearchOutlined} from "@ant-design/icons";
import {useChat} from "../../../../../hooks/useChat";
import ChatList from "../ChatList";
import {useEffect, useLayoutEffect, useMemo, useRef} from "react";
import {w3cwebsocket as W3CWebSocket} from "websocket";

const UserWrapper = Style.div`
    display: flex;
    align-items: center;
`

function ChatLeftBar() {
    const user = useSelector(s=> s.isUser ? s.isUser : {});
    const [data,loader,set,get] = useChat();
    const mws = useRef(null);
    const setOnline = (user)=>{
        const middleOnline = data;
        for (const i in middleOnline) {
            const members = middleOnline[i].members;
            for (const k in members) {
                members[k].is_online = user.is_online
                members[k].last_seen = user.last_seen
            }
        }
        set(middleOnline);
    }
    const setMessage =(chatId)=>{
        console.log(data);
    }
    useLayoutEffect(()=>{
        mws.current = new W3CWebSocket(`ws://hr.mf.uz/ws/online-users/?token=${localStorage.getItem('token')}`);
        mws.current.onopen= (e)=>{
            console.log('Connect');
        }
        mws.current.onclose = function (){
            console.log("Close online connection!");
        }
        mws.current.onmessage = function (message){
            const messageData = JSON.parse(message.data);
            if('user' in messageData){
                setOnline(messageData.user);
            }
            if('new_message' in messageData){
                setMessage(messageData.new_message.chat);
            }
        }
        mws.current.onerror=(error)=>{
            console.log(error);
        }
    },[])
    useEffect(()=>{
        return () => {
            if(mws.current){
                mws.current.close();
            }
        }
    },[]);
    const chatList = useMemo(()=>{
        return <ChatList chats={data}/>
    },[data])
    return  <Card className="chat-left-bar" style={{position: 'sticky', top:0}}>
                <UserWrapper>
                    <UserAvatar className='m-0' size={'sm'} file={user.images} gender={user.gender}/>
                    <div className="px-3">
                        <UserName className='mb-0' size={'18px'}>{user?.full_name}</UserName>
                        <span className='text-muted'>Online</span>
                    </div>
                </UserWrapper>
                <Divider />
                <Row>
                    <Col span={12}>
                        <h3 className="mb-3">
                            <strong className="text-uppercase text-silver">Chatlar</strong>
                        </h3>
                    </Col>
                    {/*<Col span={12} className="text-right">*/}
                    {/*    <Button type='primary' size='small'>*/}
                    {/*        <IconPlus color="#fff"/> Yangi gurux*/}
                    {/*    </Button>*/}
                    {/*</Col>*/}
                </Row>
                <Input placeholder="Qidiruv" prefix={<span className="text-muted"><SearchOutlined /></span>} />
                {
                    loader ?
                        <div className="py-4">
                            <Skeleton active avatar paragraph={{ rows: 1 }} />
                            <Skeleton active avatar paragraph={{ rows: 1 }} />
                            <Skeleton active avatar paragraph={{ rows: 1 }} />
                        </div> :
                        chatList
                }
            </Card>
}
export default ChatLeftBar;