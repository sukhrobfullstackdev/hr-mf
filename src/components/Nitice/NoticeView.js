import {Button, Card, Col, Modal, Row, Select, Skeleton} from "antd";
import Small from "../../styleComponents/Small";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetDynamic} from "../../hooks/useGet";
import {useEffect, useState} from "react";
import {COMMAND_CONFIRMED, CONFIRMED_NOTICE, GET_ONE_NOTICE, UPDATE_NOTICE} from "../../store/types";
import {useDispatch, useSelector} from "react-redux";
import {IconArrowUpLeft, IconCheckMark, IconChevronLeft, IconClose} from "../Icon";
import NoData from "../NoData";
import useEimzo from "../../hooks/useKey";
import {useRef} from "react";
import usePost from "../../hooks/usePost";
import {ButtonLink} from "../../styleComponents/ButtonDefault";
import Container from "../Container";

const {Option} = Select;

function NoticeView({customData = null}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [post, postLoader] = usePost();
    const [isDisabled, setIsDisabled] = useState(false);
    const user = useSelector(s => s.isUser || null);
    const [keys, pkcs7_64, getItem, onConfirm] = useEimzo();
    const [data, get, getLoader] = useGetDynamic(false);
    const [url, setUrl] = useState(`/cabinet/approved/notice`);
    const [modal, setModal] = useState(false);
    const [activeKey, setActiveKey] = useState(null);
    const textarea = useRef();
    useEffect(() => {
        if (user && 'current_role' in user && user.current_role === 'HO') {
            setUrl('/dashboard/notice');
        }
    }, [user])
    useEffect(() => {
        if(!customData){
            get(`${GET_ONE_NOTICE}${id}`);
        }
    }, []);
    useEffect(() => {
        if (pkcs7_64) {
            post(CONFIRMED_NOTICE, {
                notice: parseInt(id),
                pkcs7: pkcs7_64
            }, () => {
                navigate(url)
            })
        }
    }, [pkcs7_64]);
    const onActiveKey = (v) => {
        const a = keys.filter(k => k.itemId === v);
        setActiveKey(a.length ? a[0] : null);
    }
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false);
    }
    const onKeyUp = () => {
        const value = textarea.current.value;
        if (value && value !== '' && value !== undefined) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }
    const onFinish = () => {
        if (activeKey && Object.keys(activeKey).length) {
            onConfirm(activeKey, textarea.current.value)
        } else {
            dispatch({
                type: 'toast', payload: {
                    type: 'error', message: 'Iltimos kalitlardan biringi tanlang!'
                }
            })
        }
    }
    const onRejected = () => {
        post(`${UPDATE_NOTICE}${id}/change-status/`, {
            status: 'rejected'
        }, () => {
            navigate('/dashboard/notice');
        })
    }
    return (
        <Card className="my-5">
            {
                getLoader ?
                    <Skeleton active/> :
                    <Container>
                        <NoticeContainer notice={Array.isArray(data) ? {} : data}/>
                        <p className="py-3 text-right">
                            <Link to={url}>
                                <IconChevronLeft/> Ortga qaytish
                            </Link>
                            {
                                (user && 'current_role' in user && user.current_role === 'HO') && data.status === 'new' ?
                                    <>
                                        <ButtonLink className="ml-3 text-danger" disabled={postLoader}
                                                    onClick={onRejected}>
                                            <IconClose/> Bekor qilish
                                        </ButtonLink>
                                        <ButtonLink className="ml-3 text-primary" disabled={postLoader}
                                                    onClick={openModal}>
                                            <IconCheckMark/> Tasdiqlash
                                        </ButtonLink>
                                    </>
                                    : ""
                            }
                        </p>
                    </Container>
            }
            {/*Confirm modal*/}
            <Modal title={<strong>Tizimga kirish uchun ERI kalitini tanlang</strong>}
                   visible={modal}
                   onOk={onFinish}
                   footer={null}
                   onCancel={closeModal}
            >
                {keys.length ? <>
                    <h4>Kalitlar</h4>
                    <Select
                        onChange={onActiveKey}
                        style={{width: '100%'}}
                        defaultValue={null}>
                        <Option value={null}>Kalitni tanlang</Option>
                        {
                            keys.map((key, i) => {
                                return (
                                    <Option key={key.itemId} disabled={!key.expired} value={key.itemId}>
                                        <strong>STIR: </strong><span className="pr-1">{key.TIN}</span>
                                        <strong>F.I.O.: </strong><span className="pr-1">{key.CN}</span>
                                    </Option>
                                )
                            })
                        }
                    </Select>
                    <p className="mb-2 mt-3">
                        Tasdiqlash uchun matn
                    </p>
                    <textarea onKeyUp={onKeyUp} className="ant-input" ref={textarea}
                              placeholder="Tasdiqlash matni"/>
                    <Row justify="space-between" gutter={16} className="pt-3">
                        <Col span={12}>
                            <Button onClick={closeModal}>
                                Bekor qilish
                            </Button>
                        </Col>
                        <Col span={12}>
                            <div className="text-right">
                                <Button disabled={isDisabled || postLoader} onClick={onFinish} type={"primary"}
                                        className="ml-3">
                                    <IconCheckMark/> Tasdiqlash
                                </Button>
                            </div>
                        </Col>
                    </Row>

                </> : <NoData message={'ERI kalitlari mavjud emas!'}/>}
            </Modal>
        </Card>
    )
}
const Table = ({data = []})=>{
    return(
        <table border={1} className="custom-table mb-4">
            <thead>
                <tr>
                    <th>T/R</th>
                    <th>Hodim familiya isim sharifi</th>
                    <th>Lavozimi</th>
                    <th>Ustama miqdori</th>
                    <th>Boshlanish sanasi</th>
                </tr>
            </thead>
            <tbody>
                {
                    data.map((user,i)=>{
                        return(
                            <tr>
                                <td className="text-center">{i+1}.</td>
                                <td className="text-capitalize">{user.staff.full_name.toLowerCase()}</td>
                                <td className="text-center">{user.staff.position}</td>
                                <td className="text-center">{user.premium_amount}%</td>
                                <td className="text-center">{new Date(user.premium_date).toLocaleDateString()}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}
export const NoticeContainer = ({notice = {}})=>{
    return(
        Object.keys(notice).length ?
        <>
            <Row justify="end">
                <Col span={6}>
                    <h3>
                        {
                            notice?.organization.name
                        }
                        {
                            notice?.organization?.head_org.position
                        }
                        {
                            notice?.organization?.head_org.full_name
                        }
                    </h3>
                </Col>
            </Row>
            <h3 className="text-center m-0 py-5">
                <strong>Bildirishnoma</strong>
            </h3>
            <p className="lh-20" style={{textAlign: 'justify',textIndent: '40px'}}>
                {notice.text}
            </p>
            <Table data={notice.premiums}/>
            {
                notice.confirmer ?
                    <Row gutter={16} justify="space-around">
                        <Col>
                           <strong>
                               {
                                   notice.staff.position
                               }
                           </strong>
                        </Col>
                        <Col>
                           <strong className="text-capitalize">
                               {
                                   notice.staff.full_name.toLowerCase()
                               }
                           </strong>
                        </Col>
                    </Row> : ''
            }
            <p>
                <Small className="text-muted">
                    Bildirgi turi
                </Small>
                {
                    notice.type === 'business_trip' ? "Mexnat safar" : 'Hodimga ustama belgilash'
                }
            </p>
        </> :
            <NoData message="Bildirishnoma topilmadi yoki o'chirib yuborilgan!"/>
    )
}
export default NoticeView;