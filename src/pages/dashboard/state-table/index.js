import {Button, Card, Col, Dropdown, Form, Modal, Popconfirm, Row, Select, Spin, Tooltip, TreeSelect} from "antd";
import {useEffect, useMemo, useState} from "react";
import {
    IconCheckMark,
    IconClose,
    IconDotsHorizontal,
    IconFile,
    IconFileText,
    IconSearch
} from "../../../components/Icon";
import {
    COMMAND_CONFIRMED, CONFIRM_TIME_TABLE_BY_HEAD,
    GET_COMMAND_APPROVERS,
    GET_DAY_OFF_MONTH,
    GET_TABLE_USER_LIST, GET_TIME_TABLE_STATUS,
    SEND_TIME_TABLE_IN_APPROVE,
    TABLE_SET_STATUS
} from "../../../store/types";
import AppTable from "../../../components/AppTabel";
import {connect, useDispatch, useSelector} from "react-redux";
import ButtonDefault, {ButtonLink} from "../../../styleComponents/ButtonDefault";
import Req from "../../../store/api";
import moment from "moment";
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router-dom";
import {useGetDynamic} from "../../../hooks/useGet";
import useTree from "../../../hooks/useTree";
import usePost from "../../../hooks/usePost";
import useEimzo from "../../../hooks/useKey";
import NoData from "../../../components/NoData";
import {Option} from "antd/es/mentions";
import Loader from "../../../components/Loader";
const SetStatusButton = ({date,day,staffId})=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onSet = (value)=>{
        dispatch({
            type: 'loader',
            payload: true,
        });
        Req({
            type:TABLE_SET_STATUS,
            data:{
                date: moment(new Date(date).setDate(day)).format('YYYY-MM-DD'),
                choices: [{
                    staff: staffId,
                    status: value
                }]
            }
        }).then(res=>{
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
        }).catch(err=>{
            const {data,status} = err.response;
            if(status < 500){
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: data?.message
                    }
                });
                if(status === 401 || status === '401'){
                    localStorage.removeItem('token');
                    dispatch({
                        type: 'isUser',
                        payload: null
                    });
                    navigate('/login')
                }
            }else{
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Tizim hatoligi qayta urinib ko'ring!"
                    }
                });
            }
        }).finally(()=>{
            dispatch({
                type: 'loader',
                payload: false,
            })
        })
    }
    return (
        <div>
            <ButtonLink onClick={()=>onSet('C')} className='text-primary ant-btn-block text-left'>
                <IconCheckMark/> Keldi
            </ButtonLink>
            <ButtonLink onClick={()=>onSet('CH')} className='text-danger ant-btn-block text-left'>
                <IconClose/> Kelmadi
            </ButtonLink>
        </div>
    )
}
function StateTable({tableUserList}){
    const [days,get,dateLoader] = useGetDynamic();
    const [query,setQuery] = useState();
    const [columns,setColumns] = useState([]);
    const [departmentId,setDepartmentId] = useState(null);
    const tree = useTree();
    useEffect(()=>{
        get(`${GET_DAY_OFF_MONTH}`);
    },[]);
    useEffect(()=>{
        if(!dateLoader){
            const dateNow = new Date(Date.now());
            let ld = new Date( dateNow.getFullYear(), dateNow.getMonth() + 1, 0).getDate();
            const ds = [];
            for (let i = 1; i <= ld;  i++) {
                ds.push(i);
            }
            const dsa = ds.map(v=>{
                const dayOff = days.find(vDay=> vDay.day === v);
                return {
                    title: `${v > 9 ? v : `0${v}`}`,
                    dataIndex:v,
                    render:(_,col)=>{
                        const find = col.choices.find(value=>new Date(value.date).getDate() === v);
                        return (
                            find && find !== undefined ?
                                <div className={`text-center ${dayOff ? 'bg-danger-50' : ''}`}>
                                    {find.status}
                                    {
                                        col.staff.is_region && dateNow.getDate() >= v ?
                                            <div className="text-center">
                                                <Dropdown className="text-muted" overlay={<SetStatusButton date={dateNow} day={v} staffId={col.staff.id}/>}>
                                                    <ButtonDefault>
                                                        <IconDotsHorizontal/>
                                                    </ButtonDefault>
                                                </Dropdown>
                                            </div>:""
                                    }
                                </div>:
                                dateNow.getDate() === v ?
                                    <div className="text-center">
                                        <Dropdown className="text-muted" overlay={<SetStatusButton day={v} date={dateNow} staffId={col.staff.id}/>}>
                                            <ButtonDefault>
                                                <IconDotsHorizontal/>
                                            </ButtonDefault>
                                        </Dropdown>
                                    </div> :
                                    dayOff ?
                                        <Tooltip title={dayOff.comment ? dayOff.comment:'Dam olish kuni!'}>
                                            <div className='bg-danger-50'/>
                                        </Tooltip>:
                                        <div className='bg-light-50'/>
                        )
                    }
                }
            });
            setColumns([
                {
                    title: 'F.I.Sh.',
                    dataIndex: 'userName',
                    width: '22%',
                    fixed: 'left',
                    render: (_,record)=>{
                        return <div className="m-0 text-capitalize">{record.staff && 'full_name' in record.staff ? record.staff.full_name.toLowerCase() :'' }</div>
                    }
                },
                ...dsa,
            ]);
        }
    },[days,dateLoader]);
    const onSearch =(v)=>{
        setQuery({
            search : v
        })
    }
    const table = useMemo(()=>{
        return (
            <AppTable
                scroll={{
                    x: 1500,
                }}
                type={GET_TABLE_USER_LIST} search={query} data={tableUserList} columns={columns}/>
        )
    },[tableUserList,query,columns]);
    const onSelectDepartment =(v)=>{
        setDepartmentId(v);
        setQuery({
            department_id: v
        })
    }
    return(
            <Card>
            <Row align='middle' className="mb-3" gutter={16}>
                <Col span={24} className="mb-3">
                    <strong> Davomat nazorati</strong>
                </Col>
                <Col span={12}>
                    <TreeSelect
                        showSearch
                        fieldNames={{
                            title: 'label',
                            value: 'id',
                            children: 'children'
                        }}
                        style={{ width: '100%' }}
                        placeholder="Bo'lim bo'yicha filter"
                        allowClear
                        treeDefaultExpandAll
                        treeData={tree}
                        onChange={onSelectDepartment}
                    />
                </Col>
                <Col span={12}>
                    <Search
                        allowClear
                        enterButton={<ButtonDefault><IconSearch/></ButtonDefault>}
                        placeholder="Izlash"
                        onSearch={onSearch}
                        style={{
                            width: '100%',
                        }}
                    />
                </Col>
            </Row>
            <div className="calendar-table">
                {
                    table
                }
            </div>
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
                <Col className="ml-auto">
                    <TableButtons/>
                </Col>
            </Row>
        </Card>
        )
}
const TableButtons = ()=>{
    const user = useSelector(s=>s.isUser || null);
    const [modal, setModal] = useState(false);
    const [loader,setLoader] = useState(false)
    const dispatch = useDispatch();
    const [post,loaderPost] = usePost();
    const [timeTableStatus,getTimeTableStatus,timeTableStatusLoader] = useGetDynamic();
    const navigate = useNavigate();
    const [keys, pkcs7_64, getItem, onConfirm] = useEimzo();
    const [activeKey, setActiveKey] = useState(null);
    useEffect(() => {
        if(pkcs7_64){
            post(CONFIRM_TIME_TABLE_BY_HEAD,{
                pkcs7: pkcs7_64
            },()=>{
                closeModal();
            })
        }
    }, [pkcs7_64]);
    useEffect(()=>{
        if(!modal){
            getTimeTableStatus(GET_TIME_TABLE_STATUS);
        }
    },[modal])
    const onPDF = ()=>{
        setLoader(true)
        Req({
            type: `get v1/calendar/get_pdf/`,
            query:{
                days: 30
            }
        })
            .then(res=>{
                window.open(res.data.pdf_file, '_blank');
            })
            .catch(err=>{
            })
            .finally(()=>{
                setLoader(false)
            })
    }
    const onSendByConfirm = ()=>{
        post(SEND_TIME_TABLE_IN_APPROVE,{
            status:'new'
        });
    }
    const openModal = () => {
        setModal(true)
    }
    const closeModal = () => {
        setModal(false);
    }
    const onActiveKey = (v) => {
        const a = keys.filter(k => k.itemId === v);
        setActiveKey(a.length ? a[0] : null);
    }
    const onFinish = () => {
        if (activeKey && Object.keys(activeKey).length) {
            onConfirm(activeKey, 'confirm');
        } else {
            dispatch({
                type: 'toast', payload: {
                    type: 'error', message: 'Iltimos kalitlardan biringi tanlang!'
                }
            })
        }
    }
    return(
        <>
            {
                user && user.current_role === 'HO' ?
                    timeTableStatus && Object.keys(timeTableStatus).length && timeTableStatus.status === 'confirmed' ?
                        <span className="text-success">
                            <IconCheckMark/> Tasdiqlangan
                        </span>:
                        <ButtonLink disabled={loaderPost} onClick={openModal}>
                            <IconFileText/> Tasdiqlash
                        </ButtonLink>
                    :
                    <>
                        {
                            timeTableStatus && Object.keys(timeTableStatus).length ?
                                timeTableStatus.status === 'new' ?
                                    <ButtonLink disabled={true} className="text-muted">
                                        <IconFileText/> Tasdiqlashga yuborilgan
                                    </ButtonLink> :
                                        timeTableStatus.status === 'confirmed' ?
                                        <span className="text-success">
                                            <IconCheckMark/> Tasdiqlangan
                                        </span>:''
                                :
                                <Popconfirm
                                    onConfirm={onSendByConfirm}
                                    cancelText="Yopish"
                                    okText='Tasdiqlash'
                                    title="Tasdiqlashga yuborish">
                                    <ButtonLink disabled={loaderPost || timeTableStatusLoader} >
                                        <IconFileText/> Tasdiqlashga yuborish
                                    </ButtonLink>
                                </Popconfirm>
                        }
                    </>
            }
            <ButtonLink onClick={onPDF} disabled={loader}>
                <IconFile/> PDF yuklab olish
            </ButtonLink>
            {
                loader ?
                    <Loader/>:''
            }
            <Modal title={<strong>Tizimga kirish uchun ERI kalitini tanlang</strong>}
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
                        <Row justify="space-between" gutter={16} className="pt-3">
                            <Col span={12}>
                                <Button onClick={closeModal}>
                                    Bekor qilish
                                </Button>
                            </Col>
                            <Col span={12}>
                                <div className="text-right">
                                    <Button disabled={loaderPost} onClick={onFinish} type={"primary"}
                                            className="ml-3">
                                        <IconCheckMark/> Tasdiqlash
                                    </Button>
                                </div>
                            </Col>
                        </Row>

                    </> : <NoData message={'ERI kalitlari mavjud emas!'}/>}
            </Modal>
        </>
    )
}
const stp = (state)=>{
    return{
        tableUserList: state.tableUserList || [],
    }
}
export default connect(stp)(StateTable);