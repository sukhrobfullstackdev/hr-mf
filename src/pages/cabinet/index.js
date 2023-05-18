import CabinetAuth from "../../components/CabinetAuth";
import Header from "./component/Header";
import {connect, useDispatch, useSelector} from "react-redux";
import {ChatButton} from "../../components/Chat";
import {Outlet, useLocation} from "react-router-dom";
import Auth from "../../components/Auth";
import {useEffect, useRef, useState} from "react";
import {Button, Col, Input, message, Modal, Row, Tooltip} from "antd";
import {IconCopy} from "../../components/Icon";


function Cabinet(){
    const is_view_mf_id = useSelector(s=>s?.is_view_mf_id);
    const location = useLocation();
    const dispatch = useDispatch();
    const [visible,setVisible] = useState(false);
    const password = useRef();
    const mf_id = useRef()
    const isUser = useSelector(s=>s.isUser || {});
    useEffect(()=>{
        if(isUser && Object.keys(isUser).length){
            setVisible(isUser.mf_password ? true : false);
        }
    },[isUser]);
    const onCancel = ()=>{
        dispatch({
            type: 'is_view_mf_id',
            payload: true
        })
        setVisible(false);
    }
    const copy = (type="mf_id")=>{
        if(type === 'mf_id'){
            navigator.clipboard.writeText(mf_id.current.input.value);
        }else {
            navigator.clipboard.writeText(password.current.input.value);
        }
        message.success('Nusxalandi!');
    }
    return  <Auth>
                <CabinetAuth>
                    <Header/>
                    <Outlet/>
                    {
                        location.pathname.indexOf('cabinet/chat') > 0?'' : <ChatButton/>
                    }
                </CabinetAuth>
                {
                    !is_view_mf_id ?
                        <Modal
                            footer={
                                <div>
                                    <a href="https://id.mf.uz/" target={"_blank"} className="mr-3">
                                        MF - id tizimiga kirish
                                    </a>
                                    <Button onClick={onCancel} type="primary">
                                        Yopish
                                    </Button>
                                </div>
                            }
                            title="MF-id tizimiga kirish uchun siznig ma'lumotlaringiz"
                            onCancel={onCancel}
                            visible={visible}>
                            <strong className="mb-2">Mf Id</strong>
                            <Row gutter={16} className="mb-3">
                                <Col span={20}>
                                    <Input ref={mf_id} disabled={true} value={isUser.mf_id} style={{width: '100%'}}/>
                                </Col>
                                <Col span={4}>
                                    <Tooltip title="Nusxalash">
                                        <Button onClick={()=>copy('mf_id')} block icon={<IconCopy />} />
                                    </Tooltip>
                                </Col>
                            </Row>
                            <strong className="mb-2">Mf parol</strong>
                            <Row gutter={16}>
                                <Col span={20}>
                                    <Input.Password ref={password} value={isUser.mf_password} style={{width: '100%'}}/>
                                </Col>
                                <Col span={4}>
                                    <Tooltip title="Nusxalash">
                                        <Button onClick={()=>copy('mf_password')} block icon={<IconCopy />} />
                                    </Tooltip>
                                </Col>
                            </Row>
                        </Modal> :''
                }
            </Auth>
}
export default connect((s)=>{
    return{
        loader: s?.loader
    }
})(Cabinet);