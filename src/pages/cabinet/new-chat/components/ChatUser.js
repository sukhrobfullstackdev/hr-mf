import Style from "styled-components";
import ChatListAvatar from "./ChatListAvatar";
import ChatListUserName from "./ChatListUserName";

const Wrapper = Style.div`
    display: flex;
    width:100%;
    align-items: center;
    padding: 0.4rem 0;
    p{
        font-size: 16px;
        line-height: 16px;
        letter-spacing:1px;
    }
    .app-chat-user-avatar{
        width: 40px;
        height: 40px;
    }
`
function ChatUser({user, imageSize = null}){
    return(
        <Wrapper>
            <ChatListAvatar img={user.photo ? {
                size: imageSize,
                url: user.photo,
                name: user.fullName
            }: user.fullName }/>
            <ChatListUserName lastSeen={user.lastSeen} isOnline={user.isOnline || false} userName={user.fullName} typing={user.typing || false}/>
        </Wrapper>
    )
}
export default ChatUser