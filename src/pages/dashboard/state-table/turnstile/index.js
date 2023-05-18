import {Card, Col, Collapse, DatePicker, Modal, Row, Skeleton} from "antd";
import {useEffect, useMemo, useState} from "react";
import {GET_TIME_TABLE_EVENT, GET_TIME_TABLE_EVENT_BY_USER} from "../../../../store/types";
import {connect, useDispatch, useSelector} from "react-redux";
import {useGetDynamic} from "../../../../hooks/useGet";
import NoData from "../../../../components/NoData";
import Small from "../../../../styleComponents/Small";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {IconList} from "../../../../components/Icon";
import AppTabel from "../../../../components/AppTabel";
import moment from "moment";
import UserTableAvatar from "../../../../components/UserTableAvatar";

const {RangePicker} = DatePicker;
const {Panel} = Collapse;
function Turnstile({timeTableEvent}) {
    const [data,get,loader] = useGetDynamic();
    const [query, setQuery] = useState({});
    useEffect(()=>{
        if(!data.length){
            get(GET_TIME_TABLE_EVENT)
        }
    },[])
    const onFinish = (v) => {
        for (const vKey in v) {
            if(v[vKey] === undefined || v[vKey] === 'undefined' || v[vKey] === null){
                delete v[vKey]
            }
            if(v.time && v.time.length){
                v.time_before = v.time[1] ? v.time[1].format('YYYY-MM-DDTHH:mm:ss') : null;
                v.time_after = v.time[0] ? v.time[0].format('YYYY-MM-DDTHH:mm:ss') : null;
                delete v.time;
            }
        }
        setQuery(v);
    }
    return (
        <Card>
            <h3 className="m-0 pb-3 border-bottom">
                <strong>Turniket</strong>
            </h3>
            {/*<Form*/}
            {/*    className="mt-3"*/}
            {/*    name="turnstileForm"*/}
            {/*    onFinish={onFinish}*/}
            {/*    layout="vertical"*/}
            {/*>*/}
            {/*    <p>*/}
            {/*        <strong>Qidiruv va saralash</strong>*/}
            {/*    </p>*/}
            {/*    <Row gutter={16}>*/}
            {/*        <Col span={7}>*/}
            {/*            <Form.Item*/}
            {/*                name="search"*/}
            {/*            >*/}
            {/*                <Input placeholder="Hodim F.I.Sh. bo'yicha"/>*/}
            {/*            </Form.Item>*/}
            {/*        </Col>*/}
            {/*        <Col span={7}>*/}
            {/*            <Form.Item*/}
            {/*                name="temperature"*/}
            {/*                rules={[*/}
            {/*                    {*/}
            {/*                        type: "number",*/}
            {/*                        message: 'Faqat son kiriting'*/}
            {/*                    }*/}
            {/*                ]}*/}
            {/*            >*/}
            {/*                <InputNumber placeholder="Tana harorati bo'yicha"/>*/}
            {/*            </Form.Item*/}
            {/*            >*/}
            {/*        </Col>*/}
            {/*        <Col span={7}>*/}
            {/*            <Form.Item*/}
            {/*                name="time"*/}
            {/*            >*/}
            {/*                <RangePicker*/}
            {/*                    placeholder={["kirish vaqti", "chiqish vaqti"]}*/}
            {/*                    separator="dan"*/}
            {/*                    showTime format="YYYY-MM-DD HH:mm:ss"/>*/}
            {/*            </Form.Item*/}
            {/*            >*/}
            {/*        </Col>*/}
            {/*        <Col span={3}>*/}
            {/*            <Form.Item>*/}
            {/*                <Button htmlType="submit" block type="primary">*/}
            {/*                    <IconSearch/> Saralash*/}
            {/*                </Button>*/}
            {/*            </Form.Item>*/}
            {/*        </Col>*/}
            {/*    </Row>*/}
            {/*</Form>*/}
            <div className="mt-3">
                {
                    loader ?
                        <Skeleton active/>:
                        <Collapse accordion>
                            {
                                data.map(item=>{
                                    return(
                                        <Panel key={`turnstileEvent${item.id}`} header={<Header item={item}/>}>
                                            {
                                               item.staffs && item.staffs.length ?
                                                   <UserPane users={item.staffs}/>:
                                                   <NoData size="sm" message="Hodimlar bo'yicha ma'lumot mavjud emas!"/>
                                            }
                                        </Panel>
                                    )
                                })
                            }
                        </Collapse>
                }
            </div>
        </Card>
    )
}
const Header = ({item})=>{
    return(
        <Row gutter={16} justify='space-between'>
            <Col>
                {item.label}
            </Col>
            <Col>
                Jami hodimlar : {item.staffs.length}
            </Col>
        </Row>
    )
}
const UserPane = ({users = []})=>{
    const [eye,setEye] = useState(false);
    const [activeUser,setActiveUser] = useState(null);
    const onOpen = (user)=>{
        setActiveUser(user)
        setEye(true)
    }
    const onClose = ()=>{
        setActiveUser(null)
        setEye(false)
    }
    return(
        <>
            {
                users.map(user=>{
                    return(
                        <Card className="mb-2" size="small">
                            <Row align="middle" gutter={16} key={`turnstileUser${user.id}`}>
                                <Col span={2} className="text-center">
                                    <div className="d-flex" style={{justifyContent: 'center'}}>
                                        <UserTableAvatar name={user.full_name} file={user.profile_img}/>
                                    </div>
                                </Col>
                                <Col span={5}>
                                    <span className="text-capitalize">{user.full_name.toLowerCase()}</span>
                                    <Small className="text-muted">
                                        F.I.Sh.
                                    </Small>
                                </Col>
                                <Col span={5}>
                                    <span>{user.position}</span>
                                    <Small className="text-muted">
                                        Lavozimi
                                    </Small>
                                </Col>
                                <Col span={5}>
                                    <span className={user.begin_time ? '' : 'text-danger'}>{user.begin_time || "Nazoratdan o'tmagan"}</span>
                                    <Small className="text-muted">
                                        Birinchi kirish vaqti
                                    </Small>
                                </Col>
                                <Col span={5}>
                                    <span className={user.end_time ? '' : 'text-danger'}>{user.end_time || "Nazoratdan o'tmagan"}</span>
                                    <Small className="text-muted">
                                        Oxirgi chiqish vaqti
                                    </Small>
                                </Col>
                                <Col span={2}>
                                    <ButtonDefault onClick={()=>onOpen(user)} className="ant-btn-link">
                                        <IconList/> Barchasi
                                    </ButtonDefault>
                                </Col>
                            </Row>
                        </Card>
                    )
                })
            }
            {
                eye && activeUser?
                    <VueEventList user={activeUser} eye={eye} onClose={onClose}/>:
                    ''
            }
        </>
    )
}
const VueEventList =({user, eye, onClose})=>{
    const [columns, setColumns] = useState([
        {
            title: 'Hodisa turi',
            dataIndex: 'device',
            render:(_,col)=>{
                return(
                    <div>
                        {
                            col.device.attendance_type === "in" ?
                            <span className="text-success">Kirish</span> :
                            <span className="text-danger">Chiqish</span>
                        }
                    </div>
                )
            }
        },{
            title:"Hona raqami",
            dataIndex: 'room',
            render:(_,col)=>{
                return(
                    col.device.room
                )
            }
        },{
            title:"Vaqt",
            dataIndex: 'time',
            render:(_,col)=>{
                return(
                    moment(col.time).format('DD-MM-YYYY / HH-mm-ss')
                )
            }
        }
    ])
    const [query,setQuery] = useState({
        username: user.pinfl
    })
    const tourniquetEvent = useSelector(s=>s.timeTableEvent || []);
    const table = useMemo(()=>{
        return(
            <AppTabel search={query} data={tourniquetEvent} columns={columns} type={GET_TIME_TABLE_EVENT_BY_USER}/>
        )
    },[eye,user,tourniquetEvent,query]);
    return (
        <Modal width={'50%'} title={
            <Row align="middle" gutter={16}>
                <Col>
                    <UserTableAvatar name={user.full_name} file={user.profile_img}/>
                </Col>
                <Col>
                    <span className="text-capitalize">{user.full_name.toLowerCase()}</span>
                    <p className="small text-muted m-0">
                        Lavozim: {user.position}
                    </p>
                </Col>
            </Row>
        } visible={eye} onCancel={onClose} footer={null}>
            {table}
        </Modal>
    )
}
const stp = (state) => {
    return {
        loader: state.loader,
        timeTableEvent: state.timeTableEvent || []
    }
}
export default connect(stp)(Turnstile);