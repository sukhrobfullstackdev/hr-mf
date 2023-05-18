import {useEffect, useState} from "react";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {
    GET_DEPARTMENT,
    GET_POSITIONS_BY_DEPARTMENT,
    GET_STAFF_WORKING_TYPE,
    GET_SURVEYS,
    SURVEY_SET_STATUS
} from "../../../../../store/types";
import AppTable from "../../../../../components/AppTabel";
import UserTableAvatar from "../../../../../components/UserTableAvatar";
import {IconCheckMark, IconClose, IconDotsHorizontal, IconEye, IconSave} from "../../../../../components/Icon";
import {Link} from "react-router-dom";
import {Button, Col, Dropdown, Form, Modal, Select, TreeSelect} from "antd";
import ButtonDefault, {ButtonLink} from "../../../../../styleComponents/ButtonDefault";
import useTree from "../../../../../hooks/useTree";
import usePost from "../../../../../hooks/usePost";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import {connect, useDispatch} from "react-redux";

function ListData({reload,data}){
    const tree = useTree();
    const [activeTab,setActiveTab] = useState({
        null_user: 1
    })
    const [columns,setColumns] = useState([
        {
            title: 'id',
            dataIndex:'id',
            width: '5%',
            render:(_,col)=>{
                return (
                    <div className="text-center">
                        {col.id}
                    </div>
                )
            }
        },{
            title: 'id',
            dataIndex:'generated_key',
            render:(_,col)=>{
                return (
                    <div className="text-center">
                        {col.generated_key}
                    </div>
                )
            }
        },{
            title: 'Rasm',
            dataIndex:'image',
            width: '5%',
            render:(_,col)=>{
                return <UserTableAvatar name={col.full_name} file={col.image}/>
            }
        },{
            title: 'Hodim',
            dataIndex:'full_name'
        },{
            title: 'Yashash regioni',
            dataIndex:'live_region',
            render:(_,col)=>{
                return col?.live_region?.name_uz_lat
            }
        },{
            title: 'Tel. raqam',
            dataIndex:'mob_phone_no'
        },{
            title: "Tug'ilgan sana",
            dataIndex:'birth_date',
            render:(_,col)=>{
                return new Date(col.birth_date).toLocaleDateString()
            }
        },{
            title: "Yuborilgan sana",
            dataIndex:'created_date',
            render:(_,col)=>{
                return new Date(col.created_date).toLocaleDateString()
            }
        },{
            title: "Holati",
            dataIndex:'status',
            render:(_,col)=>{
                return <StatusBadge status={col.status}/>
            }
        },{
            title: "Amallar",
            dataIndex:'actions',
            render:(_,col)=>{
                return (
                    <div className="text-center">
                        <Dropdown overlay={<ActionButton tree={tree} item={col}/>} placement="bottomRight">
                            <ButtonDefault className="text-muted">
                                <IconDotsHorizontal/>
                            </ButtonDefault>
                        </Dropdown>
                    </div>
                )
            }
        }
    ]);
    return(
        <div>
            <h3 className="mb-3">
                <strong>So'rovnomalar</strong>
            </h3>
            <ul className="list-tab mb-0">
                <li className={`list-tab-item ${activeTab.null_user === 1 && 'active'}`} onClick={()=>setActiveTab({null_user: 1})}>
                    Barchasi
                </li>
                <li className={`list-tab-item ${activeTab.null_user === 2 && 'active'}`} onClick={()=>setActiveTab({null_user: 2})}>
                    Kelib tushganlar
                </li>
                <li className={`list-tab-item ${activeTab.null_user === 3 && 'active'}`} onClick={()=>setActiveTab({null_user: 3})}>
                    Hodimlar bo'yicha
                </li>
            </ul>
            <AppTable search={activeTab} type={GET_SURVEYS} data={data} columns={columns}/>
        </div>
    )
}
const {Option} = Select;
function ActionButton({item}){
    const dispatch = useDispatch();
    const [chooseStaffType,setChooseStaffType] = useState(null);
    const [staffType,getStaffType,loaderStaffType] = useGetDynamic();
    const [modal,setModal] = useState(false);
    const [post,loader,res] = usePost();
    const [position,getPosition,positionLoader] = useGetDynamic();
    const [department,getDepartment,departmentLoader] = useGetDynamic();
    useEffect(()=>{
        if(!staffType.length){
            getStaffType(GET_STAFF_WORKING_TYPE);
        }
    },[])
    const onFinish = (v = {})=>{
        post(`${SURVEY_SET_STATUS}${item.id}/set-status/`,{
            ...v,
            status: 'confirmed'
        },()=>{
            onCancel();
            dispatch({
                type: "reload",
                payload: Math.random()
            })
        });
    }
    const onChooseDepartment = (value)=>{
        if(value && value !=''){
            getPosition(`${GET_POSITIONS_BY_DEPARTMENT}`,{
                id: value,
                staff_working_type_id: chooseStaffType
            })
        }
    }
    const onShowModal = ()=>{
        if(item.user){
            onFinish()
        }else{
            getDepartment(GET_DEPARTMENT);
            setModal(true);
        }
    }
    const onCancel = ()=>{
        setModal(false);
    }
    const onRejected = ()=>{
        post(`${SURVEY_SET_STATUS}${item.id}/set-status/`,{
            status: 'rejected'
        },()=>{
            dispatch({
                type: "reload",
                payload: Math.random()
            })
        })
    }
    const onChooseStaffType = (v)=>{
        setChooseStaffType(v);
    }
    return(
        <>
            <div>
                <Link className="ant-btn-link ant-btn-block" title="Ko'rish" to={`${item.id}`}>
                    <IconEye/> Ko'rish
                </Link>
            </div>
            {
                item.status === "new"?
                <>
                    <div>
                        <ButtonLink disabled={loader} onClick={onRejected} title="Bekor qilish" className="ant-btn-link ant-btn-block ant-btn-link-danger">
                            <IconClose/> Bekor qilish
                        </ButtonLink>
                    </div>
                    <div>
                        <ButtonLink disabled={loader} onClick={onShowModal} title="Tasdiqlash" className="ant-btn-link ant-btn-block">
                            <IconCheckMark/> Tasdiqlash
                        </ButtonLink>
                    </div>
                </>: ""
            }
            <Modal
                width="50%"
                onCancel={onCancel}
                visible={modal}
                footer={null}
                title="Bo'lim va lavozim tanlang">
                <Form
                    layout="vertical"
                    name="survey-position"
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="Lavozim turini tanlang"
                        name={'staff_working_type'}  rules={[
                        {required: true, message: 'Iltimos tanlang!'}]}
                    >
                        <Select
                            allowClear
                            placeholder="Tanlang!"
                            onChange={onChooseStaffType}
                        >
                            {
                                staffType.map(item=>{
                                    return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang!'
                            }
                        ]}
                        name="department"
                        label="Bo'lim tanlang"
                    >
                        <TreeSelect
                            disabled={!staffType.length}
                            showSearch
                            filterTreeNode={(search, item) => {
                                return item.label.toLowerCase().indexOf(search.toLowerCase()) > -1;
                            }}
                            fieldNames={{
                                title: 'label',
                                value: 'id',
                                children: 'children'
                            }}
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            allowClear
                            treeDefaultExpandAll
                            treeData={department}
                            onChange={onChooseDepartment}
                        />
                    </Form.Item>
                    <Form.Item
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang!'
                            }
                        ]}
                        label="Lavozim tanlang"
                        name="position"
                    >
                        <Select
                            loading={positionLoader}
                            allowClear
                            disabled={!('positions' in position && position.positions.length)}
                            hasFeedback
                            showSearch
                            filterOption={
                                (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) > -1
                            }
                            placeholder="Tanlang!"
                        >
                            {
                                'positions' in position && position.positions.length ? position.positions.map((item)=>{
                                    return (<Option key={`position${item.id}`} value={item.id}>{item.position_name_uz}</Option>)
                                }) : ""
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item className="text-right">
                        <Button type="danger" size='small' onClick={onCancel} className="mr-2">
                            <IconClose/> Bekor qilish
                        </Button>
                        <Button type="primary" size='small' htmlType="submit">
                            <IconCheckMark/> Tasdiqlash
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
const stp = (state)=>{
    return{
        reload: state.reload,
        data: state.surveys || []
    }
}
export default connect(stp)(ListData);