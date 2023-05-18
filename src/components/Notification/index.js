import {IconBell} from "../Icon";
import {Badge, Drawer} from "antd";
import {useEffect, useRef, useState} from "react";
import Style from "styled-components";
import {connect} from "react-redux";
import NoData from "../NoData";

const BadgeWrapper = Style.button`
    font-size: 24px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
`
function Notification({notReadFbmMessage=0,fbmMessages = []}){
    const [onShow,setOnShow] = useState(false);
    const audio = useRef();
    const onShowMessage = ()=>{
        setOnShow(true)
    }
    useEffect(()=>{
        if(notReadFbmMessage){
            audio.current.play();
        }
    },[notReadFbmMessage]);
    const onClose = ()=>{
       setOnShow(false)
    }
    return(
        <Badge count={notReadFbmMessage}>
            <BadgeWrapper onClick={onShowMessage}>
                <IconBell/>
            </BadgeWrapper>
            <audio ref={audio} hidden={true} src='/sound/message.mp3'/>
            <Drawer title="Barcha xabarlar" placement="right" onClose={onClose} visible={onShow}>
                {
                    fbmMessages.length ?
                        fbmMessages.map(item=>{
                            return(
                                <div className="border-bottom mb-2" key={`fbmMessage${item.idKey}`}>
                                    <p>
                                        <strong>{item.title}</strong>
                                    </p>
                                    <p className="text-silver mb-1">
                                        {item.body}
                                    </p>
                                    <div className="small text-muted text-right">
                                        {item.isRead ? `O'qilgan` : `O'qilmagan`}
                                    </div>
                                </div>
                            )
                        }):
                        <NoData message="Sizda hozircha habarlar mavjud emas!" size="sm"/>
                }
            </Drawer>
        </Badge>
    )
}
const stp = state=>({
    notReadFbmMessage: state.notReadFbmMessage,
    fbmMessages: state.fbmMessages,
})
export default connect(stp)(Notification)