import {useEffect, useState} from "react";

export function Avatar({file}){
    return  <div className="user-avatar-image">
                <img src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/${file}`} alt={file}/>
            </div>
}

function UserAvatar({user = {}, className = '', size= 'lg'}){
    const [userName,setUserName] = useState('');
    useEffect(()=>{
        if(Object.keys(user).length){
            const fullName = user.full_name ? user.full_name.split(' ') : '';
            if(fullName.length){
                let userFullName = fullName[0][0];
                if(fullName.length > 1){
                    userFullName += ` ${fullName[1][0]}`;
                }
                setUserName(userFullName);
            }
        }
    },[]);
    return  <div className={`user-avatar ${className} ${size}`}>
                {
                   Object.keys(user).length && user.image ?
                       <Avatar file={user.image} />:
                        userName.toUpperCase()

                }
            </div>
}
export default UserAvatar;