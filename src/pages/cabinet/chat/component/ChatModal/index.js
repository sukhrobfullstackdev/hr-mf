import {useChat} from "../../../../../hooks/useChat";
import {Col, Row, Skeleton} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import UserAvatar from "../../../../../styleComponents/UserAvatar";
import {useNavigate} from "react-router-dom";


function List({user,list}){
    const [member,setMember] = useState({});
    const [lastSeen,setLastSeen] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    useEffect(()=>{
        const m = list.members.filter(v=> parseInt(v.id) !== parseInt(user.id));
        if(m.length){
            setMember(m[0]);
        }
    },[list])
    useEffect(()=>{
        if(Object.keys(member).length){
            let diff = Math.abs(new Date(member.last_seen) - new Date(Date.now())) / 1000; //mil sek to sek
            diff = Math.ceil(diff / 60);// sek to min
            if(diff < 60){
                setLastSeen(`Taxminan ${diff} min oldin`);
            } else if(Math.ceil(diff / 60 ) < 60){
                diff = parseInt(diff/60);
                setLastSeen(`Taxminan ${diff} soat oldin`);
            } else{
                diff = Math.ceil(diff / ( 60 * 60 * 24));
                if( diff <= 7){
                    setLastSeen(
                        `Taxminan ${diff} kun olidn`
                    )
                }
            }
            if(member.is_online) {
                setLastSeen('Online')
            }
        }
    },[member]);
    const setItem = ()=>{
        dispatch({
            type: 'chatForwardTo',
            payload: list.id
        });
        navigate(`/cabinet/chat/${list.id}`)
    }
    return Object.keys(member).length ?
        <Row gutter={16} className="mb-2 cursor-pointer hovered py-2 rounded" onClick={setItem}>
            <Col>
                <UserAvatar className='m-0' size={'sm'} user={member} file={member.image}/>
            </Col>
            <Col>
                <p className="m-0">
                    <strong className="text-capitalize">
                        {
                            member.full_name.toLowerCase()
                        }
                    </strong>
                </p>
                <p className="m-0 text-muted">
                    {
                        lastSeen
                    }
                </p>
            </Col>
        </Row> : <Skeleton active avatar/>
}

function ChatModal(){
    const [data,loader,set,get] = useChat();
    const user = useSelector(s=> s?.isUser);
    return  <div>
                {
                    loader ?
                        <Skeleton active paragraph={{rows: 5}}/> :
                        data.map((item)=>{
                            return <List key={`chatItemList${item.id}`} list={item} user={user}/>
                        })
                }
            </div>
}
export default ChatModal;