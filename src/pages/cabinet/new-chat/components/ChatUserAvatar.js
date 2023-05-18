import {useEffect, useLayoutEffect, useMemo, useState} from "react";

function ChatUserAvatar({user}){
    const [hashId,setHashId] = useState(null);
    const [name,setName] = useState('');
    useLayoutEffect(()=>{
        if('hashId' in user && user.hashId){
            setHashId(user.hashId)
        }else if('photo' in user && user.photo){
            setHashId(user.photo);
        }
    },[user]);
    useEffect(()=>{
        if(!hashId &&  user && (user.name || user.full_name)){
            let userName = 'name' in user ? user.name : user.full_name;
            userName = userName.split(' ');
            userName = `${userName[0][0] || ''} ${userName[1][0] || ''} ${userName[2][0] || ''}`
            setName(userName);
        }
    },[hashId]);
    return useMemo(()=>{
        return(
            <div className="app-chat-sider-avatar">
                {
                    hashId ?
                        <img
                            className="app-chat-sider-user-avatar"
                            src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${hashId}&type=SMALL`}/>:
                        <span>
                       {
                           name
                       }
                   </span>
                }
            </div>
        )
    },[hashId])
}
export default ChatUserAvatar