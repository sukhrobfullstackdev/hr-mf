import ButtonWrapper from "../../../../styleComponents/ButtonWapper";
import Style from "styled-components";
import {useEffect, useState} from "react";
import {Modal, Select} from "antd";
import useEimzo from "../../../../hooks/useKey";
import NoData from "../../../../components/NoData";
import {useDispatch, useSelector} from "react-redux";
import {AUTH_ERI} from "../../../../store/types";

const H1 = Style.h1`
    color: #fff;
    font-size: 18px;
    text-align:center;
    margin: 0;
    text-transform: uppercase;
`
const {Option} = Select;
function Ekey(){
    const fbmToken = useSelector(s=>s.fbmToken || null);
    const dispatch = useDispatch();
    const [modal,setModal] = useState(false);
    const [activeKey,setActiveKey] = useState(null);
    const [keys,pkcs7_64,getItem] = useEimzo();
    const loader = useSelector(s=>s.loader);
    useEffect(()=>{
        if(pkcs7_64){
            dispatch({
                type: AUTH_ERI,
                payload:{
                    tin: activeKey.TIN,
                    username: pkcs7_64,
                    fcm_token: fbmToken
                }
            })
        }
    },[pkcs7_64]);
    const openModal = ()=>{
        setModal(true)
    }
    const closeModal=()=>{
        setModal(false);
    }
    const onActiveKey = (v)=>{
        const a = keys.filter( k => k.itemId === v);
        setActiveKey(a.length ? a[0] : null);
    }
    const onFinish = ()=>{
        if(activeKey && Object.keys(activeKey).length){
            getItem(activeKey);
        }else{
            dispatch({
                type: 'toast',
                payload:{
                    type: 'error',
                    message: 'Iltimos kalitlardan biringi tanlang!'
                }
            })
        }
    }
    return  <>
                <ButtonWrapper onClick={openModal}>
                    <H1>ERI orqali</H1>
                </ButtonWrapper>
                <Modal  title={
                                <strong>Tizimga kirish uchun ERI kalitini tanlang</strong>
                            }
                        okButtonProps={{
                                disabled: loader
                            }}
                        visible={modal}
                        okText="Kirish"
                        onOk={onFinish}
                        cancelText="Bekor qilish"
                        onCancel={closeModal}
                >
                    {
                        keys.length ?
                            <>
                                <h4>Kalitlar</h4>
                                <Select
                                    onChange={onActiveKey}
                                    style={{width: '100%'}}
                                    defaultValue={null}
                                    loading={loader}
                                    disabled={loader}
                                >
                                    <Option value={null}>Kalitni tanlang</Option>
                                    {
                                        keys.map((key,i) =>{
                                            return <Option key={key.itemId} disabled={!key.expired} value={key.itemId}>
                                                        <strong>STIR: </strong><span className="pr-1">{key.TIN}</span>
                                                        <strong>F.I.O.: </strong><span className="pr-1">{key.CN}</span>
                                                    </Option>
                                        })
                                    }
                                </Select>
                            </>:
                            <NoData message={'ERI kalitlari mavjud emas!'}/>
                    }
                </Modal>
            </>
}
export default Ekey;