import {Col, Row} from "antd";
import {
    IconAttachRotate, IconClose,
    IconDotsVertical, IconEdit,
    IconFillUndoRight,
    IconMic,
    IconSend
} from "../../../../../../components/Icon";
import ButtonDefault from "../../../../../../styleComponents/ButtonDefault";
import {useEffect, useRef, useState} from "react";
import Picker from 'emoji-picker-react';
import {SmileOutlined} from "@ant-design/icons";
import {connect, useDispatch} from "react-redux";
import Req from "../../../../../../store/api";


function ChatFooter({
                        onSend,onReplay,onUpdate,connection, replayedMessageId = null, editMessage = null, onFileUpload
}){
    const input = useRef();
    const [emojy,setEmojy] = useState(false);
    const [fileLoader,setFileLoader] = useState(false);
    const dispatch = useDispatch();
    const [extensions,setExtensions] = useState(['.jpg', '.jpeg', '.png', '.jfif', '.pjpeg', '.pjp', '.xls', '.word', '.pdf'] )
    useEffect(()=>{
        if(editMessage && Object.keys(editMessage).length){
            input.current.value = editMessage.text
        }
    },[editMessage]);
    const send = ()=>{
        if(input.current.value && input.current.value !=''){
            if(replayedMessageId && Object.keys(replayedMessageId).length){
                onReplay(input.current.value,replayedMessageId.id);
                onCloseReplay();
            }else if(editMessage && Object.keys(editMessage).length){
                onUpdate(input.current.value,editMessage.id);
                onCloseUpdate();
            }else{
                onSend(input.current.value);
            }
            input.current.value = ''
        }
    }
    const onKeyUp =(e)=>{
        if(e.code ==='Enter' || e.code === 'NumpadEnter'){
            send();
        }
    }
    const onEmojiClick = (event, emojiObject) => {
        const value = input.current.value;
        input.current.value = `${value}${emojiObject.emoji}`;
        input.current.focus();
        onClose();
    };
    const onShow =()=>{
        setEmojy(!emojy);
    }
    const onClose =()=>{
        setEmojy(false);
    }
    const onCloseReplay=()=>{
        dispatch({
            type: 'replayedMessageId',
            payload: null
        })
        input.current.value = ''
    }
    const onCloseUpdate =()=>{
        dispatch({
            type: 'editMessage',
            payload: null
        })
        input.current.value = ''
    }
    const onUploadFile =(e)=>{
        const file = e.target.files[0];
        if(file && !fileLoader){
            let {size,type} = file;
            type = type.split('/');
            type = type[type.length - 1];
            let isError = false;
            if(size / 1024 / 1024 > 10) {
                isError = true
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: 'File yuklashning max. hajmi 10Mb'
                    }
                })
            }
            const index = extensions.indexOf(`.${type}`);
            if(type && index <= -1){
                isError = true;
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: `Siz yuklagan fayl formati tizim uchun no muttanosib. Ruxsat etilgan fayillar ${extensions.join(', ')}`
                    }
                })
            }
            if(!isError){
                const formData = new FormData();
                formData.append('file',e.target.files[0]);
                setFileLoader(true);
                Req({
                    type: 'post chat/fileupload/',
                    data: formData,
                    headers: { "Content-Type": "multipart/form-data" },
                }).then(res=>{
                    onFileUpload(res.data);
                    e.target.value = ''
                }).catch(err=>{
                    console.log(err);
                    dispatch({
                        type: 'toast',
                        payload: {
                            type: 'error',
                            message: `Hatoliqk qayta urinib ko'ring!`
                        }
                    })
                }).finally(()=>{
                    setFileLoader(false);
                })
            }
        }
    }
    return (
        <div className="chat-footer">
            {
                replayedMessageId && Object.keys(replayedMessageId).length ?
                    <div className="chat-footer-replayed-block mx-auto mb-1 rounded">
                        <div className="pr-2 text-primary">
                            <IconFillUndoRight/>
                        </div>
                        <div className="w-100">
                            <p className="mb-0 text-capitalize">
                                <small className="text-primary">
                                    <strong>
                                        {
                                            replayedMessageId.author?.full_name.toLowerCase()
                                        }
                                    </strong>
                                </small>
                            </p>
                            <p className="text-no-wrap m-0">
                                <small>
                                    {
                                        replayedMessageId?.text
                                    }
                                </small>
                            </p>
                        </div>
                        <div>
                            <ButtonDefault onClick={onCloseReplay}>
                                <IconClose/>
                            </ButtonDefault>
                        </div>
                    </div>
                    :''
            }
            {
                editMessage && Object.keys(editMessage).length ?
                    <div className="chat-footer-replayed-block mx-auto mb-1 rounded">
                        <div className="pr-2 text-primary">
                            <IconFillUndoRight/>
                        </div>
                        <div className="w-100">
                            <p className="mb-0 text-capitalize">
                                <small className="text-primary">
                                    <strong>
                                        {
                                            editMessage.author?.full_name.toLowerCase()
                                        }
                                    </strong>
                                </small>
                            </p>
                            <p className="text-no-wrap m-0">
                                <small>
                                    {
                                        editMessage?.text
                                    }
                                </small>
                            </p>
                        </div>
                        <div>
                            <ButtonDefault onClick={onCloseUpdate}>
                                <IconClose/>
                            </ButtonDefault>
                        </div>
                    </div>
                    :''
            }
            <Row align="middle" className="pb-2" justify='center'>
                {/*<Col className="text-center">*/}
                {/*    <ButtonDefault className="mx-auto py-1 px-3 d-flex align-items-center">*/}
                {/*        <IconDotsVertical color={'#6588DE'}/>*/}
                {/*    </ButtonDefault>*/}
                {/*</Col>*/}
                <Col span={23} className="chat-custom-form-group">
                    <Row align='middle' justify='space-between'>
                        <Col span={1} className="text-center">
                            <label htmlFor="fileUpload" className='d-flex pl-1' style={{fontSize: '20px', cursor:'pointer'}}>
                                <IconAttachRotate color={'#6588DE'}/>
                            </label>
                            <input id={'fileUpload'} hidden type="file" onChange={onUploadFile}/>
                        </Col>
                        {/*<Col span={1} className="text-center">*/}
                        {/*    <ButtonDefault className='d-flex' style={{fontSize: '20px'}}>*/}
                        {/*        <IconMic color={'#6588DE'}/>*/}
                        {/*    </ButtonDefault>*/}
                        {/*</Col>*/}
                        <Col span={17} className="pl-2">
                            <input onKeyUp={onKeyUp} ref={input} placeholder="Habar..." type="text" className="chat-custom-form-input"/>
                        </Col>
                        <Col span={1}>
                            <ButtonDefault onClick={onShow}>
                                <SmileOutlined />
                            </ButtonDefault>
                            <div className={`emojy-block ${emojy ? 'show' : ''}`}>
                                <Picker onEmojiClick={onEmojiClick} />
                            </div>
                        </Col>
                        <Col span={5}>
                            <ButtonDefault onClick={send} className={`chat-custom-send-button ${!connection ? 'connection' : ''}`}>
                                {
                                    connection ?
                                        <>
                                                <span className="pr-1">
                                                    Yuborish
                                                </span>
                                            <IconSend color="#fff"/>
                                        </> :
                                        "Connection ..."
                                }
                            </ButtonDefault>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

export default connect(s=>{
    return {
        replayedMessageId: s?.replayedMessageId,
        editMessage: s?.editMessage
    }
})(ChatFooter)