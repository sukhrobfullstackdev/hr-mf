import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useMemo, useState} from "react";
import {
    CHECK_APPEAL_STATUS_BY_HO,
    CHECK_APPEAL_STATUS_BY_HR,
    GET_APPEAL_HR,
    GET_COMMAND_APPROVERS
} from "../../../../../store/types";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import AppTable from "../../../../../components/AppTabel";
import {Button, Form, Modal, Popover, Select} from "antd";
import {IconCheckMark, IconClose} from "../../../../../components/Icon";
import usePost from "../../../../../hooks/usePost";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import {useDispatch, useSelector} from "react-redux";


const {Option} = Select;
const ConfirmButton = ({col})=>{
    const dispatch = useDispatch();
    const user = useSelector(s=>s.isUser || null);
    const [post,postLoader,res] = usePost();
    const onConfirm= (item)=>{
        post(
            `${CHECK_APPEAL_STATUS_BY_HR}${item.id}/checked/`,
            {
                status: 'checked',
                approvers: item.approvers,
            },
            ()=>{
                dispatch({
                    type: 'reload',
                    payload: Math.random()
                })
                onCancel();
            }
        );
    };
    const onVisible= (item)=>{
        if(user && user.current_role === 'HO'){
            post(
                CHECK_APPEAL_STATUS_BY_HO,{
                    application_id: item.id,
                    status: 'confirmed'
                }
            )
        }
        if(user && user.current_role === 'HR'){
            setSelectedItem(item);
            setVisible(true);
        }

    }
    const onCancel = ()=>{
        setSelectedItem(null)
        setVisible(false);
    }
    const onReject=(id)=>{
        if(user && user.current_role === 'HO'){
            post(
                CHECK_APPEAL_STATUS_BY_HO,{
                    application_id: id,
                    status: 'rejected'
                }
            )
        }
        if(user && user.current_role === 'HR'){
            post(
                `${CHECK_APPEAL_STATUS_BY_HR}${id}/checked/`,
                {
                    status: 'rejected',
                }
            );
        }
    }
    const [visible,setVisible] = useState(false);
    const [selectedItem,setSelectedItem] = useState(null)
    return (
        <>
            {
                col.status === 'confirmed' ?
                    <Button type="primary" size="small" className="ml-2">
                        Buyruq shakilantirish
                    </Button> :
                    <>
                        <Button disabled={col.status === 'checked'} onClick={()=>onReject(col.id)} type='danger' size="small" className="mr-2">
                            <IconClose/> Bekor qilish
                        </Button>
                        <Button disabled={col.status === 'checked'} type="primary" size="small" onClick={()=>onVisible(col)}>
                            <IconCheckMark/> Qabul qilish
                        </Button>
                    </>
            }
            <Modal footer={null} title="Arizani tasdiqlash" visible={visible} onCancel={onCancel}>
                <Confirm onCancel={onCancel} onConfirm={onConfirm} item={selectedItem}/>
            </Modal>
        </>

    )
}
const Confirm = ({item,onCancel,onConfirm})=>{
    const tablePage = useSelector(s=>s.tablePage || 1);
    const [approvals,getApprovals,loaderApprovals] = useGetDynamic();
    useEffect(()=>{
        const query = tablePage > 1 ? {page: tablePage} : {}
        getApprovals(GET_COMMAND_APPROVERS,query);
    },[tablePage]);
    const onFinish = (v)=>{
        onConfirm({
            ...item,
            ...v,
        })
    }
    return(
        <Form
            initialValues={{
                approvers: item?.approvers?.map(subItem=>subItem?.user.id)
            }}
            onFinish={onFinish}
            layout="vertical"
            name='confirmForm'
        >
            <Form.Item
                name="approvers"
                label="Kelishuvchilarni tanlang"
            >
                <Select
                    placeholder="Kelishubvchilarni tanlang!"
                    size="small"
                    style={{
                        width: '100%',
                    }}
                    mode="multiple"
                >
                    {
                        approvals.map(item=>{
                            return (
                                <Option value={item.id} key={`appealApprovers${item.id}`}>
                                    {
                                        item.full_name
                                    }
                                </Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
            <p className="small text-muted">
                Agar kelishuvchilar mavjud bo'lmasa "Tasdiqlash" tugmasini bosing
            </p>
            <Form.Item className="text-right">
                <Button size="small" className="mr-2" type='danger' onClick={onCancel}>
                    Bekor qilish
                </Button>
                <Button size="small" type="primary" htmlType='submit'>
                    Tasdiqlash
                </Button>
            </Form.Item>
        </Form>
    )
}
function ListApprovals({list = []}){
    return useMemo(()=>{
        return list.map(item=>{
            return (
                <div className="small">
                    <StatusBadge status={item.status}>
                        {
                            item.user.full_name
                        }
                    </StatusBadge>
                </div>
            )
        });
    },[list]);
}
function AppealEmployee(){
    const [data,get,loader] = useGetDynamic();
    const reload = useSelector(s=>s.reload || null)
    const [columns,setColumns] = useState([
        {
            title: 'Ariza raqami',
            dataIndex: 'id',
            width: '10%'
        },{
            title: "Ariza mazmuni",
            dataIndex: 'text',
            width: '60%'
        },{
            title: 'Holati',
            dataIndex: 'status',
            render:(_,record)=>{
                return record.approvers.length ?
                    <Popover placement="topLeft" title={"Kelishuvchilar"} content={<ListApprovals list={record.approvers}/>} trigger="hover">
                        <ButtonDefault className="p-0">
                            <StatusBadge status={record.status}/>
                        </ButtonDefault>
                    </Popover>
                    :<StatusBadge status={record.status}/>
            },
            filters: [
                {
                    text: 'Yangi',
                    value: 'new',
                },
                {
                    text: 'Tasdiqlangan',
                    value: 'confirmed',
                },
            ],
            onFilter: (value, record) => record.address.indexOf(value) === 0,
        },{
            title: "Amallar",
            dataIndex: 'action',
            width: '25%',
            render: (_,col)=>{
                return (
                    <div className="text-right">
                        <ConfirmButton col={col}/>
                    </div>
                )
            }
        }
    ]);
    useEffect(()=>{
        get(GET_APPEAL_HR)
    },[reload]);
    return(
        <>
            <AppTable loader={loader} data={data} columns={columns}/>
        </>
    )
}
export default AppealEmployee;