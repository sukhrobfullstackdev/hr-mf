import {connect, useDispatch, useSelector} from "react-redux";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useMemo, useRef, useState} from "react";
import {
    ADD_IQ_TEST,
    GET_CERTIFICATE,
    GET_IQ_TESTS,
    SET_STATUS_IQ_TEST,
    UPDATE_IQ_TEST
} from "../../../../../store/types";
import {Button, Col, Drawer, Dropdown, Form, Row} from "antd";
import {Link} from "react-router-dom";
import {
    IconDotsHorizontal, IconEdit,
    IconEye,
    IconFolderAdd,
    IconPlus,
    IconSettings,
    IconTrash
} from "../../../../../components/Icon";
import AppTabel from "../../../../../components/AppTabel";
import FormItemIqTest from "../FormItemIqTest";
import Req from "../../../../../store/api";
import usePost from "../../../../../hooks/usePost";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";

function ListData({iqTests}){
    const [post,loader] = usePost();
    const [activeTest,setActiveTest] = useState(null);
    const DropDownContent = ({col})=>{
        return(
            <div className="text-left">
                <ButtonDefault onClick={()=>setStatus(col)} className="d-block ant-btn-link" title={`Faolligini o'zgartirish!`}>
                    <IconSettings/> O'zgatirish
                </ButtonDefault>
                <ButtonDefault onClick={()=>onUpdate(col)} className="d-block ant-btn-link" title={`Faolligini o'zgartirish!`}>
                    <IconEdit/> Taxrirlash
                </ButtonDefault>
                <Link to={`view/${col.id}`} className='d-block ant-btn-link'>
                    <IconEye/> Ko'rish
                </Link>
                <Link to={`answer/${col.id}`} className='d-block ant-btn-link'>
                    <IconFolderAdd/> Savol qo'shish
                </Link>
            </div>
        )
    }
    const [columns,setColumns] = useState([
        {
            title: "Id",
            width: '5%',
            dataIndex: 'id'
        },
        {
            title: "Iq Test nomi",
            dataIndex: 'name',
        },
        {
            title: "1 variant uchun savollar soni",
            dataIndex: 'question_size',
        },
        {
            title: "Vaqti (min)",
            dataIndex: 'duration',
        },
        {
            title: "Savollar soni",
            dataIndex: 'total_questions',
        },
        {
            title: "Holati",
            dataIndex: 'status',
            render: (_,col)=>{
                return(
                    <span>{col.status === 'on' ? 'Faol' : 'No faol'}</span>
                )
            }
        },
        {
            title: "Amal qilish sana",
            dataIndex: 'dateof_issue',
            render:(_,col)=>{
                return(
                    <div className="text-center">
                        <Dropdown overlay={<DropDownContent col={col}/>}>
                            <ButtonDefault className="text-muted">
                                <IconDotsHorizontal/>
                            </ButtonDefault>
                        </Dropdown>
                    </div>
                )
            }
        },
    ]);
    const [addLoader,setAddLoader] = useState(false);
    const dispatch = useDispatch();
    const form = useRef();
    const [visible,setVisible] = useState(false);
    const onClose = ()=>{
        form.current.resetFields();
        setActiveTest(null);
        setVisible(false);
    }
    const onFinish = (v)=>{
        setAddLoader(true);
        Req({
            type: activeTest && 'id' in activeTest? `${UPDATE_IQ_TEST}${activeTest.id}/` : ADD_IQ_TEST,
            data: v
        }).then(res=>{
            dispatch({
                type: 'reload',
                payload: Math.random()
            })
            onClose()
        }).catch(err=>{
            dispatch({
                type: 'toast',
                payload: "Hatolik qayta urinib ko'ring!"
            })
        }).finally(()=>{
            setAddLoader(false);
        })
    }
    const setStatus =(item)=>{
        post(`${SET_STATUS_IQ_TEST}${item.id}/turn_on_or_off/`,{
            status: item.status === 'on' ? 'off' : 'on'
        },()=>{
            dispatch({
                type: 'reload',
                payload: Math.random()
            })
        })
    }
    const onUpdate = (item)=>{
        setActiveTest(item);
        setVisible(true);
    }
    const iqTestForm = useMemo(()=>{
        return(
            <Form
                initialValues={activeTest}
                ref={form}
                name="iqTest"
                layout="vertical"
                onFinish={onFinish}
            >
                <FormItemIqTest/>
                <Form.Item className="text-right">
                    <Button onClick={onClose} type="danger" className="mr-2">
                        Bekor qilish
                    </Button>
                    <Button disabled={addLoader} type="primary" htmlType="submit">
                        Saqlash
                    </Button>
                </Form.Item>
            </Form>
        )
    },[activeTest])
    return(
        <div>
            <Row justify='end' className="mb-4">
                <Col span={12} className="text-right">
                    <Button type="primary" onClick={()=>setVisible(true)}>
                        <IconPlus/>Yangi iq test qo'shish
                    </Button>
                </Col>
            </Row>
            <AppTabel data={iqTests} type={GET_IQ_TESTS} columns={columns} loader={loader}/>
            <Drawer title="Yangi Iq test" placement="right" onClose={onClose} visible={visible}>
                {
                    iqTestForm
                }
            </Drawer>
        </div>
    )
}
const stp = (state)=>{
    return{
        iqTests: state.iqTests || [],
        loader: state.loader
    }
}
export default connect(stp)(ListData)