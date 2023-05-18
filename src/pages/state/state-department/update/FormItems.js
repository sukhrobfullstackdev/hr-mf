import { Col, Form, Input, InputNumber, Row } from "antd";

function FormItem() {

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          label="Bo'lim"
          name='name'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <Input
            placeholder="Bo'lim"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="Ko'd"
          name='code'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <InputNumber
            placeholder="Ko'd"
          />
        </Form.Item>
      </Col>
    </Row>
  )
}
export default FormItem;