import {Col, Form, Input, Row} from "antd";

function FormItems(){
    return <>
                <Form.Item
                    name={'full_name'}
                    label="Hodim I.F.Sh."
                    rules={[
                        {
                            required: true,
                            message: `Iltimos to'ldiring`
                        }
                    ]}
                >
                    <Input disabled placeholder="Hodimning ism sharifi"/>
                </Form.Item>
                <Form.Item
                    name={'template_number'}
                    label="Blanka raqami"
                    rules={[
                        {
                            required: true,
                            message: `Iltimos to'ldiring`
                        }
                    ]}
                >
                    <Input type='number' placeholder="Blankaga berilgan raqam (qizil rangda)"/>
                </Form.Item>
                <Form.Item
                    name={'serial_number'}
                    label="Blanka serisi va raqami"
                    rules={[
                        {
                            required: true,
                            message: `Iltimos to'ldiring`
                        }
                    ]}
                >
                    <Input placeholder="Seria va raqam"/>
                </Form.Item>
                <Form.Item
                    name={'hospital_name'}
                    label="Shifoxona nomi"
                    rules={[
                        {
                            required: true,
                            message: `Iltimos to'ldiring`
                        }
                    ]}
                >
                    <Input placeholder="Shifoxona nomi"/>
                </Form.Item>
                <Form.Item
                    name={'sickness_type'}
                    label="Kassalik nomi"
                    rules={[
                        {
                            required: true,
                            message: `Iltimos to'ldiring`
                        }
                    ]}
                >
                    <Input placeholder="Kasallik nomi, misol: Gripp"/>
                </Form.Item>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={'begin_date'}
                            label="Boshlanish vaqti"
                            rules={[
                                {
                                    required: true,
                                    message: `Iltimos to'ldiring`
                                },
                            ]}

                        >
                            <Input type="date"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={'end_date'}
                            label="Tugash vaqti"
                            rules={[
                                {
                                    required: true,
                                    message: `Iltimos to'ldiring`
                                },
                            ]}

                        >
                            <Input type="date"/>
                        </Form.Item>
                    </Col>
                </Row>
             </>
}
export default FormItems;