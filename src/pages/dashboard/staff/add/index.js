import {Button, Card, Col, Form, Input, InputNumber, Row} from "antd";
import {Link} from "react-router-dom";
import FormItems from "../components/FormItems";
import {ADD_STAFF, GET_DATE_NEW_STAFF} from "../../../../store/types";
import {useDispatch} from "react-redux";
import usePost from "../../../../hooks/usePost";
import {useEffect} from "react";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import moment from "moment";


function StaffAdd(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm()
    const [post, loader, res] = usePost(false);
    const onFinish = (v) => {
        v.birth_date = v.birth_date.format('YYYY-MM-DD');
        dispatch({
            type: ADD_STAFF,
            payload: {
                ...v,
                username: v.pinfl,
                redirectUrl: "staff"
            }
        })
    }
    const onGetUser = (v) => {
        post(GET_DATE_NEW_STAFF, v);
    }
    useEffect(() => {
        if (res && 'data' in res) {
            const user = res.data;
            form.setFieldsValue({
                full_name: `${user.surname_engl} ${user.name_engl} ${user.patronym_latin}`,
                birth_date: moment(user.birth_date),
                gender: parseInt(user.sex),
                passport_seria: user.document
            })
        }
    }, [res]);
    return <Card>
        <Row>
            <Col span={12}>
                <h2>
                    <strong>Hodim qo'shish</strong>
                </h2>
            </Col>
            <Col span={12}>
                <Form
                    layout={"vertical"}
                    onFinish={onGetUser}
                    name="formSearch"
                >
                    <Row gutter={16}>
                        <Col span={10}>
                            <Form.Item
                                name='pinfl'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Iltimos kiriting!'
                                    }
                                ]}
                            >
                                <InputNumber max={99999999999999} min={10000000000000} placeholder="Pinfl ni kiriting"/>
                            </Form.Item>
                        </Col>
                        <Col span={10}>
                            <Form.Item
                                name='document'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Iltimos kiriting!'
                                    }, {
                                        max: 10,
                                        message: "Max 10 ta belgi!"
                                    }
                                ]}
                            >
                                <Input placeholder="Passport seria va raqamini kiriting"/>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Button type="primary" htmlType="submit">
                                Tekshirish
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
        <Form
            form={form}
            layout='vertical'
            name='add_staff_form'
            onFinish={onFinish}
        >
            <FormItems/>
            <Form.Item className="text-right">
                <Link to="/dashboard/staff" className="ant-btn ant-btn-danger mr-3">
                    <IconChevronLeft/> Bekor qilish
                </Link>
                <Button type="primary" htmlType='submit'>
                    <IconSave/> Saqlash
                </Button>
            </Form.Item>
        </Form>
    </Card>
}

export default StaffAdd;