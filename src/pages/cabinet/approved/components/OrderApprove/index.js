import {useGetDynamic} from "../../../../../hooks/useGet";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useMemo, useRef, useState} from "react";
import {
    APPROVERS_REJECTED_COMMANDS,
    GET_COMMAND_BY_USER,
    GET_COMMAND_PDF_BY_ID,
    GET_COMMANDS_TYPES
} from "../../../../../store/types";
import Req from "../../../../../store/api";
import {Button, Card, Col, Popconfirm, Row, Skeleton} from "antd";
import Pin from "../../../../../styleComponents/Pin";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import NoData from "../../../../../components/NoData";
import {Link} from "react-router-dom";
import {IconChevronLeft, IconChevronRight, IconEye} from "../../../../../components/Icon";
import Blank from "../../../../../components/Blank";
import Small from "../../../../../styleComponents/Small";
import UserAvatar from "../../../component/UserAvatar";
import UserTableAvatar from "../../../../../components/UserTableAvatar";
import InnerHtml from "../../../../../components/InnerHtml";


function PopTile({comment}) {
    return (
        <div>
            Haqiqatdan ham bu arizani bekor qilmoxchimisiz!
            <div className="mt-2">
                <strong>Sabab izox</strong>
            </div>
            <div>
                <input ref={comment} placeholder="Bekor qilishga sabab yoki izox" className="ant-input ant-input-sm"
                       type="text"/>
            </div>
        </div>
    )
}

function OrderApprove() {
    const [data, get, loader,_,totalCount] = useGetDynamic();
    const [page,setPage] = useState(1);
    const [selectedCommand,setSelectedCommand] = useState(null);
    const reload = useSelector(s => s.reload || null);
    const [btnLoader, setBtnLoader] = useState(false);
    const dispatch = useDispatch();
    const comment = useRef();
    const [type, getType, typeLoader] = useGetDynamic();
    useEffect(() => {
        if (!type.length) {
            getType(GET_COMMANDS_TYPES);
        }
    }, []);
    useEffect(() => {
        get(GET_COMMAND_BY_USER,{
            page: page
        })
    }, [reload,page]);
    const apiApproved = (id, comment = null, type) => {
        setBtnLoader(true);
        const data = comment ? {
            reject_info: comment,
            approved: type
        } : {
            approved: type
        }
        Req({
            type: `${APPROVERS_REJECTED_COMMANDS}${id}/approve/`,
            data: data
        }).then(res => {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'success',
                    message: "Saqlandi!"
                }
            })
            dispatch({
                type: 'reload',
                payload: Math.random()
            })
        }).catch(err => {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Hatolik! Qayta urinib ko'ring!"
                }
            })
        }).finally(() => {
            if (comment) comment.current.value = '';
            setBtnLoader(false);
        })
    }
    const closePopConfirm = () => {

    }
    const onApproved = (id) => {
        apiApproved(id, null, 'approved');
    }
    const confirm = (id) => {
        apiApproved(id, comment.current.value, 'rejected');
    }
    const onView = (command)=>{
        setSelectedCommand(command);
    }
    return (
        <div>
            <h3 className="py-4 m-0">
                <strong>
                    Kelishish uchun xujjatlar
                </strong>
            </h3>
            {
                loader ?
                    <Skeleton active/> :
                    data.length ?
                        <Row gutter={16}>
                            <Col span={5}>
                                <Card>
                                    <Row justify="space-between" className="text-muted border-bottom small mb-3">
                                        <Col>
                                            Buyruqlar
                                        </Col>
                                        <Col>
                                            <strong>{totalCount}</strong> dan
                                            <strong className="px-1">{data.length}</strong>
                                            <button onClick={()=>setPage(page-1)} disabled={page <= 1} className="button-un-styled">
                                                <IconChevronLeft/>
                                            </button>
                                            <strong className="px-1">{page}</strong>
                                            <button onClick={()=>setPage(page+1)} disabled={totalCount <= page * 10} className="button-un-styled">
                                                <IconChevronRight/>
                                            </button>
                                        </Col>
                                    </Row>
                                    {
                                        data.map(item => {
                                            return  (
                                                <div key={`orderList${item.id}`}>
                                                   <div className={`button-effect ${selectedCommand && selectedCommand.id === item.id ? 'active' : ''}`} onClick={()=>onView(item)}>
                                                       <p className="mb-1 text-muted">
                                                           Sana: { new Date(item.command.created_at).toLocaleString()}
                                                       </p>
                                                       <p>
                                                           {
                                                               'texts' in item.command && item.command.texts.length ?
                                                                   item.command.texts[0].cause:''
                                                           }
                                                       </p>
                                                   </div>
                                                </div>
                                            )
                                        })
                                    }
                                </Card>
                            </Col>
                            {
                                selectedCommand ?
                                    <>
                                        <Col span={14}>
                                            <Card style={{position: 'sticky', top: 0}}>
                                                <ViewOrder type={type} order={selectedCommand.command}/>
                                            </Card>
                                        </Col>
                                        <Col span={5}>
                                            <Card style={{position: 'sticky', top: 0}}>
                                                <p className="pb-2 border-bottom small text-muted">
                                                    Kelishuvchilar
                                                </p>
                                                {
                                                    selectedCommand.command?.approvals.map(approval => {
                                                        return (
                                                            <div key={`approvalUser${approval.id}`}>
                                                                <StatusBadge status={approval.approved}>
                                                                    <Row align="middle">
                                                                        <Col span={4}>
                                                                            <UserTableAvatar file={approval.user.image} size="sm"/>
                                                                        </Col>
                                                                        <Col span={20} className="px-3">
                                                                            <p className='m-0 text-capitalize text-no-wrap'>
                                                                                <strong>
                                                                                    {approval.user.full_name.toLowerCase()}
                                                                                </strong>
                                                                            </p>
                                                                            <p className="m-0">
                                                                                {
                                                                                    approval.user.position
                                                                                }
                                                                            </p>
                                                                        </Col>
                                                                    </Row>
                                                                </StatusBadge>
                                                            </div>
                                                        )
                                                    })
                                                }
                                                <div className="border-top pt-2">
                                                    <Row justify="space-between" gutter={10} align="middle">
                                                        {
                                                            selectedCommand.approved === 'rejected' || selectedCommand.approved === 'approved' ?
                                                            <p className="text-muted small m-0">
                                                                Siz bergan izox: {selectedCommand.reject_info || 'Mavjud emas!'}
                                                            </p>:
                                                            <>
                                                               <Col>
                                                                   <Popconfirm
                                                                       placement="topRight"
                                                                       title={
                                                                           <PopTile comment={comment}/>
                                                                       }
                                                                       onConfirm={() => confirm(selectedCommand.id)}
                                                                       okText="Ha"
                                                                       cancelText="Yo'q"
                                                                       onCancel={closePopConfirm}
                                                                   >
                                                                       <Button disabled={btnLoader}
                                                                               size="small"
                                                                               className="outline-danger mr-2"
                                                                       >
                                                                           Rad etish
                                                                       </Button>
                                                                   </Popconfirm>
                                                               </Col>
                                                                <Col>
                                                                    <Button onClick={() => onApproved(selectedCommand.id)} disabled={btnLoader}
                                                                            size="small" className="outline-success">
                                                                        Tasdiqlash
                                                                    </Button>
                                                                </Col>
                                                            </>
                                                        }
                                                        <Col>
                                                            <a target="_blank"
                                                               href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/v1/tabel/command-pdf/${selectedCommand.command.id}`}
                                                               className="ant-btn ant-btn-sm outline-primary mr-2">
                                                               <IconEye/> PDF
                                                            </a>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Card>
                                        </Col>
                                    </> : ''
                            }

                        </Row> :
                        <Card>
                            <NoData message="Ma'lumot mavjud emas!"/>
                        </Card>
            }
        </div>
    )
}
const ViewOrder =({order,type})=>{
    return useMemo(()=>{
        return(
            order ?
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
                                    return (
                                        <Col span={24} className="mt-4">
                                        <div className="text-center mb-2">
                                            <strong> &sect;-{i + 1}</strong>
                                        </div>
                                        <InnerHtml content={item.text}/>
                                        <Small className="my-2" size={12}>
                                            <span className="mr-3">
                                                Asos: <strong
                                                className="text-muted text-capitalize">{item.cause}</strong>
                                            </span>
                                        </Small>
                                    </Col>)
                                })}
                            </Row>
                        </> : <NoData size="sm"/>}
                </Blank>
            : null
        )
    },[order]);
}
export default OrderApprove;