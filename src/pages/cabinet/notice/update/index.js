import {Link, useNavigate, useParams} from "react-router-dom";
import usePost from "../../../../hooks/usePost";
import {GET_ONE_NOTICE, UPDATE_NOTICE} from "../../../../store/types";
import {Button, Card, Form, Skeleton} from "antd";
import FormItem from "../components/FormItem";
import {IconClose, IconSave} from "../../../../components/Icon";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect} from "react";
import moment from "moment";

function CabinetNoticeUpdate(){
    const {id} = useParams();
    const [data,get,getLoader] = useGetDynamic();
    const [post,loader] = usePost();
    const navigate = useNavigate();
    useEffect(()=>{
        get(`${GET_ONE_NOTICE}${id}`);
    },[])
    const onFinish = (v)=>{
        v.premiums = v.premiums.map(val=> ({
            ...val,
            premium_date: val.premium_date.format('YYYY-MM-DD')
        }));
        post(`${UPDATE_NOTICE}${id}/`, {
            ...v,
            status: data.status
        }, ()=>{
            navigate('/cabinet/approved/notice');
        });
    }
    return(
        <Card className="my-5">
            <h3>
                <strong>Yangi bildirigi shakillantirish</strong>
            </h3>
            {
                getLoader ?
                    <Skeleton active/> :
                    <Form
                        layout='vertical'
                        name="formNotice"
                        onFinish={onFinish}
                        initialValues={{
                            ...data,
                            premiums: data.premiums.map(value => ({
                                ...value,
                                staff: value.staff.id,
                                premium_date: moment(value.premium_date)
                            }))
                        }}
                    >
                        <FormItem value={data}/>
                        <Form.Item className="text-right">
                            <Link to="/cabinet/approved/notice" className="ant-btn-link ant-btn-link-danger mr-2">
                                <IconClose/> Bekor qilish
                            </Link>
                            <Button htmlType="submit" type='primary'>
                                <IconSave/> Saqlash
                            </Button>
                        </Form.Item>
                    </Form>
            }
        </Card>
    )
}
export default CabinetNoticeUpdate