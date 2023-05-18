import {useDispatch, useSelector} from "react-redux";
import {Col, Row} from "antd";
import {IconClose} from "../../../../components/Icon";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {useEffect, useState} from "react";
import {GET_CONTACTS} from "../saga";
import ChatContactList from "./ChatContactList";

function ChatCreateListener(){
    const {chatCreateGroup,chatCreateChannel,chatContactList = []} = useSelector(s=>s);
    const dispatch = useDispatch();
    const onClose = ()=>{
        dispatch({
            type: 'chatCreateGroup',
            payload: false
        })
        dispatch({
            type: 'chatCreateChannel',
            payload: false
        })
    }
    const setSelectUser = (contact)=>{

    }
    return(
        <>
            <div style={{height: '10%'}} className="p-3">
                <Row>
                    <Col span={20}>
                        <strong>
                            {
                                chatCreateGroup ?
                                    'Gurux' : 'Kanal'
                            }
                            a'zolarini qo'shish
                        </strong>
                    </Col>
                    <Col span={4} className="text-right">
                        <ButtonDefault onClick={onClose}>
                            <IconClose/>
                        </ButtonDefault>
                    </Col>
                </Row>
            </div>
            <ChatContactList cb={setSelectUser} height={'90%'}/>
        </>
    )
}
export default ChatCreateListener;