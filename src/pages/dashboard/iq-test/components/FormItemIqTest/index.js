import {Button, Form, Input, InputNumber} from "antd";

function FormItemIqTest(){
    return(
        <>
            <Form.Item
                label="Test uchun nom"
                name="name"
                rules={[
                    {
                        required: true,
                        message: "Iltimos to'ldiring"
                    }
                ]}
            >
                <Input placeholder="Test uchun sarlavha nom kiriting"/>
            </Form.Item>
            <Form.Item
                label="1 variant uchun savollar soni"
                name="question_size"
                rules={[
                    {
                        required: true,
                        message: "Iltimos to'ldiring"
                    }
                ]}
            >
                <InputNumber placeholder="Savollar soni"/>
            </Form.Item>
            <Form.Item
                label="Test uchun beriladigan vaqt (daqiqada)"
                name="duration"
                rules={[
                    {
                        required: true,
                        message: "Iltimos to'ldiring"
                    }
                ]}
            >
                <InputNumber min={0} placeholder="Savollar soni"/>
            </Form.Item>
        </>
    )
}
export default FormItemIqTest