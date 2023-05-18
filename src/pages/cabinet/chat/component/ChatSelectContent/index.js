import {Card} from "antd";


function ChatSelectContent(){
    return  <Card className="chat-select-block">
                <img src="/images/chat.jpg" alt="Don`t selected chat"/>
                <h4>Siz bu qisimda hamkasiblar bilan online chat orqali habar almashishingiz mumkin!</h4>
                <p className="text-muted">
                    Kontaktlar bo'limidan chat uchun hamkasb tanlang yoki chatlar ro'yxatindan ma'lum bir chatni tanlang
                </p>
            </Card>
}
export default ChatSelectContent;