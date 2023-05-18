import {Button, Col, Form, Row, Select, TreeSelect} from "antd";
import {useGetDynamic} from "../../../../../hooks/useGet";
import useTree from "../../../../../hooks/useTree";
import {GET_POSITIONS_BY_DEPARTMENT, GET_STAFF_WORKING_TYPE} from "../../../../../store/types";
import {useEffect, useMemo, useState} from "react";
import {PlusOutlined} from "@ant-design/icons";
import {useDispatch, useSelector} from "react-redux";
import {IconTrash} from "../../../../../components/Icon";

const {Option} = Select;
function StaffDepartmentPosition({value =[],name,restField}){
    const staffTypes = useSelector(s=>s.staffTypes || []);
    const [position,getPosition,loaderPosition] = useGetDynamic();
    const [staffType,getStaffType,loaderStaffType] = useGetDynamic();
    const [chooseStaffType,setChooseStaffType] = useState(null);
    const dispatch = useDispatch();
    const tree = useTree();
    const onChooseDepartment = (value)=>{
        if(value && value !='' && chooseStaffType){
            getPosition(`${GET_POSITIONS_BY_DEPARTMENT}`,{
                id: value,
                staff_working_type_id: chooseStaffType
            })
        }
    }
    useEffect(()=>{
        if('department' in value && value.department){
            getPosition(GET_POSITIONS_BY_DEPARTMENT,{
                id: value.department,
                staff_working_type_id: value.staff_working_type
            });
        }
        if(!staffTypes.length){
            getStaffType(GET_STAFF_WORKING_TYPE);
        }
    },[]);
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
    return (
        <div>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        label="Lavozim turini tanlang"
                        name={[name, 'staff_working_type']} {...restField} rules={[
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
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Bo'limlar"
                        name={[name, 'department']} {...restField} rules={[
                        {required: true, message: 'Iltimos tanlang!'}]}
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
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Lavozim tanlang"
                        name={[name, 'position']} {...restField} rules={[
                        {required: true, message: 'Iltimos tanlang!'}]}
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
                                    return <Option key={`position${item.id}`} value={item.id}>{item.position_name_uz}/{item.rate}</Option>
                                }):""
                            }
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
        </div>
    )
}
export default StaffDepartmentPosition;