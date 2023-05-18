import {Button, Card, Form} from "antd";
import FormItem from "../components/FormItem";
import {Link, useNavigate} from "react-router-dom";
import {IconClose, IconSave} from "../../../../components/Icon";
import usePost from "../../../../hooks/usePost";
import {CREATE_NOTICE} from "../../../../store/types";

function CabinetNoticeAdd(){
    const [post,loader] = usePost();
    const navigate = useNavigate();
    const onFinish = (v)=>{
        v.premiums = v.premiums.map(val=> ({
            ...val,
            premium_date: val.premium_date.format('YYYY-MM-DD')
        }));
        post(CREATE_NOTICE, {
            ...v,
            status: 'new'
        }, ()=>{
            navigate('/cabinet/approved/notice');
        });
    }
    return(
        <Card className="my-5">
            <h3>
                <strong>Yangi bildirigi shakillantirish</strong>
            </h3>
            <Form
                layout='vertical'
                name="formNotice"
                onFinish={onFinish}
                initialValues={{
                    type: 'business_trip'
                }}
            >
                <FormItem/>
                <Form.Item className="text-right">
                    <Link to="/cabinet/approved/notice" className="ant-btn-link ant-btn-link-danger mr-2">
                        <IconClose/> Bekor qilish
                    </Link>
                    <Button htmlType="submit" type='primary'>
                        <IconSave/> Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default CabinetNoticeAdd;