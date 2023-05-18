import {Button, Card, Checkbox, Col, Input, Modal, Row} from "antd";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useLayoutEffect, useState} from "react";
import {ADD_TIME_TABLE, GET_STAFF, GET_TIME_TABLE} from "../../../../store/types";
import AppTable from "../../../../components/AppTabel";
import Loader from "../../../../components/Loader";
import {IconSave} from "../../../../components/Icon";
import NoData from "../../../../components/NoData";
import usePost from "../../../../hooks/usePost";


function TimeTableModal({data, onSave}){
    const [users,setUsers] = useState([]);
    const [staffs,setStaffs] = useState(data);
    const setUser = (id)=>{
        const userS = new Set(users);
        if(userS.has(id)){
            userS.delete(id)
        }else{
            userS.add(id);
        }
        setUsers(Array.from(userS));
    }
    const search = (value)=>{
        const v = value.target.value;
        const d = data.filter(k=> k.full_name.toLowerCase().indexOf(v.toLowerCase()) > -1);
        setStaffs(d)
    }
    return  <div className="time-table-modal pr-3 overflow-y-auto overflow-x-hidden" style={{maxHeight: '80vh'}}>
                <div className="mb-3">
                    <Input type="text" size="small" placeholder="Qidiruv" onKeyUp={search}/>
                </div>
                {
                    staffs.length ?
                        staffs.map(item=>{
                            return  <Row gutter={16} className="border-bottom">
                                        <Col key={`timeTableModal${item.id}`} span={16}>
                                                <span className="text-capitalize">
                                                    {item.full_name.toLowerCase()}
                                                </span>
                                        </Col>
                                        <Col span={8} className="text-right">
                                            <Checkbox onChange={()=>setUser(item.id)}/>
                                        </Col>
                                    </Row>
                        })
                    : <NoData size='sm' message="Ma'lumot mavjud emas!"/>
                }
                <div className="text-right time-table-modal-block">
                    <button type='button' className="time-table-modal-block-button" onClick={()=>onSave(users)}>
                        <IconSave/> Saqlash
                    </button>
                </div>
            </div>
}
function TimeTableListModal({data}){
    const [staffs,setStaffs] = useState(data);
    const search = (value)=>{
        const v = value.target.value;
        const d = data.filter(k=> k.full_name.toLowerCase().indexOf(v.toLowerCase()) > -1);
        setStaffs(d)
    }
    return  <div className="time-table-modal pr-3 overflow-y-auto overflow-x-hidden" style={{maxHeight: '80vh'}}>
                <div className="mb-3">
                    <Input type="text" size="small" placeholder="Qidiruv" onKeyUp={search}/>
                </div>
                {
                    staffs.length ?
                        staffs.map(item=>{
                            return  <Row gutter={16} className="border-bottom">
                                        <Col key={`timeTableModal${item.id}`} span={24}>
                                                <span className="text-capitalize">
                                                    {item.full_name.toLowerCase()}
                                                </span>
                                        </Col>

                                    </Row>
                        })
                    : <NoData size='sm' message="Ma'lumot mavjud emas!"/>
                }
            </div>
}
function TimeTableButton({item}){
    const [staffs,get,loader] = useGetDynamic();
    const [post,addLoader] = usePost();
    const [usersByHours,getUsersByType,loaderType] = useGetDynamic();
    const [modal,setModal] = useState(false);
    const [getUserModal,setGetModal] = useState(false);
    const setEmployee = ()=>{
        get(GET_STAFF);
        setModal(true)
    }
    const getEmployee =()=>{
        getUsersByType(GET_STAFF,{
            working_type: item.id
        });
        setGetModal(true);
    }
    const onSave = (users)=>{
        const middle = users.map(userId => {
            return {
                type: item.id,
                staff: userId
            }
        });
        post(ADD_TIME_TABLE,{
            "choices": middle
        },()=>setModal(false));
    }
    return  <>
                <div className="text-right">
                    <Button type="primary" size='small' className="mr-2" onClick={getEmployee}>
                        Ko'rish
                    </Button>
                    <Button type='primary' size="small" onClick={setEmployee}>
                        Hodim qo'shish
                    </Button>
                </div>
                <Modal footer={null} onCancel={()=>setModal(false)} visible={modal} title={`${item.name} bo'yicha hodim qo'shish`}>
                    {
                        loader || addLoader ?
                            <Loader full={false}/>:
                            <TimeTableModal onSave={onSave} data={staffs}/>
                    }
                </Modal>
                <Modal footer={null} onCancel={()=>setGetModal(false)} visible={getUserModal} title={`${item.name} bo'yicha hodilmar`}>
                    {
                        loaderType ?
                            <Loader full={false}/>:
                            <TimeTableListModal data={usersByHours}/>
                    }
                </Modal>
            </>
}
function TimeTable(){
    const [data,get,loader] = useGetDynamic();
    useLayoutEffect(()=>{
        get(GET_TIME_TABLE);
    },[]);
    const [columns, setColumns] = useState([
        {
            title: 'id',
            width: '4%',
            dataIndex: 'id',
            render: (_,record)=>{
                return <p className="m-0 text-center">{record.id}</p>
            }
        },{
            title: "Vaqt bo'yicha turi",
            dataIndex: 'name',
            render: (_,record)=>{
                return <strong>{record.name}</strong>
            }
        },{
            title: 'Amallar',
            dataIndex: 'status',
            render:(_,record)=>{
                return(
                    <div className="text-center">
                        <TimeTableButton item={record}/>
                    </div>
                )
            }
        }
    ]);
    return  <Card>
                <h3 className="m-0 pb-3 border-bottom">
                    <strong>Vaqtlar jadvali</strong>
                </h3>
                <AppTable columns={columns} data={data} loader={loader}/>
            </Card>
}
export default TimeTable;