import Style from "styled-components";
import {useEffect, useState} from "react";
import {MessageOutlined, PhoneOutlined} from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {CHAT_CREATE} from "../../../../../store/types";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import {IconChevronLeft, IconMessageCircle, IconPhone, IconPlus, IconSend} from "../../../../../components/Icon";
import {Col, Modal, Row} from "antd";
import Small from "../../../../../styleComponents/Small";
import {Link} from "react-router-dom";


const Wrapper = Style.div`
    width: 100%;
    display: flex;
    padding: .7rem;
    align-items: center;
    transition: background-color .25s linear;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    &:hover{
        background-color: #f2f2f2;
    &:hover .button{
        opacity: 1;
        pointer-event: unset;
    }
`
const UserAvatar = Style.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
`
const UserImage = Style.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
`
const UserFullName = Style.div`
    width: 100%;
    height: 100%;
    background-color: ${p=>p.bc};
    display: flex;
    justify-content: center;
    align-items:center;
    color: #fff;
    font-size: 18px;
    font-weight: 600;
`
const UserName = Style.p`
    font-size: 16px;
    margin: 0;
    text-transform: capitalize;
    display: flex;
    align-items: center;
    justify-content: center;
`
const ButtonWrapper = Style.div`
    position: absolute;
    right:0;
    bottom: 0;
    top: 0;
    background-color: #f2f2f2;
    opacity: 0;
    pointer-event: none;
    transition: .25s linear;
    cursor: pointer;
    padding: 0 1rem;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &:hover{
        opacity: 1;
        pointer-event: unset;
    }
`
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function UserAvatarAlternate({fullName}){
    const [userName, setUserName] = useState('');
    const [color, setColor] = useState(getRandomColor());
    useEffect(()=>{
        let name = fullName.split(' ');
        name = name.length >= 2 ? `${name[0][0]}${name[1][0]}` : `${name[0][0]}`
        setUserName(name);
    },[])
    return  <UserFullName bc={color}>
                <div>
                    {userName}
                </div>
            </UserFullName>
}
function ContactUser({user,isOnline}){
    const dispatch = useDispatch();
    const [visible,setVisible] = useState(false);
    const setChat=()=>{
        dispatch({
            type: CHAT_CREATE,
            payload: {
                userId: user.id,
                reload: true
            }
        })
    }
    const onViewContact = ()=>{
        setVisible(true);
    }
    const onCancel = ()=>{
        setVisible(false);
    }
    return  <Wrapper>
                <div>
                    <UserAvatar>
                        {
                            user.image ?
                                <UserImage src={`${process.env.REACT_APP_SERVER_URL}${user.image}`}/>:
                                <UserAvatarAlternate fullName={user?.full_name}/>
                        }
                    </UserAvatar>
                </div>
                <div className="px-2">
                    <UserName>
                        {user?.full_name.toLowerCase()}
                    </UserName>
                    <div className="m-0 text-muted">
                        <PhoneOutlined />: {user.mob_phone_no ? user.mob_phone_no: 'Mavjud emas!'}
                    </div>
                </div>
                <ButtonWrapper>
                    <ButtonDefault title="SMS yozish" onClick={setChat}>
                        <IconMessageCircle/>
                    </ButtonDefault>
                    <ButtonDefault onClick={onViewContact} title="Kontakt ma'lumotlari">
                        <IconPhone/>
                    </ButtonDefault>
                </ButtonWrapper>
                <Modal visible={visible} footer={null} onCancel={onCancel}>
                    <Row gutter={24}>
                        <Col span={4}>
                            <UserAvatar>
                                {
                                    user.image ?
                                        <UserImage src={`${process.env.REACT_APP_SERVER_URL}${user.image}`}/>:
                                        <UserAvatarAlternate fullName={user?.full_name}/>
                                }
                            </UserAvatar>
                        </Col>
                        <Col span={20}>
                            <Small className="text-muted">I.F.SH.</Small>
                            <Small className="pt-1">
                                <strong>{user.full_name}</strong>
                            </Small>
                        </Col>
                        <Col span={24} className="py-4">
                            <Row gutter={24}>
                                <Col span={12}>
                                    <div className="border-bottom mb-3">
                                        <Small className="text-muted">Telefon raqami</Small>
                                        <Small className="pt-1">
                                            <strong>
                                                {
                                                    user?.mob_phone_no || ` Ma'lumot mavjud emas!`
                                                }
                                            </strong>
                                        </Small>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div className="border-bottom mb-3">
                                        <Small className="text-muted">Ichki raqami</Small>
                                        <Small className="pt-1">
                                            <strong>
                                                {
                                                    user?.home_phone || ` Ma'lumot mavjud emas!`
                                                }
                                            </strong>
                                        </Small>
                                    </div>
                                </Col>
                                <Col span={24}>
                                    <div className="border-bottom mb-3">
                                        <Small className="text-muted">Elektron pochta manzili</Small>
                                        <Small className="pt-1">
                                            <strong>
                                                {
                                                    user?.email || ` Ma'lumot mavjud emas!`
                                                }
                                            </strong>
                                        </Small>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Modal>
            </Wrapper>
}
export default ContactUser