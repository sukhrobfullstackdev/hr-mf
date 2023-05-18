import {Link, useParams} from "react-router-dom";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useLayoutEffect, useMemo, useState} from "react";
import {GET_BUSINESS_TRIP_PLAN_BY_ID} from "../../../../store/types";
import {Card, Col, Row, Skeleton} from "antd";
import StatusBadge from "../../../../styleComponents/StatusBadge";
import {IconChevronLeft, IconSkipBack} from "../../../../components/Icon";
import NoData from "../../../../components/NoData";

function DashboardBusinessTripPlanView (){
    const {id} = useParams();
    const [data,get,loader] = useGetDynamic();
    useLayoutEffect(()=>{
        if(id){
            get(`${GET_BUSINESS_TRIP_PLAN_BY_ID}/${id}`);
        }
    },[id]);
    return(
        loader ?
            <Skeleton active/>:
            <Row gutter={16}>
            <Col span={18}>
                <Card>
                    <h4>
                        <strong>Xizmat safar ish rejasi</strong>
                    </h4>
                    <div className="mt-1">
                        {data.cause}
                        <p className="m-0 text-muted small">
                            Asos
                        </p>
                    </div>
                    <div className="mt-1">
                        {data.purpose}
                        <p className="m-0 text-muted small">
                            Maqsad
                        </p>
                    </div>
                    <div className="mt-5">
                        <strong className="mb-3 d-block">Ish rejasi</strong>
                        {
                           data.plans.map((plan,i)=>{
                               return(
                                   <Row className="border-bottom border-top" gutter={12}>
                                       <Col>
                                           {i+1}.
                                       </Col>
                                       <Col>
                                           {plan}
                                       </Col>
                                   </Row>
                               )
                           })
                        }
                    </div>
                    <div className="mt-5">
                        <strong className="mb-3 d-block">Biriktirilgan fayillar</strong>
                        {
                            data.cause_files.length ?
                                data.cause_files.map(file=>{
                                return(
                                    <Attachments file={file.file}/>
                                )
                            }):
                                <NoData size="sm"/>
                        }
                    </div>
                    <div className="mt-5">
                        <strong className="mb-3 d-block">Tasdiqlovchi</strong>
                        <Row>
                            <Col span={12}>
                                {data.confirmer.full_name}
                                <p className="text-muted small m-0">
                                    {data.confirmer.position}
                                </p>
                            </Col>
                            <Col span={12}>
                                <StatusBadge status={data.status}/>
                                <p className="text-muted small m-0 pl-2">
                                    Holati
                                </p>
                            </Col>
                        </Row>
                    </div>
                    <div className="text-right mt-5">
                        <Link to='/dashboard/business-trip-plan'>
                            <IconChevronLeft/> Orqaga
                        </Link>
                    </div>
                </Card>
            </Col>
            <Col span={6}>
                <Card className="position-sticky">
                    <h4>
                        <strong>Xizmat safarida ishtrok etuvchi hodimlar</strong>
                    </h4>
                    {
                        data.licences.map((item,i)=>{
                            return (
                                <Row gutter={12} className="border-bottom mt-3" key={`businessTripStaff${item.staff.id}`}>
                                    <Col>
                                        {i+1}.
                                    </Col>
                                    <Col>
                                        {item.staff.full_name}
                                        <p className="m-0 small text-muted">
                                            {item.staff.position}
                                        </p>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                </Card>
            </Col>
        </Row>
    )
}
const Attachments = ({file})=>{
    const [name,setName] = useState();
    const [type,setType] = useState(null);
    useLayoutEffect(()=>{
        const n = file.split('/');
        if(n.length){
            setName(n[n.length - 1]);
            const t = n[n.length - 1].split('.');
            setType(t[t.length-1]);
        }
    },[])
    const img = useMemo(()=>{
        if(type === 'pdf'){
            return (
                <Row gutter={16} className="mb-2" align='middle'>
                    <Col>
                        <img src='/images/pdf.png' width='30' alt=""/>
                    </Col>
                    <Col>
                        <a href={file} target={"_blank"} className="text-no-wrap">
                            {name}
                        </a>
                    </Col>
                </Row>
            )
        }
        if(type === 'png' || type === 'jpg' || type === 'jpeg'){
            return (
                <Row  gutter={16} className="mb-2" align='middle'>
                    <Col>
                        <img src='/images/jpg.png' width='30' alt=""/>
                    </Col>
                    <Col>
                        <a href={file} target={"_blank"} className="text-no-wrap">
                            {name}
                        </a>
                    </Col>
                </Row>
            )
        }
        return (
            <Row gutter={16} className="mb-2" align='middle'>
                <Col>
                    <img src='/images/file.png' width='30' alt=""/>
                </Col>
                <Col>
                    <a href={file} target={"_blank"} className="text-no-wrap">
                        {name}
                    </a>
                </Col>
            </Row>
        )
    },[type,name]);
    return(
        img
    )
}
export default DashboardBusinessTripPlanView;