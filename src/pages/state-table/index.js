import {useNavigate, useParams, useSearchParams, Outlet, useOutlet, Redirect} from "react-router-dom";
import {useCallback, useEffect, useLayoutEffect, useMemo, useState} from "react";
import {GET_OPEN_TIME_TABLE, GET_TABLE_USER_LIST} from "../../store/types";
import AppTable from "../../components/AppTabel";
import {useDispatch, useSelector} from "react-redux";
import NoData from "../../components/NoData";
import Container from "../../components/Container";
import {useGetDynamic} from "../../hooks/useGet";
import {Col, Row, Table} from "antd";
import page from "../dashboard/components/Page";

function OpenStateTable() {
    const {openTimeTableId = null} = useSelector(s => s);
    const [openTimeTable,get,loader,_, totalCount] = useGetDynamic();
    const [searchParams] = useSearchParams();
    const [id, setId] = useState(searchParams.get('table'));
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        offset: 0,
        tableCount: 0
    });
    const {pageSize,current} = pagination;
    const tableChange = (pagination, filters, sorter)=>{
        setPagination({
            ...pagination,
            tableCount:  pagination.current,
            pageSize: pagination.pageSize,
            current: pagination.current,
        })
    }
    const dispatch = useDispatch();
    useEffect(()=>{
        setPagination({
            ...pagination,
            totalCount: totalCount
        })
    },[totalCount])
    useEffect(() => {
        if (id) {
            dispatch({
                type: 'openTimeTableId',
                payload: id
            })
        }
    }, []);
    useEffect(()=>{
        if(openTimeTableId){
            const type = GET_OPEN_TIME_TABLE.replaceAll(`{id}`, openTimeTableId);
            get(type,{
                page: current,
                page_size: pageSize,
            });
        }
    },[openTimeTableId,current,pageSize]);
    const table = useMemo(() => {
        if(openTimeTableId){
            let columns = []
            if (!loader) {
                const dateNow = new Date(Date.now());
                let ld = new Date(dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getDate();
                const ds = [];
                for (let i = 1; i <= ld; i++) {
                    ds.push(i);
                }
                const dsa = ds.map(v => {
                    return {
                        title: `${v > 9 ? v : `0${v}`}`,
                        dataIndex: v,
                        render: (_, col) => {
                            const find = col.choices.find(value => new Date(value.date).getDate() === v);
                            return (
                                find && find !== undefined ?
                                    <div className={`text-center`}>
                                        {find.status}
                                    </div> :
                                    <div className='bg-light-50'/>
                            )
                        }
                    }
                });
                columns = [
                    {
                        title: 'F.I.Sh.',
                        dataIndex: 'userName',
                        width: '22%',
                        fixed: 'left',
                        render: (_, record) => {
                            return <div
                                className="m-0 text-capitalize">{record.staff && 'full_name' in record.staff ? record.staff.full_name.toLowerCase() : ''}</div>
                        }
                    },
                    ...dsa,
                ]
            }
            return (
                <Table
                    className="app-open-table"
                    size="small"
                    onChange={tableChange}
                    dataSource={openTimeTable}
                    scroll={{
                        x: 1500,
                    }}
                    pagination={{
                        ...pagination,
                        total: totalCount
                    }}
                    columns={columns}/>
            )
        }
        return <NoData/>
    }, [openTimeTable]);
    return (
        <Row className="py-5" justify="center">
            <Col span={20}>
                {table}
                <Row gutter={16} className="mt-4">
                    <Col>
                        <strong className="text-danger">** </strong>
                        <strong>CH </strong> - ishga chiqmagan kunlar
                    </Col>
                    <Col>
                        <strong>C </strong> - ishga chiqgan
                    </Col>
                    <Col>
                        <strong>X </strong> - xizmat safari
                    </Col>
                    <Col>
                        <strong>K </strong> - bemorlik
                    </Col>
                    <Col>
                        <strong>MT </strong> - mexnat tatili
                    </Col>
                    <Col>
                        <strong>U  </strong> - o'quv tatili
                    </Col>
                    <Col>
                        <strong>PT </strong> - pulsiz tatil
                    </Col>
                </Row>
            </Col>
        </Row>
    )
}
export default OpenStateTable;