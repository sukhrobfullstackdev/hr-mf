import Style from "styled-components";
import {CommentOutlined, HomeOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const ChatButtonWrapper = Style.div`
    position: fixed;
    right:50px;
    bottom: 50px;
    z-index: 9999;
`
const Button = Style.button`
    width: 80px;
    height: 80px;
    background-color: #2943C9;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    color:#fff;
    font-size: 34px;
`
function ChatButton({type = 'chat'}){
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const to = ()=>{
        dispatch({
            type :'selectedChatContact',
            payload: null
        })
        if(type === 'chat'){
            navigate('/cabinet/chat');
        }
        if(type === 'home'){
            navigate('/cabinet/info');
        }
    }
    return  <ChatButtonWrapper>
                <Button onClick={to} className='chat-button-animate'>
                    {
                        type === 'chat' ?
                            <CommentOutlined /> : <HomeOutlined />
                    }
                </Button>
            </ChatButtonWrapper>
}
export {ChatButton}