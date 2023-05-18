import Style from "styled-components";
import {useEffect, useState} from "react";


const Wrapper = Style.div`
    width: 48px;
    height: 48px;
    background-color: #2842C8;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Img = Style.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`
const UserName = Style.h1`
    font-weight: 600;
    color: #ffffff;
    margin: 0;
    font-size: 18px;
`
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function UserTableAvatar({file = null,name = ''}){
    const [userName,setUserName] = useState('');
    useEffect(()=>{
        if(name && name.length){
            const fullName = name.split(' ');
            let userFullName = fullName[0][0];
            if(fullName.length > 1){
                userFullName += ` ${fullName[1][0]}`;
            }
            setUserName(userFullName);
        }
    },[])
    return  <Wrapper bc={getRandomColor()}>
                {
                  file ? <Img src={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/${file}`} alt=''/> :
                      <UserName>
                          {userName.toUpperCase()}
                      </UserName>
                }
            </Wrapper>
}
export default UserTableAvatar