import {Col, Form, Input, Row, Select} from "antd";
import useRegion from "../../../../../hooks/useRegion";
import {useState} from "react";
import useDistrict from "../../../../../hooks/useDistrict";

const {Option} = Select;
function FormItem(){
    const [regionId,setRegionId] = useState(null);
    const region = useRegion();
    const district = useDistrict(regionId);
    return(
        <Row gutter={16}>
            <Col span={8}>
                <Form.Item
                    label="To'liq ismi sharifi"
                    name='full_name'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="F.I.Sh."
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="email"
                    label="Elektron pochta manzili"
                    rules={[
                        {
                            required: true,
                            message: 'Kiriting!',
                        }
                    ]}
                >
                   <Input type='email' placeholder="examp@mail.com"/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="pin"
                    label="Foydalanuvchi INN si"
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting!`,
                        },{
                            max: 14,
                            message: `Max 14 honali son`
                        }
                    ]}
                >
                    <Input
                        type='number'
                        maxLength={14}
                        placeholder="12345678912134"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Login"
                    name='username'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input
                        placeholder="Login"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Parolni kiriting"
                    name='password'
                    rules={[
                        {
                            required: true,
                            message: `Ma'lumot kiriting`,
                        }
                    ]}
                >
                    <Input type='password'
                        placeholder="Parol"
                    />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="mob_phone_no"
                    label="Telefon raqami"
                    rules={[
                        {
                            required: true,
                            message: 'Kiriting!',
                        }
                    ]}
                >
                    <Input type='tel' placeholder="+998 97 999 99 99"/>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    label="Region"
                    name='province_code'
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
                        onChange={(v)=>setRegionId(v)}
                    >
                        {
                            region.map(item=>{
                                return <Option key={`region${item.id}`} value={item.province_code}>{item.name_uz_lat}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="district_code"
                    label="Tuman"
                    rules={[
                        {
                            required: true,
                            message: 'Tanlang!',
                        }
                    ]}
                >
                    <Select
                        placeholder="Tanlang!"
                        disabled={!district.length}
                    >
                        {
                            district.map(item=> <Option key={`district${item.id}`} value={item.id}>
                                {
                                    item.name_uz_lat
                                }
                            </Option>)
                        }
                    </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item
                    name="role_id"
                    label="Role ni tanlang"
                    rules={[
                        {
                            required: true,
                            message: 'Tanlang!',
                        }
                    ]}
                >
                    <Select
                        placeholder="Tanlang!"
                    >
                        <Option value="SA">SA</Option>
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    )
}
export default FormItem;