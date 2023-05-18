import {Checkbox, Col, Form, Input, InputNumber, Row, Select, TreeSelect} from "antd";
import {useEffect, useState} from "react";
import useClassifcator from "../../../../../hooks/useClassifcator";
import useTree from "../../../../../hooks/useTree";
import {useGetDynamic} from "../../../../../hooks/useGet";
import {GET_RAZRYAD, GET_STAFF_WORKING_TYPE} from "../../../../../store/types";

const {Option} = Select;
function FormItem({setActiveSelector}){
    const [staffWorkingType,get,loader] = useGetDynamic();
    const classificator = useClassifcator();
    const [tarif,setTarif] = useState(false);
    const [redFlag,setRedFlag] = useState(false);
    const [r,getR, loaderR] = useGetDynamic();
    const tree = useTree();

    const onChangeTarif =()=>{
        setTarif(!tarif);
    }
    useEffect(()=>{
        getR(GET_RAZRYAD)
    },[])
    useEffect(()=>{
        if(!staffWorkingType.length){
            get(GET_STAFF_WORKING_TYPE);
        }
    });
    const onChangeSelector = (v)=>{
        const active = classificator.find(cv=>cv.id === v);
        setActiveSelector(active || null);
    }
    return(
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item
                    label="Tarkibiy bo'linmalar"
                    name='classificator_id'
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
                        showSearch
                        onChange={onChangeSelector}
                        filterOption={
                            (input, option)=>{
                                return option.children.toLowerCase().indexOf(input.toLowerCase()) > 0
                            }
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        placeholder="Tanlang!"
                    >
                        {
                            classificator.map(item=>{
                                return <Option key={`department${item.id}`} value={item.id}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="department_id"
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
                    label="Lavozim turini tanlang"
                    name='staff_working_type' rules={[
                    {required: true, message: 'Iltimos tanlang!'}]}
                >
                    <Select
                        allowClear
                        placeholder="Tanlang!"
                        loading={loader}
                    >
                        {
                            staffWorkingType.map(item=>{
                                return <Option key={`region${item.id}`} value={parseInt(item.id)}>{item.name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Lavozimni o'zbek tilidagi nomi"
                    name='position_name_uz'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Ixtiyoriy matin"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Lavozimni rus tilidagi nomi"
                    name='position_name_ru'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Ixtiyoriy matin"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Lavozimni ingliz tilidagi nomi"
                    name='position_name_en'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Ixtiyoriy matin"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    valuePropName='checked'
                    label="Davlat muassasalari tibbiyot va farmatseftika xodimlari mehnatiga haq"
                    name='red_flag'
                >
                    <Checkbox onChange={()=>setRedFlag(!redFlag)}>Ha / Yo'q</Checkbox>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label={
                        <div>
                            Xujjatlarni kelishish imkoniyati?
                        </div>
                    }
                    name="is_responsible"
                    valuePropName="checked"
                >
                    <Checkbox defaultChecked={false}>
                        Ha / Yo'q
                    </Checkbox>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label={
                        <div>
                            Bo'lim boshlig'imi?
                            <p className="text-muted m-0 small">
                                Yuqorida tanlangan bo'lim aynan shu lavozimga bo'ysinadimi yoki yo'qmi?
                            </p>
                        </div>
                    }
                    name="is_head_department"
                    valuePropName="checked"
                >
                    <Checkbox defaultChecked={false}>
                        Ha / Yo'q
                    </Checkbox>
                </Form.Item>
            </Col>
            <Col span={5}>
                <Form.Item
                    label="Mehnatga haq to'lash yagona tarif setkasi"
                    name='razryad'
                >
                    <Select
                        allowClear
                        hasFeedback
                        showSearch
                        placeholder="Tanlang!"
                    >
                        {
                            r.map(item=>{
                                return <Option key={`razryad${item.id}`} value={item.id}>{item.value}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={5}>
                <Form.Item
                    label="Stavka"
                    name='rate'
                    initialValue={0.25}
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <InputNumber min={0.25} max={1.5} placeholder="Jami stavak"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="Agar ushbu turdagi ish o‘rni (lavozim) bir nechta bo‘lsa – ish o‘rinlari (lavozim) sonini kiriting"
                    name='count'
                >
                    <InputNumber min={0}
                        placeholder="Ixtiyoriy matin"
                    />
                </Form.Item>
            </Col>
        </Row>
    )
}
export default FormItem;