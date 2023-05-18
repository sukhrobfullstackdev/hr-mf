import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useRef, useState} from "react";
import {APPROVE_GET_DISMISS_SHEET, SET_STATUS_DISMISS_SHEET} from "../../../../../store/types";
import {Button, Card, Col, Row, Skeleton} from "antd";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import NoData from "../../../../../components/NoData";
import {useDispatch, useSelector} from "react-redux";
import Req from "../../../../../store/api";

function DismissSheet(){
    const reload = useSelector(s=>s.reload);
    const [data,get,loader] = useGetDynamic();
    const [btnLoader, setBtnLoader] = useState(false);
    const dispatch = useDispatch();
    const comment = useRef();
    const onRequest=(id,status)=>{
        Req({
            type: SET_STATUS_DISMISS_SHEET,
            data: {
                status: status,
                dismiss_confirmation_staff_id: id
            }
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
    const onApproved = (id) => {
        onRequest(id, 'approved');
    }
    const onRejected = (id) =>{
        onRequest(id, 'rejected');
    }
    useEffect(()=>{
        get(APPROVE_GET_DISMISS_SHEET);
    },[reload]);
    return(
        <div>
            <h3 className="py-4 m-0">
                <strong>
                    Kelishish uchun ishdan bo'shash varaqasi
                </strong>
            </h3>
            {
                loader ?
                    <Skeleton active/> :
                    data.length ?
                        <Row gutter={16}>
                            {
                                data.map(item => {
                                    return (
                                        <Col key={`orderList${item.id}`} span={6}>
                                            <Card className="h-100">
                                                <strong className="text-muted">
                                                    Ishdan bo'shovchi hodim
                                                </strong>
                                                <p className="text-capitalize">
                                                    <strong>
                                                        {
                                                            item?.dismiss_confirmation_sheet?.staff.full_name.toLowerCase()
                                                        }
                                                    </strong>
                                                </p>
                                                {
                                                    item.status === 'rejected' || item.status === 'approved' ?
                                                        <p className="text-muted small m-0">
                                                            Siz tomondan: <StatusBadge status={item.status}/>
                                                        </p> :
                                                        <div className="d-flex justify-content-between">
                                                            <Button onClick={()=>onRejected(item.id)} disabled={btnLoader}
                                                                    size="small"
                                                                    className="outline-danger mr-2"
                                                            >
                                                                Rad etish
                                                            </Button>
                                                            <Button onClick={() => onApproved(item.id)} disabled={btnLoader}
                                                                    size="small" className="outline-success">
                                                                Tasdiqlash
                                                            </Button>
                                                        </div>
                                                }
                                            </Card>
                                        </Col>
                                    )
                                })
                            }
                        </Row> :
                        <Card>
                            <NoData message="Ma'lumot mavjud emas!"/>
                        </Card>
            }
        </div>
    )
}
export default DismissSheet