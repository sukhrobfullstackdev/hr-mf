import {useLayoutEffect, useState} from "react";

function ChatListAvatar({img, online = false, size = 'md'}){
    const [isImage,setIsImage] = useState(true);
    const [userName,setUserName] = useState('');
    useLayoutEffect(()=>{
        if(typeof img === 'string'){
            setIsImage(false);
            let userN = img.split(' ');
            if(userN.length > 1){
                setUserName(`${userN[0][0]|| ''}${userN[1][0] || ''}`);
            }
            if(userN.length >= 0){
                setUserName(`${userN[0][0]|| ''}`);
            }

        }
    },[img]);
    return(
        <div className={`app-chat-user-avatar ${size} ${online ? 'online' : ''} ${isImage ? 'bg-transparent' : ''}`}>
            {
                isImage && img.url ?
                    <img src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/newchat/api/v1/file?hashId=${img.url}${img.size ? `&type=${img.size}` : ''}`} alt={img.c}/>:
                    <span className="text-uppercase">
                        {userName}
                    </span>
            }
        </div>
    )
}
export default ChatListAvatar;