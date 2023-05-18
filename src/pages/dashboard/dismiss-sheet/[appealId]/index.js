import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Form, Select} from "antd";
import {useEffect} from "react";
import {CREATE_DISMISS_SHEET, GET_COMMAND_APPROVERS} from "../../../../store/types";
import {useGetDynamic} from "../../../../hooks/useGet";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import usePost from "../../../../hooks/usePost";

const {Option} = Select;
function DashboardDismissSheetByAppealId(){
    const {appealId} = useParams();
    const [post,loader] = usePost();
    const navigate = useNavigate()
    const [approvals, getApprovals, loaderApprovals] = useGetDynamic();
    useEffect(()=>{
        if(!approvals.length){
            getApprovals(GET_COMMAND_APPROVERS);
        }
    },[])
    const onFinish = (v)=>{
        post(CREATE_DISMISS_SHEET,{
            ...v,
            application_id: appealId
        },()=>{
            navigate("/dashboard/dismiss-sheet")
        });
    }
    return(
        <Card>
            <h1>
                <strong>Ishdan bo'shash uchun varaqa shakillantirish</strong>
            </h1>
            <Form
                onFinish={onFinish}
                layout='vertical'
                name="dismissForm"
            >
                <Form.Item
                    name='approvers'
                    label="Kelishish uchun hodimlar tanlang"
                    rules={[
                        {
                            required: true,
                            message: 'Iltimos tanlang!'
                        }
                    ]}
                >
                    <Select
                        mode="multiple"
                        showSearch
                        filterOption={
                            (input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >-1
                        }
                        placeholder="Kelishish uchun hodim tanlang"
                        allowClear
                        loading={loaderApprovals}
                    >
                        {
                            approvals.map(item=>{
                                return <Option key={`approvals${item.id}`} value={item.id}>{item.full_name}</Option>
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item className="text-right">
                    <Link to={'/dashboard/dismiss-sheet'} className="mr-3 ant-btn ant-btn-danger">
                        <IconChevronLeft/> Bekor qilish
                    </Link>
                    <Button disabled={loader} htmlType="submit" type="primary">
                        <IconSave/> Saqlash
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}
export default DashboardDismissSheetByAppealId;