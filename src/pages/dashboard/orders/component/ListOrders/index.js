import {Card, Col, Popover, Radio, Row, Skeleton, Tabs} from "antd";
import {Link} from "react-router-dom";
import {IconPlus} from "../../../../../components/Icon";
import AppTable from "../../../../../components/AppTabel";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useLayoutEffect, useMemo, useState} from "react";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import {GET_COMMAND_APPROVERS, GET_COMMANDS, GET_COMMANDS_TYPES} from "../../../../../store/types";
import Buttons from "../Buttons";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import {connect, useDispatch, useSelector} from "react-redux";
import TabInfo from "../../../../../components/TabInfo";
import AppTab, {AppTabButton} from "../../../../../components/AppTab";

const {TabPane} = Tabs;
function ListApprovals({list = []}){
        useEffect(()=>{
            if(!approvals.length){
                getApprovals(GET_COMMAND_APPROVERS);
            }
        },[]);
        const [approvals,getApprovals,loaderApprovals] = useGetDynamic();
        return useMemo(()=>{
            return list.map(item=>{
                return  <div className="small">
                            <StatusBadge status={item.approved}>
                                {
                                    approvals.find(v=> v.id === item.user)?.full_name
                                }
                            </StatusBadge>
                        </div>
            });
        },[list, approvals]);
}
function ListOrders({orders,types,user}){
    useEffect(()=>{
        setColumns([
            {
                title: 'T/R',
                dataIndex: 'tr',
                render:(_,record,index)=>{
                    return (
                        <div className="text-center">
                            {index+1}
                        </div>
                    )
                }
            },
            {
                title: 'Hodim',
                dataIndex: 'staff_full_name',
            },
            {
                title: 'Turi',
                dataIndex: 'type',
                render: (_,record)=>{
                    return  <p className="mb-0">
                        {
                            types.find(v=>v.id === record.type)?.title
                        }
                    </p>
                }
            },
            {
                title: "Buyruq uchun asos",
                dataIndex: 'cause',
                render: (_,record)=>{
                    return (
                        <div className="text-ellipses-3">
                            {
                                record.texts.map(item=>{
                                    return(
                                        <p key={`itemCouse${item.id}`}>
                                            {item.cause}
                                        </p>
                                    )
                                })
                            }
                        </div>
                    )
                }
            },
            {
                title: 'Buyruq raqami',
                dataIndex: 'number',
                render: (_,record)=>{
                    return record.number ? <strong>{record.number}</strong> : <span className="text-muted">Mavjud emas!</span>
                }
            },
            {
                title: 'Holati',
                dataIndex: 'status',
                render:(_,record)=>{
                    return record.approvals.length ?
                        <Popover placement="topLeft" title={"Kelishuvchilar"} content={<ListApprovals list={record.approvals}/>} trigger="hover">
                            <ButtonDefault className="p-0">
                                <StatusBadge status={record.status}/>
                            </ButtonDefault>
                        </Popover>
                        :<StatusBadge status={record.status}/>
                }
            },
            {
                title: 'Amallar',
                dataIndex: 'operation',
                width: '5%',
                render: (_, record) => {
                    return <Buttons item={record}/>
                },
            },
        ])
    },[types]);
    const [query,setQuery] =  useState({
        status: user && user.current_role === 'HR' ? 'new' : 'approved'
    })
    const [columns, setColumns] = useState([]);
    return <>
        <Row className="mb-4">
            <Col span={20}>
                <h3>
                    <strong>Buyruqlar</strong>
                </h3>
            </Col>
            {
                user && 'current_role' in user && user.current_role === "HR" ?
                    <Col span={4} className="text-right">
                        <Link className="ant-btn ant-btn-primary" to={`add`}>
                            <IconPlus color="#fff"/> Yangi buyuruq
                        </Link>
                    </Col>:""
            }
        </Row>
        <Card>
            <Row justify='end' align='middle'>
                <Col span={24}>
                    <OrderTab setQuery={setQuery} query={query}/>
                </Col>
                <Col span={24}>
                    <AppTable
                        search={query}
                        type={GET_COMMANDS}
                        columns={columns}
                        data={orders}
                    />
                </Col>
            </Row>
        </Card>
    </>
}

const OrderTab =({setQuery,query})=>{
    const user = useSelector(s=>s.isUser || null);
    const [types, getTypes, loaderType] = useGetDynamic();
    const [type,setType] = useState(null);
    const [activeTab,setActiveTab] = useState({});
    const dispatch = useDispatch();
    useLayoutEffect(()=>{
        getTypes(GET_COMMANDS_TYPES);
    },[]);
    useEffect(()=>{
        if(Object.keys(types).length){
            dispatch({
                type: 'orderTypes',
                payload: types
            })
        }
    },[types]);
    const changeTab = (key)=>{
        setType(key === 'all' ? null : key);
        if(key !== 'all'){
            const newType = types.find(v=>v.id == key);
            if(newType){
                setActiveTab(newType.counts_by_status)
            }
            setQuery({
                ...query,
                type: key
            });
        }
        else{
            setQuery({
                status: query.status
            });
        }
    }
    const onChange=(e)=>{
        setQuery({
            ...query,
            status: e.target.value
        });
    }
    return(
        <>
            {
                loaderType ?
                    <Skeleton active/>:
                    <AppTab>
                        {
                            types.map(item=>  {
                                return(
                                    <AppTabButton isActive={item.id === type} onClick={()=>changeTab(item.id)} key={item.id}>
                                        <TabInfo tabInfo={item}/>
                                    </AppTabButton>
                                )
                            })
                        }
                    </AppTab>
            }
            <Row justify="end">
                <Col span={24} className="mb-3">
                    <Radio.Group
                        onChange={onChange}
                        value={query.status}
                    >
                        {
                            user && user.current_role === 'HR'?
                                <>
                                    <Radio.Button value="new">
                                        <div className="position-relative">
                                            Yangi kelib tushgan
                                            {
                                                activeTab.new && activeTab.new > 0?
                                                    <span className="tab-count">{activeTab.new}</span>:''
                                            }
                                        </div>
                                    </Radio.Button>
                                    <Radio.Button value="checked">
                                        <div className="position-relative">
                                            Qabul qilingan
                                            {
                                                activeTab.checked && activeTab.checked > 0?
                                                    <span className="tab-count">{activeTab.checked}</span>:''
                                            }
                                        </div>
                                    </Radio.Button>
                                </>:''
                        }
                        <Radio.Button value="approved" >
                            Tasdiqlash uchun
                            {
                                activeTab.approved && activeTab.approved > 0?
                                    <span className="tab-count">{activeTab.approved}</span>:''
                            }
                        </Radio.Button>
                        <Radio.Button value="confirmed">
                            <div className="position-relative">
                                Tasdiqlangan
                                {
                                    activeTab.confirmed && activeTab.confirmed > 0 ?
                                        <span className="tab-count">{activeTab.confirmed}</span>:''
                                }
                            </div>
                        </Radio.Button>
                    </Radio.Group>
                </Col>
            </Row>
        </>

    )
}
export default connect((s)=>{
    return {
        loader: s.loader,
        orders: s.orders || [],
        reload: s?.reload,
        user: s.isUser || null,
        types: s.orderTypes || []
    }
})(ListOrders);