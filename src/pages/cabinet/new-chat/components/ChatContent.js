import {useEffect, useMemo} from "react";
import {connect, useDispatch} from "react-redux";
import {GET_MESSAGES_BY_CHAT} from "../saga";
import {useParams} from "react-router-dom";
import ChatContentBody from "./ChatContentBody";
import ChatFooter from "./ChatFooter";
import ChatContentHeader from "./ChatHeader";
import ChatContentNoChat from "./ChatContentNoChat";

function ChatContent({selectedChatContact, sock,}) {
    const {chatId} = useParams();
    const dispatch = useDispatch();
    useEffect(() => {
        if (chatId) {
            dispatch({
                type: GET_MESSAGES_BY_CHAT,
                payload: chatId
            });
        }
    }, [chatId]);
    return useMemo(() => {
        return (
            <div className="app-chat-content">
                {
                    selectedChatContact ?
                        <>
                            <ChatContentHeader/>
                            <ChatContentBody/>
                            <ChatFooter sock={sock}/>
                        </>
                        :
                        <ChatContentNoChat/>
                }
            </div>
        )
    }, [chatId, selectedChatContact]);
}
const stp = (state) => {
    return {
        selectedChatContact: state.selectedChatContact || null,
        chatList: state.chatList || null
    }
}
export default connect(stp)(ChatContent);