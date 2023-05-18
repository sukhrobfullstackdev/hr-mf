import Style from "styled-components";
import NoData from "../../../../../components/NoData";
import {useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import {Col, Row} from "antd";
import {useNavigate} from "react-router-dom";
import UserAvatar from "../../../../../styleComponents/UserAvatar";

const Wrapper = Style.div`
    max-height: 56vh;
    overflow-y: auto;
    overflow-x: hidden;
    cursor: pointer;
    transition: .25s linear;
`
const UserName = Style.span`
    text-transform: capitalize;
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    display: block;
`

function List({chat,user}){
    const [member, setMember] = useState({});
    const navigate = useNavigate();
    const [lastSeen,setLastSeen] = useState('Bir necha hafta oldin');
    useEffect(()=>{
        let lastUser = chat.members.filter(v=> {
            return parseInt(v.id) !== parseInt(user.id)
        });
        if(lastUser.length){
            lastUser = lastUser[0];
            let fullName = lastUser?.full_name.split(' ');
            fullName = fullName.map(v => v.toLowerCase());
            fullName = fullName.join(' ');
            lastUser.full_name = fullName;
            setMember(lastUser);
        }

    },[]);
    const onChat =(id)=>{
        navigate(`/cabinet/chat/${id}`);
    }
    useEffect(()=>{
        if(Object.keys(member).length){
            let diff = Math.abs(new Date(member.last_seen) - new Date(Date.now())) / 1000; //mil sek to sek
            diff = Math.ceil(diff / 60);// sek to min
            if(diff < 60){
                setLastSeen(`Taxminan ${diff} min oldin`)
            } else if(Math.ceil(diff / 60 ) < 60){
                setLastSeen(`Taxminan ${Math.ceil(diff / 60)} soat oldin`)
            } else{
                diff = Math.ceil(diff / ( 60 * 60 * 24))
                if( diff <= 7){
                    setLastSeen(
                        `Taxminan ${Math.ceil(diff)} kun olidn`
                    )
                }
            }
        }
    },[member]);
    return  <Row onClick={()=>onChat(chat.id)} align="middle" className={`px-3 py-2`}>
                <Col span={4}>
                    <UserAvatar className={member.is_online ? 'connection' : ''} user={member}/>
                </Col>
                <Col span={chat.new_messages > 0 ? 18 : 20} className="position-relative overflow-hidden">
                    <UserName>
                        {member?.full_name}
                    </UserName>
                    {
                        <p className="ex-small m-0 text-muted">
                            {
                                member.is_online ? 'Online' : lastSeen
                            }
                        </p>
                    }
                </Col>
                {/*{*/}
                {/*    chat.new_messages > 0 ?*/}
                {/*        <Col span={2}>*/}
                {/*            <span className="notification">{chat.new_messages}</span>*/}
                {/*        </Col>:""*/}
                {/*}*/}
            </Row>
}

function ChatList({chats}){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const reload = useSelector(s=>s.reload ? s.reload : null);
    const list = useMemo(()=>{
        return chats.length ?
                    chats.map(item=>{
                        return <List user={user} key={`chatList${item.id}`} chat={item}/>
                    }):
                    <NoData message="Ma'lumot mavjud emas!" size='sm' color="#fff"/>
    },[reload]);
    return  <Wrapper className="mt-3 chat-left-bar-list">
                {list}
            </Wrapper>
}
export default ChatList