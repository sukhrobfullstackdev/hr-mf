import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {GET_APPEAL_APPROVALS, SET_APPEAL_APPROVALS_STATUS} from "../../../../../store/types";
import {Button, Card, Col, Row} from "antd";
import NoData from "../../../../../components/NoData";
import usePost from "../../../../../hooks/usePost";
import {useDispatch, useSelector} from "react-redux";
import StatusBadge from "../../../../../styleComponents/StatusBadge";


function ApplicationItem({item}){
    const [post,loader,res] = usePost();
    const dispatch = useDispatch();
    const user = useSelector(s=>s.isUser || {});
    const [currentUserApplication, setCurrentUserApplication] = useState(null);
    useEffect(()=>{
        setCurrentUserApplication(item.application.approvers.find(u=> u.user.id == user.id));
    },[item])
    const onApproved = ()=>{
        post(
            SET_APPEAL_APPROVALS_STATUS,
            {
                application_id: item.application.id,
                status: 'approved'
            }
        )
    };
    const onRejected = ()=>{
        post(
            SET_APPEAL_APPROVALS_STATUS,
            {
                application_id: item.id,
                status: 'rejected'
            }
        )
    };
    useEffect(()=>{
        dispatch({
            type: 'reload',
            payload: Math.random()
        })
    },[res])
    return(
        <Card>
            <Row justify="end" className="mb-3" gutter={16}>
                <Col span={14} className="small text-muted text-justify">
                    {
                        item.application.top
                    }
                </Col>
            </Row>
            <p className="text-center" style={{fontSize: "18px"}}>
                <strong>
                    {item?.application?.middle}
                </strong>
            </p>
            <p className="text-muted text-justify">
                {
                    item?.application?.text
                }
            </p>
            {
                currentUserApplication?.status === 'approved' ||
                currentUserApplication?.status === 'rejected'
                    ?
                    <p className="m-0 text-right text-muted">
                        Ariza holati: <StatusBadge status={currentUserApplication?.status}/>
                    </p>
                    :<div className="text-right">
                        <Button
                            onClick={onRejected}
                            disabled={loader}
                            size="small"
                            className="outline-danger mr-2"
                        >
                            Rad etish
                        </Button>
                        <Button onClick={onApproved} disabled={loader} size="small" className="outline-success">
                            Tasdiqlash
                        </Button>
                    </div>
            }
        </Card>
    )
}

function Applications(){
    const [data,get,loader] = useGetDynamic();
    const reload = useSelector(s=> s.reload || null)
    useEffect(()=>{
        get(GET_APPEAL_APPROVALS);
    },[reload]);
    return(
        <div>
            <h3 className="py-4 m-0">
                <strong>
                    Kelishish uchun arizalar
                </strong>
            </h3>
            <Row>
                {
                    data.length ?
                        data.map(item=>{
                            return(
                                <Col key={`appealCard${item.id}`} span={6}>
                                    <ApplicationItem item={item}/>
                                </Col>
                            )
                        }):
                        <Col span={24} className="my-4">
                            <NoData size="sm"/>
                        </Col>
                }
            </Row>
        </div>
    )
}
export default Applications;