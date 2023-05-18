import {Button, Calendar, Card, Input, Popconfirm, Skeleton, Tooltip} from "antd";
import {IconCheckmarkCircle, IconCloseCircle} from "../../../../components/Icon";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useMemo, useRef, useState} from "react";
import {GET_DAY_OFF_MONTH, SET_DAY_OFF} from "../../../../store/types";
import moment from "moment";
import Style from "styled-components";
import usePost from "../../../../hooks/usePost";
import axios from "axios";
import {useDispatch} from "react-redux";

const DayOffIndex = Style.div`
    width:100%;
    height: 100%;
    background-color: rgba(255,0,0,.05)!important;
`

function DashboardDayOff(){
    const [days,get,loader] = useGetDynamic();
    const [post, postLoader] = usePost();
    const [selectedDate,setDate] = useState(moment());
    const [reload, setReload] = useState(Math.random());
    const dispatch = useDispatch()
    const inputCommit = useRef();
    useEffect(()=>{
        get(`${GET_DAY_OFF_MONTH}?date=${selectedDate.format('YYYY-MM-DD')}`);
    },[selectedDate,reload]);
    const onCommitDate = (date,type = 'off') =>{
        const value = inputCommit && inputCommit.current ? inputCommit.current.input.value : null;
        if(value && value === '' && type === 'off'){
            dispatch({
                type: 'toast',
                payload: {
                    type:'error',
                    message: `Iltimos izox qatorini to'ldiring!`
                }
            })
        }else{
            post(SET_DAY_OFF,[
                {
                    comment: value ? value : 'day-off',
                    date: date.format('YYYY-MM-DD')
                }
            ],()=>{
                setReload(Math.random());
            })
        }

    }
    const confirmContent =()=>{
        return (
            <>
                <p className="mb-2">
                    Bu kun ish kuni deb belginadimi?
                </p>
                <Input ref={inputCommit} size="small" placeholder="Sababini izoh sifatida yozing!"/>
            </>
        )
    }
    const deyOff = (date)=>{
        const vDay = parseInt(date.format('D'));
        const vMonth = parseInt(date.format('M'));
        const cMonth = parseInt(selectedDate.format('M'));
        const find = days.find(v=> v.day === vDay);
        return (find && cMonth === vMonth) || false;
    }
    const dateCellRender = (value)=>{
        const mIndex = parseInt(selectedDate.format('M'));
        const vMIndex = parseInt(value.format('M'));
        const vDate = parseInt(value.format('D'));
        const cDate = parseInt(selectedDate.format('D'));
        const find = days.find(v=> v.day === vDate);
        return (
            mIndex === vMIndex && cDate < vDate ?
                <div className="pt-3 text-right h-100">
                    {
                        find ?
                            <>
                                <Tooltip title="Ish kuniga o'zgartirish">
                                    <Button onClick={()=>onCommitDate(value,'on')} size="small" className="text-danger mr-3" style={{fontSize: '18px'}}>
                                        <IconCloseCircle/>
                                    </Button>
                                </Tooltip>
                                {
                                    find.comment ?
                                        <p className="text-left m-0 py-1 text-muted small">
                                            Izox: {find.comment}
                                        </p>:
                                        ""
                                }
                            </>
                            :
                            <Tooltip title="Dam olish kuniga o'zgartirish">
                                <Popconfirm
                                    okButtonProps={{
                                        disabled: inputCommit?.current?.input?.value === ''
                                    }}
                                    title={confirmContent}
                                    onConfirm={()=>onCommitDate(value)}
                                    onCancel={null}
                                    okText="Ok"
                                    cancelText={null}
                                    showCancel={false}
                                >
                                    <Button size="small" className="text-success" style={{fontSize: '18px'}}>
                                        <IconCheckmarkCircle/>
                                    </Button>
                                </Popconfirm>
                            </Tooltip>

                    }
                </div>: null
        )
    }
    const onPanelChange=(date)=>{
        setDate(date);
    }
    const calendar = useMemo(()=>{
        return(
            <Calendar
                value={selectedDate}
                onPanelChange={onPanelChange}
                disabledDate={deyOff}
                dateCellRender={dateCellRender} />
        )
    },[selectedDate,days]);
    return(
        <div className="custom-calendar">
            <h3>
                <strong>
                    Dam olish kunlarini nazorat qilish
                </strong>
            </h3>
            <Card>
                {
                    loader || postLoader ?
                        <>
                            <div className="mb-3"><Skeleton active/></div>
                            <div className="mb-3"><Skeleton active/></div>
                            <div className="mb-3"><Skeleton active/></div>
                        </> :
                        calendar
                }
            </Card>
        </div>
    )
}
export default DashboardDayOff;