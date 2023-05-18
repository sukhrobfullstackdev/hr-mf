import {useGetDynamic} from "../../../../hooks/useGet";
import {Col, Row, Select} from "antd";
import {useEffect, useState} from "react";
import {GET_STAFF_BY_DEPARTMENT,} from "../../../../store/types";
import moment from "moment";
import {connect} from "react-redux";
import CalendarUser from "./component/CalendarUser";
import CalendarStaff from "./component/CalendarStaff";
import {IconCheckmarkCircle, IconCloseCircle, IconInfo} from "../../../../components/Icon";

const {Option} = Select;

function UserTable({user}) {
    const [status, setStatus] = useState({
        C: {
            title: 'Ishga chiqgan',
            icon: <IconCheckmarkCircle/>
        },
        K: {
            title: 'Bemorlik',
            icon: <IconInfo/>
        },
        CH: {
            title: "Ishga chiqmagan",
            icon: <IconCloseCircle/>
        },
        X: {
            title: "Xizmat safari",
            icon: <IconInfo/>
        },
        MT: {
            title: "Mexnat ta'tili",
            icon: <IconInfo/>
        },
        U: {
            title: "O'quv tatili",
            icon: <IconInfo/>
        },
        PT: {
            title: "Xaq to'lanmaydigan ta'til",
            icon: <IconInfo/>
        }
    });
    const [selectedStaff,setSelectedStaff] = useState(null);
    const [staffs, getStaffs, staffsLoader] = useGetDynamic();
    useEffect(()=>{
        if(user && user.is_head){
            getStaffs(GET_STAFF_BY_DEPARTMENT);
        }
    },[user]);
    const onChangeSelector = (v)=>{
        setSelectedStaff(v);
    }
    return (
        <div className="user-calendar">
            {
                staffs.length ?
                    <Row gutter={16} align='middle'>
                        <Col span={12}>
                            <strong>
                                Bo'lim hodimlari bo'yicha saralash va boshqarish
                            </strong>
                            <p className="m-0 small text-muted">
                                Hodimlarni tanlang, ularni davomatini ko'ring.
                            </p>
                        </Col>
                        <Col span={12}>
                            <Select
                                style={{width: '100%'}}
                                allowClear
                                hasFeedback
                                showSearch
                                loading={staffsLoader}
                                onChange={onChangeSelector}
                                filterOption={
                                    (input, option) => {
                                        return option.children.toLowerCase().indexOf(input.toLowerCase()) > 0
                                    }
                                }
                                filterSort={(optionA, optionB) =>
                                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                                }
                                placeholder="Tanlang!"
                            >
                                {
                                    staffs.map( item => {
                                        return <Option key={`staffInDepartment${item.user_id}`}
                                                       value={item.user_id}>{item.full_name}</Option>
                                    })
                                }
                            </Select>
                        </Col>
                    </Row>:""
            }
            {
                selectedStaff ?
                    <CalendarStaff status={status} staff={selectedStaff}/> : <CalendarUser status={status}/>
            }
        </div>
    )
}
const stp = (state) => {
    return {
        user: state.isUser || null,
        calendarDate: state.calendarDate || moment(),
        data: state.calendarData || [],
        getLoader: state.loader || false
    }
}
export default connect(stp)(UserTable);