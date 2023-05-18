import {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Calendar, Drawer, Form, Input, Tooltip, Upload} from "antd";
import {
    IconCheckMark,
    IconCheckmarkCircle,
    IconClose,
    IconCloseCircle,
    IconEdit,
    IconInfo,
    IconUpload
} from "../../../../../../components/Icon";
import {ADD_COMMENT_ON_TIME_TABLE, GET_CALENDAR_BY_STAFF} from "../../../../../../store/types";
import CabinetEventList from "../CabinetEventList";
import moment from "moment";
import {useGetDynamic} from "../../../../../../hooks/useGet";
import Req from "../../../../../../store/api";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

function CalendarUser({status= []}){
    const [drawerLoader,setDrawerLoader] = useState(false);
    const [drawer,setDrawer] = useState(false);
    const [drawerContent,setDrawerContent] = useState({});
    const [data,get,getLoader] = useGetDynamic();
    const [calendarDate,setCalendarDate] = useState(moment());
    const [userDate, setUserDate] = useState([]);
    const [query, setQuery] = useState({
        date: calendarDate.format('YYYY-MM-DD')
    });
    const [offDay, setOffDay] = useState([]);
    const [dateNow, setDateNow] = useState(new Date(Date.now()));
    const [reload,setReload] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [view, setView] = useState(false);
    const dispatch = useDispatch()
    const onPanelChange = useCallback(function (value) {
        setQuery({
            date: value.format('YYYY-MM-DD')
        })
    }, [calendarDate]);
    const navigate = useNavigate();
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
    useEffect(() => {
        get(GET_CALENDAR_BY_STAFF,query);
    }, [query,reload]);
    useEffect(() => {
        if (Object.keys(data).length) {
            setOffDay(data.vacations.map(item => item.day));
            setUserDate(data.choices);
        }
    }, [data]);
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
                                        {/*{*/}
                                        {/*    'comment' in j || 'provable_file' in j ?*/}
                                        {/*        <>*/}
                                        {/*            {*/}
                                        {/*                'comment' in j ?*/}
                                        {/*                    <Tooltip title={*/}
                                        {/*                        j.comment_status === 'rejected' ?*/}
                                        {/*                            <>*/}
                                        {/*                                <span>{j.comment}</span>*/}
                                        {/*                                <div>Siz tomoningizda bu ogoxlantirish qaytarilgan</div>*/}
                                        {/*                            </>*/}
                                        {/*                            : j.comment*/}
                                        {/*                    }>*/}
                                        {/*                        <Button size="small" className="text-info calendar-status hover-icon" onClick={()=>onApproved({*/}
                                        {/*                            ...j,*/}
                                        {/*                            currentDate: currentDate.format('YYYY-MM-DD'),*/}
                                        {/*                            drawerType: 'approve'*/}
                                        {/*                        })}>*/}
                                        {/*                            {*/}
                                        {/*                                j.comment_status === 'approved' ?*/}
                                        {/*                                    <IconCheckMark/> : <IconMessageCircle/>*/}
                                        {/*                            }*/}
                                        {/*                            <IconCheckMark/>*/}
                                        {/*                        </Button>*/}
                                        {/*                    </Tooltip> :""*/}
                                        {/*            }*/}
                                        {/*            {*/}
                                        {/*                'provable_file' in j && j.provable_file ?*/}
                                        {/*                    <Tooltip title="Biriktirilgan fileni ko'rish">*/}
                                        {/*                        <a target="_blank"*/}
                                        {/*                           href={`${process.env.REACT_APP_SERVER_URL}${j.provable_file}`}*/}
                                        {/*                           className="text-info calendar-status ant-btn ant-btn-sm ant-btn-default">*/}
                                        {/*                            <IconFile/>*/}
                                        {/*                        </a>*/}
                                        {/*                    </Tooltip>:''*/}
                                        {/*            }*/}
                                        {/*        </>:''*/}
                                        {/*}*/}
                                    </> :""
                                }
                                {
                                    isComment ?
                                        <Tooltip title="Kechikish yoki kelmaslik bo'yicha ogoxlantirish yozish">
                                            <Button size="small" className="calendar-status text-muted" onClick={()=>onApproved({
                                                ...j,
                                                currentDate: currentDate.format('YYYY-MM-DD'),
                                                drawerType: 'comment'
                                            })}>
                                                <IconEdit/>
                                            </Button>
                                        </Tooltip>
                                        :''
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
    }, [offDay, calendarDate]);
    const modal = useMemo(() => {
        return (
            view && selectedDate ?
                <CabinetEventList isShow={view} onClose={onClose} selectedDay={selectedDate}/> : ""
        )
    }, [view, selectedDate]);
    const drawerBlock = useMemo(()=>{
        const onFinishCommentConfirm = (v)=>{
            setDrawerLoader(true);
            let data = {
                ...v,
                status: v.type === 1 ? 'approved' : 'rejected'
            };
            if(drawerContent.drawerType === 'comment'){
                const formData = new FormData();
                formData.append('provable_file', v.provable_file.file);
                formData.append('comment', v.comment);
                formData.append('date',drawerContent.currentDate);
                data = formData;
            }
            Req({
                type: ADD_COMMENT_ON_TIME_TABLE,
                headers: { "Content-Type": "multipart/form-data" },
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
            <Drawer title={'Izox yozish'} placement="right" onClose={()=>setDrawer(false)} visible={drawer}>
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
                                <CommentFormItem />
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
    },[drawer,drawerLoader,drawerContent])
    return(
          <>
              {calendar}
              {modal}
              {drawerBlock}
          </>
    )
}
const CommentFormItem = ()=>{
    const [fileList,setFileList] = useState([]);
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([file])
            return false;
        },
        fileList,
    };
    return(
        <>
            <Form.Item
                label="O'z izoxingizni yozing"
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
                label="Izox uchun file yuklang"
                name="provable_file"
            >
                <Upload {...props}>
                    <Button icon={<IconUpload />}>File tanlang</Button>
                </Upload>
            </Form.Item>
        </>
    )
}
export default CalendarUser;