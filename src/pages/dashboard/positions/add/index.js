import {Button, Card, Form} from "antd";
import Title from "../../../../styleComponents/Title";
import FormItem from "../component/FormItem";
import {Link} from "react-router-dom";
import {ArrowLeftOutlined, SaveOutlined} from "@ant-design/icons";
import {ADD_POSITIONS} from "../../../../store/types";
import {useDispatch} from "react-redux";

function AddPosition(props){
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const onFinish = (v)=>{
        dispatch({
            type: ADD_POSITIONS,
            payload: {
                ...v,
                position_total: parseInt(v.position_total),
                type_of_payment: parseInt(v.razryad),
                redirectUrl: 'positions/'
            }
        })
    }
    const onSelect = (item)=>{
        form.setFieldsValue({
            position_name_uz: item.name_uz_lat,
            position_name_ru: item.name_ru,
            position_name_en: item.name_uz_kr,
        })
    }
    return (
        <Card>
            <Title>
                Yangi lavozim qo'shish
            </Title>
            <Form
                form={form}
                name='positionForm'
                layout='vertical'
                onFinish={onFinish}
            >
                <FormItem setActiveSelector={onSelect}/>
                <Form.Item className="text-right">
                    <Link to="/dashboard/positions" className="ant-btn ant-btn-danger mr-3">
                        <ArrowLeftOutlined /> Bekor qilish
                    </Link>
                    <Button type="primary" htmlType='submit'>
                        <SaveOutlined /> Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Card>

    )
}
export default AddPosition;