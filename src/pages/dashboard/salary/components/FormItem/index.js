import {Form, InputNumber} from "antd";

function FormItem(){
    return(
        <div>
            <Form.Item
                label="Qiymatni kiriting"
                name="value"
                rules={[
                    {
                        required: true,
                        message: "Iltimos to'ldiring"
                    },
                ]}
            >
                <InputNumber max={999999999} placeholder="Qiymatni kiriting"/>
            </Form.Item>
        </div>
    )
}
export default FormItem;