import {useSelector} from "react-redux";

function ChatContentNoChat(){
    const {chatConnection = false} = useSelector(s=>s);
    return(
        <div className="h-100 d-flex align-items-center justify-content-center">
            {
                chatConnection ?
                    <div className="text-center">
                        <img src="/images/chat_photo.svg" alt="" style={{maxHeight: '420px'}}/>
                        <h4 className="w-50 mx-auto py-3 small text-muted">
                            Kontaklar ro'yxatidan yoki chatlar ro'yxatidan ixtiyoriy chatni tanlang va o'zaro
                            xabarlar almashing
                        </h4>
                    </div>
                    :
                    <Connection/>
            }
        </div>
    )
}
function Connection(){
    return(
        <div>
            <div className="chat-connection">
                <div className="chat-connection-row"/>
                <div className="chat-connection-row"/>
                <div className="chat-connection-row"/>
                <div className="chat-connection-dot"/>
            </div>
            <div className="text-muted py-3 text-center">
                Server bilan bog'lanish. Iltimos kuting.
                <p className="small">
                    Agar ko'p vaqt serverbilan bog'lanishni imkoni bo'lmasa iltimos internet
                    tarmog'i mavjudligini tekshiring!
                </p>
            </div>
        </div>

    )
}
export default ChatContentNoChat;