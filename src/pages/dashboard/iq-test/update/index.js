import {Button, Card, Form} from "antd";
import {connect} from "react-redux";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useLayoutEffect, useRef, useState} from "react";
import usePost from "../../../../hooks/usePost";
import {UPDATE_IQ_TEST_QUESTION} from "../../../../store/types";
import QuestionFormItem from "../components/QuestionFormItem";
import {IconSave} from "../../../../components/Icon";
import NoData from "../../../../components/NoData";

function UpdateQuestion ({editedQuestion}){
    const {id} = useParams();
    const [form] = Form.useForm();
    const [isTrue,setIsTrue] = useState('A');
    useLayoutEffect(()=>{
       if(Object.keys(editedQuestion).length){
           const a = editedQuestion.choices.map((v,index)=>v.is_true ? index : null).join('');
           if(a==='1'){
               setIsTrue('B');
           }
           if(a==='2'){
               setIsTrue('C');
           }
           if(a==='3'){
               form.setFieldsValue({
                   isAnswer: "D"
               })
           }
       }
    },[editedQuestion]);
    const formQuestion = useRef();
    const [post, addLoader] = usePost();
    const navigate = useNavigate();
    const onFinish = (v)=>{
        if(Array.isArray(v.files)){
            v.files = v.files.map(value=>{
                return {
                    file_id: value.response.id
                }
            })
        }
        if(v.files.hasOwnProperty('fileList')){
            v.files = v.files.fileList.map(value=> {return {file_id: value.response.id}});
        }
        v.choices = [
            {
                text: v.aKey,
                is_true: v.isAnswer === "A"
            },{
                text: v.bKey,
                is_true: v.isAnswer === "B"
            },{
                text: v.cKey,
                is_true: v.isAnswer === "C"
            },{
                text: v.dKey,
                is_true: v.isAnswer === "D"
            }
        ];
        post(`${UPDATE_IQ_TEST_QUESTION}`,
            {
                ...v,
                question_id: parseInt(id)
            },()=>{
            navigate(`/dashboard/iq-test`);
        });
    }
    return(
        <Card>
            {
                Object.keys(editedQuestion).length ?
                    <div>
                        <h1 className="mb-3">
                            <strong>Savolni taxririlash</strong>
                        </h1>
                        <Form
                            layout="vertical"
                            ref={formQuestion}
                            name='updateQuestion'
                            onFinish={onFinish}
                            initialValues={editedQuestion}
                        >
                            <QuestionFormItem value={editedQuestion}/>
                            <Form.Item className="text-right">
                                <Link to={'/dashboard/iq-test'} className="mr-5 ant-btn-link-danger">
                                    Ortga qaytish
                                </Link>
                                <Button disabled={addLoader} htmlType="submit" type='primary'>
                                    <IconSave/> Saqlash
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>:
                    <NoData isBack={'/dashboard/iq-test'} size="sm" message="Siz qo'shmoqchi bo'lgan test bo'yicha ma'lumotlar topilmadi!"/>
            }
        </Card>
    )
}
const stp = state=>({
    editedQuestion: state.editedQuestion || {}
})
export default connect(stp)(UpdateQuestion);