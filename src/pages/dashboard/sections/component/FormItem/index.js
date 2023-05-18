import {Col, Form, Input, Row, Select, TreeSelect} from "antd";
import {useEffect, useState} from "react";
import Req from "../../../../../store/api";
import {GET_DEPARTMENT_TYPES,GET_STAFF_RESPONSIBLE} from "../../../../../store/types";
import useTree from "../../../../../hooks/useTree";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const {Option} = Select;
function FormItem(){
    const tree = useTree();
    const dispatch = useDispatch();
    const [department, setDepartment] = useState([]);
    const [responsibleMan, getResponsibleMan,loaderResponsibleMan] = useGetDynamic();
    const navigate = useNavigate();
    useEffect(()=>{
        if(!responsibleMan.length){
            getResponsibleMan(GET_STAFF_RESPONSIBLE);
        }
        Req({
            type: GET_DEPARTMENT_TYPES,
        })
            .then(res=>{
                setDepartment(res.data.data)
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
                        navigate('/login')
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
            })
    },[]);
    return(
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item
                    label="Bo'limning davlat tilidagi nomi"
                    name='label'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Bo'lim nomini kiriting"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Bo'limning rus tilidagi nomi"
                    name='name_ru'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Bo'lim nomini kiriting"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Bo'limning ingliz tilidagi nomi"
                    name='name_en'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Bo'lim nomini kiriting"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Tarkibiy bo'linmalar"
                    name='department_type_id'
                    rules={[
                        {
                            required: true,
                            message: 'Tanlang!',
                        }
                    ]}
                >
                    <Select
                        allowClear
                        hasFeedback
                        placeholder="Tanlang!"
                    >
                        {
                            department.map(item=>{
                                return <Option key={`department${item.id}`} value={item.id}>{item.name_uz}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="parent"
                    label="Bo'limlar"
                >
                    <TreeSelect
                        showSearch
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
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label={
                        <div>
                            Bo'ysunuvchi
                            <p className="text-muted small m-0">
                                Ushbu bo'lim tog'ridan tog'ri bo'ysinuvchi raxbar hodimni tanlang
                            </p>
                        </div>
                    }
                    name="responsible_man"
                >
                    <Select
                        showSearch
                        filterOption={
                            (input, option) => {
                                return option.children ? option.children.toLowerCase().indexOf(input.toLowerCase()) > - 1 : false
                            }
                        }
                        placeholder="Bo'ysinuvchi"
                    >
                        {
                            responsibleMan.map(item=>{
                                return(
                                    <Option key={`keyResponsibleMan${item.id}`} value={item.id}>
                                        {item.full_name}
                                    </Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    )
}
export default FormItem;