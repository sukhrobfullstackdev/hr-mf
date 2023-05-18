import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Form, Modal, Row, Select, TreeSelect} from "antd";
import SurveyView from "../../../../components/SurveyView";
import {IconCheckMark, IconChevronLeft, IconClose} from "../../../../components/Icon";
import Req from "../../../../store/api";
import {
    GET_ONE_SURVEY,
    GET_POSITIONS_BY_DEPARTMENT,
    GET_STAFF_WORKING_TYPE,
    SURVEY_SET_STATUS
} from "../../../../store/types";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useTree from "../../../../hooks/useTree";
import StatusBadge from "../../../../styleComponents/StatusBadge";

const {Option} = Select;
function DashboardSurveyByKey(){
    const staffTypes = useSelector(s=>s.staffTypes || []);
    const [staffType,getStaffType,loaderStaffType] = useGetDynamic();
    const [chooseStaffType,setChooseStaffType] = useState(null);
    const [data,get,loader] = useGetDynamic();
    const [btnLoader,setBtnLoader] = useState(false);
    const [siVisible,setIsVisible] = useState(false);
    const [position,getPosition,loaderPosition] = useGetDynamic();
    const tree = useTree();
    const dispatch = useDispatch();
    const {key} = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        get(`${GET_ONE_SURVEY}${key}/`);
        if(!staffTypes.length){
            getStaffType(GET_STAFF_WORKING_TYPE);
        }
    },[key]);
    useEffect(()=>{
        if(!staffTypes.length){
            dispatch({
                type: 'staffTypes',
                payload: staffType
            })
        }
    },[staffType]);
    const onChooseStaffType = (v)=>{
        setChooseStaffType(v);
    }

    const onChooseDepartment = (value) =>{
        if(value && value !='' && chooseStaffType){
            getPosition(GET_POSITIONS_BY_DEPARTMENT,{
                id: value,
                staff_working_type_id: chooseStaffType
            })
        }
    }
    const setStatus = (data = {status: 'rejected'})=>{
        setBtnLoader(true)
        Req({
            type: `${SURVEY_SET_STATUS}${key}/set-status/`,
            data:data
        }).then(res=>{
            dispatch({
                type:"toast",
                payload: {
                    type: "success",
                    message: `Murojaat ${data.status === 'rejected' ?"bekor" : 'qabul'} qilindi!`
                }
            });
            navigate('/dashboard/surveys')
        }).catch(err=>{
            dispatch({
                type:"toast",
                payload: {
                    type: "error",
                    message: "Hatolik! qayta urunib ko'ring!"
                }
            })
        }).finally(()=>{
            setIsVisible(false);
            setBtnLoader(false);
        })
    }
    const onSetApproved=()=>{
        setIsVisible(true);
    }
    const onRejected = ()=>{
        setStatus();
    }
    const handleCancel = ()=>{
        setIsVisible(false);
    }
    const onFinish =(v)=>{
        setStatus({...v,status: 'confirmed'})
    }
    return(
        <Card>
            <SurveyView loader={loader} data={data}/>
            <Row className="mt-4">
                <Col span={12}>
                    <Link to={"/dashboard/surveys"}>
                        <IconChevronLeft/> Ortga qaytish
                    </Link>
                </Col>
                <Col span={12} className="text-right">
                    {
                        data.status === 'rejected' || data.status === 'confirmed' ?
                            <StatusBadge status={data.status}/>:
                            <>
                                <Button disabled={btnLoader} type="danger" className="mr-2" onClick={onRejected}>
                                    <IconClose/> Bekor qilish
                                </Button>
                                <Button disabled={btnLoader} type="primary" onClick={onSetApproved}>
                                    <IconCheckMark/> Qabul qilish
                                </Button>
                            </>

                    }
                </Col>
            </Row>
            <Modal title="Bo'lim va lavozim biriktiring" footer={null} visible={siVisible}  onCancel={handleCancel}>
                <Form
                    onFinish={onFinish}
                    name="surveyConfirmForm"
                    layout="vertical"
                >
                    <Form.Item
                        label="Lavozim turini tanlang"
                        name={'staff_working_type'} rules={[
                        {required: true, message: 'Iltimos tanlang!'}]}
                    >
                        <Select
                            allowClear
                            placeholder="Tanlang!"
                            onChange={onChooseStaffType}
                        >
                            {
                                staffTypes.map(item=>{
                                    return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name}</Option>
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="department"
                        label="Bo'limlar"
                        rules={[
                            {
                                required: true,
                                message: 'Iltimos tanlang!'
                            }
                        ]}
                    >
                        <TreeSelect
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
                            treeData={tree}
                            onChange={onChooseDepartment}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Lavozim tanlang"
                        name="position"
                        rules={[
                            {
                                required: true,
                                message: "Iltimos tanlang!"
                            }
                        ]}
                    >
                        <Select
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
                                'positions' in position ? position.positions.map(item=>{
                                    return <Option key={`position${item.id}`} value={item.id}>{item.position_name_uz} / {item.rate}</Option>
                                }):""
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item className="text-right">
                        <Button type="danger" onClick={handleCancel} size="small" className="mr-2">
                            Bekor qilish
                        </Button>
                        <Button type="primary" htmlType="submit" size="small">
                            Qabul qilish
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}
export default DashboardSurveyByKey;