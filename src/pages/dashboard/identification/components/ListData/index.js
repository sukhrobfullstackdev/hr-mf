import {useEffect, useState} from "react";
import {Card, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {IconPlus} from "../../../../../components/Icon";
import {useSelector} from "react-redux";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {GET_CERTIFICATE} from "../../../../../store/types";
import AppTabel from "../../../../../components/AppTabel";

function ListData(){
    const user = useSelector(s=>s.isUser || {});
    const [data,get,loader] = useGetDynamic();
    const [columns,setColumns] = useState([
        {
            title: "Id",
            width: '5%',
            dataIndex: 'id'
        },
        {
            title: "Guvohnoma raqami",
            dataIndex: 'cert_num',
            render: (_,col)=> `№ ${col.cert_num}`
        },
        {
            title: "Hodim",
            dataIndex: 'user',
            render:(_,col)=>{
                return (
                    <p>
                        {col.user.fullname_uz}
                    </p>
                )
            }
        },
        {
            title: "Berilgan sana",
            dataIndex: 'given_date'
        },
        {
            title: "Amal qilish sana",
            dataIndex: 'dateof_issue',
            render:(_,col)=>{
                let diff = Math.abs(new Date(Date.now()) - new Date(col.dateof_issue));
                diff = diff / 1000 / 3600 / 24
                return(
                    <span className="py-1 px-2 rounded" style={{
                        backgroundColor: `${diff <= 3 && diff >= 1 ? '#f48924' : diff < 1 ? '#E93030' :''}`
                    }}>
                        {col.dateof_issue}
                    </span>
                )
            }
        },
    ]);
    useEffect(()=>{
        get(GET_CERTIFICATE);
    },[]);
    return(
        <div>
            <Row justify='end' className="mb-4">
                <Col span={12} className="text-right">
                    <Link to={'add'} className="ant-btn ant-btn-primary">
                        <IconPlus/>Hodim tanlash
                    </Link>
                </Col>
            </Row>
            <AppTabel data={data?.certificates} columns={columns} loader={loader}/>
        </div>
    )
}
export default ListData;