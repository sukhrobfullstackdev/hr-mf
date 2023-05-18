import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useMemo, useState, useEffect,useCallback} from "react";
import {APPROVED_CALENDAR_BT_HEAD, GET_CALENDAR_BY_STAFF} from "../../../../../../store/types";
import Req from "../../../../../../store/api";
import {Button, Calendar, Drawer, Form, Input, Radio, Tooltip} from "antd";
import * as PropTypes from "prop-types";
import {
    IconCheckMark,
    IconCheckmarkCircle,
    IconClose,
    IconCloseCircle,
    IconEdit, IconFile,
    IconInfo, IconMessageCircle
} from "../../../../../../components/Icon";
import moment from "moment";
import {useGetDynamic} from "../../../../../../hooks/useGet";
import CabinetEventList from "../CabinetEventList";

function Butt(props) {
    return null;
}

Butt.propTypes = {
    onClick: PropTypes.func,
    size: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    children: PropTypes.node
};

function CalendarStaff({staff = null, status = []}){
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState(false);
    const [dateNow, setDateNow] = useState(new Date(Date.now()));
    const [userDate, setUserDate] = useState([]);
    const [data,get,getLoader] = useGetDynamic();
    const [calendarDate,setCalendarDate] = useState(moment());
    const [query, setQuery] = useState({
        date: calendarDate.format('YYYY-MM-DD'),
        user_id: staff
    });
    const [offDay, setOffDay] = useState([]);
    const [drawer,setDrawer] = useState(false);
    const [drawerContent,setDrawerContent] = useState({});
    const [drawerLoader,setDrawerLoader] = useState(false);
    const [reload,setReload] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onPanelChange = useCallback(function (value) {
        setQuery({
            date: value.format('YYYY-MM-DD'),
            user_id: staff
        });
    }, [calendarDate,staff]);
    useEffect(() => {
        get(GET_CALENDAR_BY_STAFF,query);
    }, [query,reload]);
    useEffect(()=>{
        if(staff !== query.user_id){
            setQuery({
                ...query,
                user_id: staff
            });
        }
    },[staff]);
    useEffect(() => {
        if (Object.keys(data).length) {
            setOffDay(data.vacations.map(item => item.day));
            setUserDate(data.choices);
        }
    }, [data]);
    const onApproved = (comment)=>{
        setDrawerContent(comment)
        setDrawer(true);
    }
    const onClose = () => {
        setSelectedDate(null);
        setView(false)
    }
    const onView = (date) => {
        setSelectedDate(date);
        setView(true);
    }
    const modal = useMemo(() => {
        return (
            view && selectedDate ?
                <CabinetEventList userId={staff} isShow={view} onClose={onClose} selectedDay={selectedDate}/> : ""
        )
    }, [view, selectedDate]);
    const drawerBlock = useMemo(()=>{
        const onFinishCommentConfirm = (v)=>{
            setDrawerLoader(true);
            let data = {
                ...v,
                status: v.type === 1 ? 'approved' : 'rejected'
            };
            Req({
                type: `${APPROVED_CALENDAR_BT_HEAD}${drawerContent.id}/approve/`,
                data: data
            })
                .then(res=>{
                    setDrawerContent({});
                    setDrawer(false);
                    setReload(Math.random());
                })
                .catch(err=>{
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
                            navigate('/login');
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
                     setDrawerLoader(false);
                });
        }
        const onCloseDrawer = ()=>{
            setDrawerContent(null);
            setDrawer(false);
        }
        return(
            <Drawer title={'Tasdiqlash yoki bekor qilish'} placement="right" onClose={()=>setDrawer(false)} visible={drawer}>
                {
                    drawerContent && Object.keys(drawerContent).length ?
                        <div>
                            <Form
                                layout="vertical"
                                name="commentConfirmForm"
                                onFinish={onFinishCommentConfirm}
                                initialValues={{
                                    type: 1
                                }}
                            >
                                <ApprovedFormItem drawerContent={drawerContent}/>:
                                <Form.Item className="text-right">
                                    <Button type='danger' size="small" className="mr-2" onClick={onCloseDrawer}>
                                        <IconClose/> Bekor qilish
                                    </Button>
                                    <Button disabled={drawerLoader} type='primary' htmlType="submit" size="small">
                                        <IconCheckMark/> Saqlash
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>:''
                }
            </Drawer>
        )
    },[drawer,drawerLoader,drawerContent]);
    const calendar = useMemo(() => {
        return (
            <>
                <Calendar
                    value={calendarDate}
                    dateCellRender={(currentDate) => {
                        const date = new Date(currentDate).getDate();
                        const mount = new Date(currentDate).getMonth();
                        const j = userDate.find(v => new Date(v.date).getDate() === date && new Date(v.date).getMonth() === mount);
                        const isComment = parseInt(date) >= parseInt(dateNow.getDate())
                            && parseInt(mount) === parseInt(dateNow.getMonth()) && offDay.indexOf(parseInt(date)) <= -1
                        return (
                            <div className="d-flex justify-content-center">
                                {
                                    j ? <>
                                        {
                                            j.status ? j.status === 'C' ?
                                                    <Tooltip title="Kirish chiqish tarixini ko'rish">
                                                        <Button onClick={() => onView(currentDate.format('YYYY-MM-DD'))}
                                                                size="small"
                                                                className={`calendar-status ${j.status.toLowerCase()}`}>
                                                            {status[j.status]?.icon}
                                                        </Button>
                                                    </Tooltip>
                                                    :
                                                    <Button size="small" className={`calendar-status ${j.status.toLowerCase()}`}>
                                                        {status[j.status]?.icon}
                                                    </Button>
                                                : ''
                                        }
                                        {
                                            'comment' in j || 'provable_file' in j ?
                                                <>
                                                    {
                                                        'comment' in j ?
                                                            <Tooltip title={
                                                                j.comment_status === 'rejected' ?
                                                                    <>
                                                                        <span>{j.comment}</span>
                                                                        <div>Siz tomoningizda bu ogoxlantirish qaytarilgan</div>
                                                                    </>
                                                                    : j.comment
                                                            }>
                                                                <Button size="small" className="text-info calendar-status hover-icon" onClick={()=>onApproved({
                                                                    ...j,
                                                                    currentDate: currentDate.format('YYYY-MM-DD'),
                                                                })}>
                                                                    {
                                                                        j.comment_status === 'approved' ?
                                                                            <IconCheckMark/> : <IconMessageCircle/>
                                                                    }
                                                                    <IconCheckMark/>
                                                                </Button>
                                                            </Tooltip> :""
                                                    }
                                                    {
                                                        'provable_file' in j && j.provable_file ?
                                                            <Tooltip title="Biriktirilgan fileni ko'rish">
                                                                <a target="_blank"
                                                                   href={`${process.env.REACT_APP_SERVER_URL}${j.provable_file}`}
                                                                   className="text-info calendar-status ant-btn ant-btn-sm ant-btn-default">
                                                                    <IconFile/>
                                                                </a>
                                                            </Tooltip>:''
                                                    }
                                                </>:''
                                        }
                                    </> :""
                                }
                            </div>
                        )
                    }
                    }
                    onPanelChange={onPanelChange}
                    disabledDate={(currentDate) => {
                        const date = new Date(currentDate).getDate();
                        const month = new Date(currentDate).getMonth();
                        let nowMonth = calendarDate.format();
                        nowMonth = new Date(nowMonth).getMonth();
                        return offDay.indexOf(date) > -1 && month === nowMonth;
                    }
                    }
                />
            </>
        )
    }, [offDay,data,calendarDate]);
    return(
        <>
            {
                calendar
            }
            {
                drawerBlock
            }
            {modal}
        </>
    )
}

const ApprovedFormItem = ({drawerContent})=>{
    return(
        <>
            <p>
                Hodim izohi
            </p>
            <p className="p-3 rounded" style={{backgroundColor: '#f1f1f1'}}>
                {drawerContent.comment}
            </p>
            <Form.Item
                label="Alohida izox yozish"
                name="comment"
                rules={[
                    {
                        required: true,
                        message: "Izox yozish majburiy"
                    }
                ]}
            >
                <Input placeholder="Izox kiriting"/>
            </Form.Item>
            <Form.Item
                label="Sizning munosabatingiz"
                name="type"
                rules={[
                    {
                        required: true,
                        message: "Izox yozish majburiy"
                    }
                ]}
            >
                <Radio.Group>
                    <Radio value={1}>
                        Qarshilik bildirish
                    </Radio>
                    <Radio value={2}>
                        Rozilik bildirish
                    </Radio>
                </Radio.Group>
            </Form.Item>
        </>
    )
}
export default CalendarStaff