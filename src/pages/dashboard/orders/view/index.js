import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {COMMAND_CONFIRMED, GET_COMMANDS, GET_COMMANDS_TYPES, GET_ONE_COMMANDS} from "../../../../store/types";
import {useGetDynamic} from "../../../../hooks/useGet";
import {Button, Card, Col, message, Modal, Popconfirm, Row, Select, Skeleton} from "antd";
import Blank from "../../../../components/Blank";
import Small from "../../../../styleComponents/Small";
import {IconCheckMark, IconChevronLeft, IconChevronRight, IconClose} from "../../../../components/Icon";
import {useDispatch, useSelector} from "react-redux";
import useEimzo from "../../../../hooks/useKey";
import NoData from "../../../../components/NoData";
import usePost from "../../../../hooks/usePost";
import useOrder from "../../../../hooks/useOrder";
import {ButtonLink} from "../../../../styleComponents/ButtonDefault";
import StatusBadge from "../../../../styleComponents/StatusBadge";
import InnerHtml from "../../../../components/InnerHtml";
import Req from "../../../../store/api";


const {Option} = Select

function OrderView() {
    const {reload = null} = useSelector(s=>s)
    const [post, postLoader] = usePost();
    const {id} = useParams();
    const [random,setRandom] = useState()
    const navigate = useNavigate();
    const user = useSelector(s => s.isUser || {})
    const [activeKey, setActiveKey] = useState(null);
    const [order, getOrder, loader] = useGetDynamic();
    const [type, getType, typeLoader] = useGetDynamic();
    const [keys, pkcs7_64, getItem, onConfirm] = useEimzo();
    const [modal, setModal] = useState(false);
    const [isDisabled, setIsDisabled] = useState(true);
    const dispatch = useDispatch();
    const textarea = useRef();
    const {rejected,status} = useOrder();
    useEffect(() => {
        getOrder(`${GET_ONE_COMMANDS}${id}`);
    }, [id,reload]);
    useEffect(() => {
        if (!type.length) {
            getType(GET_COMMANDS_TYPES);
        }
    }, []);
    useEffect(() => {
        if(pkcs7_64){
            post(COMMAND_CONFIRMED,{
                commad_id: parseInt(id),
                pkcs7: pkcs7_64
            },()=>{
                navigate('/dashboard/orders');
            })
        }
    }, [pkcs7_64]);
    useEffect(() => {
        if (status === 'success') {
            dispatch({
                type: 'toast', payload: {
                    type: 'success', message: "Saqlandi!"
                }
            });
            navigate('/dashboard/orders')
        } else if (status === 'error') {
            dispatch({
                type: 'toast', payload: {
                    type: 'error', message: "Hatolik qayta urinib ko'ring!"
                }
            });
        }
    }, [status]);
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
    const onFinish = () => {
        if (activeKey && Object.keys(activeKey).length) {
            onConfirm(activeKey, textarea.current.value);
        }
        else {
            dispatch({
                type: 'toast', payload: {
                    type: 'error', message: 'Iltimos kalitlardan biringi tanlang!'
                }
            })
        }
    }
    const onKeyUp = () => {
        const value = textarea.current.value;
        if (value && value !== '' && value !== undefined) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }
    const onRejected = () => {
        if (user.current_role === 'HO') {
            rejected(id);
        }
    }
    return (
        <div>
            {
                loader ?
                    <Loader/> :
                    <Row gutter={16}>
                        <Col span={18}>
                            <Card>
                                <Blank>
                                    {Object.keys(order).length ?
                                        <>
                                            <Row className="py-4">
                                                <Col span={8}>
                                           <span className="small text-muted">
                                               Buyruq raqami
                                           </span>
                                                    <p>
                                                        {order.number ? <strong>{order.number}</strong> : <span>Mavjud emas!</span>}
                                                    </p>
                                                </Col>
                                                <Col span={8} className="text-center">
                                            <span className="small text-muted">
                                                Buyruq turi
                                           </span>
                                                    <p>
                                                        {type && type.find(v => v.id === order?.type)?.title}
                                                    </p>
                                                </Col>
                                                <Col span={8} className="text-right">
                                            <span className="small text-muted">
                                                Tasdiqlangan sana
                                            </span>
                                                    <p>
                                                        {
                                                            order.confirmed_date ?
                                                                new Date(order.confirmed_date).toLocaleDateString() :
                                                                <span className="text-muted small">Mavjud emas!</span>
                                                        }
                                                    </p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                {order?.texts.map((item, i) => {
                                                    return (<Col span={24} className="mt-4">
                                                        <div className="text-center mb-2">
                                                            <strong> &sect;-{i + 1}</strong>
                                                        </div>
                                                        <InnerHtml content={item.text}/>
                                                        <Small className="my-2" size={12}>
                                                            <span className="mr-3">
                                                                Asos: <strong
                                                                className="text-muted text-capitalize">{item.cause}</strong>
                                                            </span>
                                                            {item.staff ? (
                                                                <span>
                                                            Hodim:
                                                            <strong className="text-muted text-capitalize">
                                                                {item.staff.full_name}
                                                            </strong>
                                                        </span>
                                                            ) : ""}
                                                        </Small>
                                                    </Col>)
                                                })}
                                            </Row>
                                            <Row>
                                                <Col span={24} className="border-top">
                                                    <p className="m-0 text-muted">
                                                        <strong>Kelishuvchilar</strong>
                                                    </p>
                                                    {
                                                        order.approvals.map(user=>{
                                                            return (
                                                                <StatusBadge className="mr-1 mt-1" badgeType={'pill'} status={user.approved}>
                                                                    <span className="pr-3">{user.full_name || user.user}</span>
                                                                </StatusBadge>
                                                            )
                                                        })
                                                    }
                                                </Col>
                                            </Row>
                                        </> : <NoData size="sm"/>}
                                </Blank>
                                <Row gutter={16} justify="end" align="middle">
                                    <Col className="py-3">
                                        <Link to="/dashboard/orders">
                                            <IconChevronLeft/> Buyruqlar
                                        </Link>
                                    </Col>
                                    <Col>
                                        <CheckOrderStatus order={order}/>
                                    </Col>
                                    <Col>
                                        <div className="mt-3 text-right">
                                            {user && user.current_role === 'HO' && order.status === 'approved' ? <>
                                                <ButtonLink disabled={loader} className="text-left text-danger" size="small"
                                                            onClick={onRejected}>
                                                    <IconClose/> Bekor qilish
                                                </ButtonLink>
                                                <ButtonLink className="ml-3 text-primary" onClick={openModal}>
                                                    <IconCheckMark/> Tasdiqlash
                                                </ButtonLink>
                                            </> : ''}
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card style={{position:'sticky', top:0}}>
                                <OtherOrders random={random}/>
                            </Card>
                        </Col>
                    </Row>
            }
            <Modal title={<strong>Tasdiqlash uchun ERI kalitini tanlang</strong>}
                   visible={modal}
                   onOk={onFinish}
                   footer={null}
                   onCancel={closeModal}
            >
                {
                keys.length ? <>
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
        </div>)
}
//
const CheckOrderStatus= ({order})=>{
    const {check,confirmed,status,loader} = useOrder();
    const [approvedLoader,setApprovedLoader] = useState(false);
    const user = useSelector(s=>s.isUser || null);
    const dispatch = useDispatch();
    const onChecked = ()=>{
        check(order.id);
    }
    const onApproved = ()=>{
        setApprovedLoader(true);
        Req({
            type: `post v1/tabel/command/${order.id}/approve/`
        })
            .then(res=>{
               dispatch({
                   type: 'reload',
                   payload: Math.random()
               })
            })
            .catch(err=>{
                message.error(`Hatolik! Qayta urinib ko'ring!`)
            })
            .finally(()=>{
                setApprovedLoader(false)
            })
    }
    return useMemo(()=>{
        if(user && user.current_role === 'HR'){
            if(order.status === 'new'){
                return(
                    <Popconfirm title={`Siz tomoningizdan tasdiqlanishiga rozimisiz`} onConfirm={onChecked} okText="Ha" cancelText="Yo'q">
                        <ButtonLink disabled={loader} className="text-left ant-btn-link ant-btn-block">
                            <IconCheckMark/> Tasdiqlash
                        </ButtonLink>
                    </Popconfirm>

                )
            }
            if(order.status === 'checked'){
                return  (
                    <Popconfirm title={`Raxbar imzosiga kiritish uchun yuborilsinmi?`} onConfirm={onApproved} okText="Ha" cancelText="Yo'q">
                        <ButtonLink disabled={approvedLoader} className="text-left ant-btn-link ant-btn-block">
                            <IconCheckMark/> Tasdiqlashga yuborish
                        </ButtonLink>
                    </Popconfirm>
                )
            }
            return  null
        }
        return null
    },[order])
}
const Loader = () => {
    return (<Row gutter={16}>
            <Col span={8}>
                <Skeleton active/>
            </Col>
            <Col span={8}>
                <Skeleton active/>
            </Col>
            <Col span={8}>
                <Skeleton active/>
            </Col>
        </Row>)
}

const OtherOrders = ({random})=>{
    const {appealActiveKey = null,user = null} = useSelector(s=>{
        return{
            ...s,
            user: s.isUser
        }
    });
    const [activeType,setActiveType] = useState(null);
    const [orders, get, orderLoader,_,totalCount] = useGetDynamic();
    const [orderType,getOrderType,orderTypeLoader] = useGetDynamic();
    const [page,setPage] = useState(1);
    const navigate = useNavigate();
    useEffect(()=>{
        if(orderType.length){
            const type = orderType.find(v=> v.key === 'dismiss');
            setActiveType(type.id);
        }
    },[orderType])
    useEffect(()=>{
        getOrderType(GET_COMMANDS_TYPES);
    },[])
    useEffect(() => {
        if(activeType){
            get(GET_COMMANDS, {
                page: page,
                type: activeType,
                status: user && user.current_role === 'HO' ? 'approved' : 'new'
            });
        }
    }, [activeType,appealActiveKey,page,random]);
    const onSetAppealId = (id)=>{
        navigate(`/dashboard/orders/view/${id}`);
    };
    const onChangeSelect = (v)=>{
        setActiveType(v);
    }
    return(
        <div>
            <Row align="middle" className="text-muted small border-bottom">
                <Col span={12}>
                    {
                        user && user.current_role === 'HO' ? 'Tasdiqlanishdagi' :'Kelib tushgan'
                    }
                </Col>
                <Col span={12}>
                    <Select loading={orderTypeLoader} onChange={onChangeSelect} size="small" style={{width: '100%'}} defaultValue={activeType}>
                        {
                            orderType.map(item=>{
                                return <Option value={item.id} key={item.key}>{item.title}</Option>
                            })
                        }
                    </Select>
                </Col>
            </Row>
            {
                orderLoader ?
                    <div className="mt-3">
                        <Skeleton active/>
                        <Skeleton active/>
                    </div>:
                    orders.length ? orders.map(item=>{
                            const text = item.texts.length ? item.texts[0] : null;
                            return(
                                <div key={`orders${item.id}`} className="py-2 border-bottom button-effect" onClick={()=>onSetAppealId(item.id)}>
                                    {/*<p className="text-muted small m-0">*/}
                                    {/*    {type.find(v=>v.key === item.type).title}*/}
                                    {/*</p>*/}
                                    <div className="py-1">
                                        <strong>
                                            {
                                                text ?
                                                    text.cause :''
                                            }
                                        </strong>
                                    </div>
                                    <p className="mb-0 small text-muted">
                                        Sana: {item.created_date}
                                    </p>
                                </div>
                            )
                        }) :
                        <div className="mt-3">
                            <NoData size="sm"/>
                        </div>
            }
            <Row align="middle" justify="end" className="mt-3 small text-muted">
                <Col className="text-muted">
                    <strong>{totalCount}</strong> ta dan
                    <strong className="px-2">{orders.length}</strong>
                    <button onClick={()=>setPage(page-1)} disabled={page <= 1} className="button-un-styled">
                        <IconChevronLeft/>
                    </button>
                    <strong className="px-2">{page}</strong>
                    <button onClick={()=>setPage(page+1)} disabled={ page >= totalCount / 10 }  className="button-un-styled">
                        <IconChevronRight/>
                    </button>
                </Col>
            </Row>
        </div>
    )
}

export default OrderView;