import {Button, Col, DatePicker, Form, Input, InputNumber, Row, Select} from "antd";
import {IconPlus, IconTrash} from "../../../../../components/Icon";
import {GET_STAFF} from "../../../../../store/types";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useRef,useState} from "react";
import {useSelector} from "react-redux";
import moment from "moment";
const {Option} = Select;
function FormItem({value = {}}){
    const [type,setType] = useState('type' in value ? value.type :'business_trip');
    const onChange = (v)=>{
        setType(v);
    }
    return(
        <Row>
            <Col span={24}>
                <Form.Item
                    name="type"
                    label="Bildirgi turi"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos tanlang!"
                        }
                    ]}
                >
                    <Select
                        onChange={onChange}
                        defaultValue="business_trip"
                        placeholder="Tanlang"
                    >
                        <Option value='business_trip'>Mexnat safari</Option>
                        <Option value='premium_employees'>Hodimga ustama belgilash</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={24}>
                <Form.Item
                    label="Bildirgi matni"
                    name="text"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos to'ldiring!"
                        }
                    ]}
                >
                    <Input.TextArea className="simple-textarea" placeholder="Matini kiriting"/>
                </Form.Item>
            </Col>
            {
                type === 'premium_employees' ?
                    <Col span={24}>
                        <Form.List name="premiums">
                            {(fields, {add, remove}) => {
                                return(
                                    <>
                                        {fields.map(({key, name, ...restField}) =>{
                                            return(
                                                <div key={`formListByStaff${key}`}>
                                                    <UserList value={value} name={name} restField={restField}/>
                                                    <div className="text-right">
                                                        <Button type="danger" size='small' onClick={()=>remove(name)}>
                                                            <IconTrash/> O'chirish
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        <Form.Item className="mt-3">
                                            <Button type="dashed" className="dashed" onClick={() => add()} block icon={<IconPlus/>}>
                                                Ustama qo'shish
                                            </Button>
                                        </Form.Item>
                                    </>
                                )
                            }}
                        </Form.List>
                    </Col> : ''
            }

        </Row>
    )
}
const UserList = ({value =[],name,restField})=>{
    const tableCount = useSelector(s=>s.tableCount || 0)
    const [staffs,get,loader] = useGetDynamic();
    const [count,setCount] = useState(0);
    const timeOut = useRef();
    useEffect(()=>{
        if(!staffs.length){
            get(GET_STAFF);
        }
    },[]);
    const onSearch = (select)=>{
        if(timeOut.current){
            clearInterval(timeOut.current);
        }
        if(select && select !==''){
            timeOut.current = setTimeout(()=>{
                get(GET_STAFF,{
                    search: select
                });
            },500);
        }else{
            get(GET_STAFF);
        }

    }
    const onSelect =()=>{
        get(GET_STAFF);
    }
    const onPopupScroll = (element)=>{
        if(element.target.scrollTop + element.target.offsetHeight === element.target.scrollHeight){
            if(count < tableCount){
                get(GET_STAFF,{
                    page_size:count + 10
                });
                setCount(count + 10);
            }
        }
    }
    return(
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item
                    label="Hodim tanlang"
                    name={[name, 'staff']} {...restField}
                    rules={[
                        {
                            required: true,
                            message: `Iltimos tanlang!`
                        }
                    ]}
                    >
                <Select
                    showSearch
                    filterOption={false}
                    placeholder="Hodim tanlang"
                    allowClear
                    onSearch={onSearch}
                    onSelect={onSelect}
                    onPopupScroll={onPopupScroll}
                    loading={loader}>
                    {
                        staffs.map( item =>{
                            return (
                                <Option value={item.id} key={`staff${item.id}`}>
                                    {item.full_name}
                                </Option>
                            )
                        })
                    }
                </Select>
            </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name={[name, 'premium_amount']} {...restField}
                    label="Ustama haqqi ( % da)"
                    rules={[
                        {
                            required: true,
                            message: `Iltimos to'ldiring!`
                        }
                    ]}
                >
                    <InputNumber min={0} placeholder="Ustama haqqi foizda"/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name={[name, 'premium_date']} {...restField}
                    label="Boshlanish sanasi"
                    rules={[
                        {
                            required: true,
                            message: `Iltimos tanlang!`
                        }
                    ]}
                >
                    <DatePicker format={'YYYY-MM-DD'} placeholder="Sana"/>
                </Form.Item>
            </Col>
        </Row>
    )
}
export default FormItem