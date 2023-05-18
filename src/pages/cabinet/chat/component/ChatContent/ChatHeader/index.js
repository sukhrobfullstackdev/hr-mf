import {Col, Row} from "antd";
import {IconFileText, IconImage, IconVolumeOff, IconVolumeUp} from "../../../../../../components/Icon";
import Style from "styled-components";
import {useState} from "react";


const IconWrapper = Style.button`
    display: inline-block;
    width: 40px;
    height: 40px;
    background-color: ${p=>p.bc ? p.bc === 'on' ? "#F1F0F6" :"#2842C8" : "#F1F0F6" };
    border-radius: 50%;
    text-align: center;
    border: none;
    cursor: pointer;
    color: ${p=>p.bc ? p.bc === 'on' ? 'inherit' : '#F1F0F6' : 'inherit'}
`
export default function ChatHeader(){
    const [chatMessageSound, setChatMessageSound] = useState(localStorage.getItem('chatMessageSound') || 'on');
    const setVolume = ()=>{
        localStorage.setItem('chatMessageSound', chatMessageSound === 'off' ? 'on' : 'off');
        setChatMessageSound(chatMessageSound === 'off' ? 'on' : 'off');
    }
    return  <div className="chat-header">
                <Row justify="end" gutter={16}>
                   {/*<Col>*/}
                   {/*     <IconWrapper>*/}
                   {/*         <IconImage/>*/}
                   {/*     </IconWrapper>*/}
                   {/*</Col>*/}
                   {/* <Col>*/}
                   {/*     <IconWrapper>*/}
                   {/*         <IconFileText/>*/}
                   {/*     </IconWrapper>*/}
                   {/* </Col>*/}
                    <Col>
                        <IconWrapper onClick={setVolume} bc={chatMessageSound}>
                            {
                                chatMessageSound === 'on' ?
                                    <IconVolumeUp/> : <IconVolumeOff/>
                            }
                        </IconWrapper>
                    </Col>
                </Row>
            </div>
}