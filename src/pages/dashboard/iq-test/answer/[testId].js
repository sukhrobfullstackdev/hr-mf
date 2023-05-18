import {Link, useParams} from "react-router-dom";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useRef} from "react";
import {ADD_IQ_TEST, ADD_IQ_TEST_QUESTION, GET_ONE_IQ_TEST} from "../../../../store/types";
import {Button, Card, Col, Form, Row, Skeleton} from "antd";
import QuestionFormItem from "../components/QuestionFormItem";
import {IconSave} from "../../../../components/Icon";
import usePost from "../../../../hooks/usePost";
import NoData from "../../../../components/NoData";
import ListQuestions from "../components/ListQuestions";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "antd/es/form/Form";

function TestId() {
    const reload = useSelector(s=>s.reload);
    const {testId} = useParams();
    const formQuestion = useRef();
    const [post, addLoader] = usePost();
    const [data, get, loader] = useGetDynamic();
    const dispatch = useDispatch();
    useEffect(()=>{
        get(`${GET_ONE_IQ_TEST}${testId}`);
    },[testId,reload]);
    const onFinish = (v)=>{
        v.files = v.files.fileList.map(v=> {return {file_id: v.response.id}});
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
        post(`${ADD_IQ_TEST_QUESTION}${testId}/add_questions/`,v,()=>{
            formQuestion.current.resetFields()
            dispatch({
                type: 'reload',
                payload: Math.random()
            });
        });
    }
    return(
        <Card>
            {
                loader ?
                    <Loader/>
                    :
                Object.keys(data).length ?
                <div>
                    <h1 className="mb-3">
                        Test nomi: <strong>{data.name}</strong>
                    </h1>
                    <Form
                        layout="vertical"
                        ref={formQuestion}
                        name='question'
                        onFinish={onFinish}
                    >
                        <QuestionFormItem/>
                        <Form.Item className="text-right">
                            <Link to={'/dashboard/iq-test'} className="mr-5 ant-btn-link-danger">
                                Ortga qaytish
                            </Link>
                            <Button disabled={addLoader} htmlType="submit" type='primary'>
                                <IconSave/> Saqlash
                            </Button>
                        </Form.Item>
                    </Form>
                    <ListQuestions questions={data.questions} />
                </div>:
                    <NoData isBack={'/dashboard/iq-test'} size="sm" message="Siz qo'shmoqchi bo'lgan test bo'yicha ma'lumotlar topilmadi!"/>
            }
        </Card>
    )
}
const Loader = ()=>{
    return(
        <Row gutter={32}>
            <Col span={8}>
                <Skeleton active/>
            </Col>
            <Col span={8}>
                <Skeleton active/>
            </Col>
            <Col span={8}>
                <Skeleton active/>
            </Col>
        </Row>
    )
}
export default TestId;