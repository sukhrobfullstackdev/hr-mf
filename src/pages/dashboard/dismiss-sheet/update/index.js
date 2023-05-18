import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect} from "react";
import {
    GET_COMMAND_APPROVERS,
    GET_ONE_DISMISS_SHEET, UPDATE_DISMISS_SHEET
} from "../../../../store/types";
import {Button, Card, Form, Select, Skeleton} from "antd";
import {IconChevronLeft, IconSave} from "../../../../components/Icon";
import usePost from "../../../../hooks/usePost";

const {Option} = Select
function DismissSheetUpdate(){
    const {id} =useParams();
    const navigate = useNavigate()
    const [dismissSheet,get,loader] = useGetDynamic();
    const [approvals,getApprovals,approvalsLoader] = useGetDynamic();
    const [post,updateLoader] = usePost()
    useEffect(()=>{
        get(`${GET_ONE_DISMISS_SHEET}${id}`);
    },[]);
    useEffect(()=>{
        if(!approvals.length){
            getApprovals(GET_COMMAND_APPROVERS);
        }
    },[]);
    const onFinish = (v)=>{
        post(`${UPDATE_DISMISS_SHEET}${id}/`, {
            ...v,
            application_id: dismissSheet.application
        },()=>{
            navigate("/dashboard/dismiss-sheet")
        });
    }
    return(
       loader ?
        <Card>
            <Skeleton active/>
        </Card>:
        <Card>
               <h1>
                   <strong>Ishdan bo'shash uchun varaqa shakillantirish</strong>
               </h1>
               <Form
                   onFinish={onFinish}
                   layout='vertical'
                   name="dismissForm"
                   initialValues={{
                       ...dismissSheet,
                       approvers: dismissSheet.approvers.map(v=> v.staff.id)
                   }}
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
                           loading={approvalsLoader}
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
                       <Button disabled={updateLoader} htmlType="submit" type="primary">
                           <IconSave/> Saqlash
                       </Button>
                   </Form.Item>
               </Form>
           </Card>

    )
}
export default DismissSheetUpdate;