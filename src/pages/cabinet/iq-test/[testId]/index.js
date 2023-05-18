import {Link, useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Form, Radio, Row, Skeleton, Steps, Tooltip} from "antd";
import {useEffect, useMemo, useRef, useState} from "react";
import {ADD_IQ_TEST_QUESTION, GET_ONE_IQ_TEST} from "../../../../store/types";
import Small from "../../../../styleComponents/Small";
import {IconCheckMark, IconChevronLeft, IconChevronRight, IconSave} from "../../../../components/Icon";
import useRandomSort from "../../../../hooks/useRandomSort";
import Req from "../../../../store/api";
import {useDispatch, useSelector} from "react-redux";
import usePost from "../../../../hooks/usePost";
import Style from "styled-components";

function CabinetTestId(){
    const {testId} = useParams();
    const [loader,setLoader] = useState(false);
    const [iqTest,setIqTest] = useState([]);
    useEffect(()=>{
        setLoader(true)
        Req({
            type: `${GET_ONE_IQ_TEST}${testId}`
        })
        .then(res=>{
            setIqTest(res.data);
        })
            .finally(()=>{
                setLoader(false)
            })
    },[]);
    return(
        <Card>
            {
                loader ?
                    <Skeleton active/> :
                    Object.keys(iqTest).length ?
                       <IqTest iqTest={iqTest}/> : 'Test'
            }
            <TheTopUsers id={testId}/>
        </Card>
    )
}
const IqTest = ({iqTest})=>{
    const isStart = useSelector(s => s.isStart || false);
    const dispatch = useDispatch();
    const onStart = ()=>{
        dispatch({
            type: 'iqTestUserAnswers',
            payload: []
        });
        dispatch({
            type: 'isStart',
            payload: true
        })
    }
    return(
        <div>
            <Row gutter={16} justify="space-between" align={"middle"} className="border-bottom"
            >
                <Col span={12}>
                    <strong>{iqTest.name}</strong>
                    <Small className="text-muted">
                        Test nomi
                    </Small>
                </Col>
                <Col span={4} className="text-right">
                    <strong>{iqTest?.questions?.length}</strong>
                    <Small className="text-muted">
                        Jami savollar soni
                    </Small>
                </Col>
                <Col span={5} className="text-right">
                    <Timer duration={iqTest.duration}/>
                    <Small className="text-muted">
                        Test uchun belgilangan vaqt
                    </Small>
                </Col>
                <Col span={3} className="text-right">
                    {
                        isStart ?
                            <span className="app-status-badge">
                                Test boshlandi
                            </span>
                            :
                            <>
                                <Button size='small' type='primary' onClick={onStart}>Boshlash</Button>
                            </>
                    }
                </Col>
            </Row>
            {
                isStart?
                    <IqTestContent questions={iqTest.questions}/>:
                    <div className="py-5 mt-3 rounded text-center text-muted" style={{backgroundColor: '#f1f1f1'}}>
                        Testni boshlash uchun "Boshlash" tugmasini bosing!
                        <p className="py-2">
                            <Link to={'/cabinet/iq-test'}>
                                <IconChevronLeft/> Ortga qaytish
                            </Link>
                        </p>
                    </div>
            }
        </div>
    )
}
const Timer = ({duration})=>{
    const isStart = useSelector(s => s.isStart || false);
    const [min,setMin] = useState(duration);
    const [sek,setSek] = useState(0);
    const timer = useRef();
    useEffect(()=>{
        if(isStart && min > 0){
            timer.current = setTimeout(()=>{
                if(sek > 0){
                    setSek(sek-1);
                }else{
                    setMin(min-1);
                    setSek(59);
                }
            },1000);
        }
        if(!isStart && timer.current){
            clearTimeout(timer.current);
        }
        return ()=>{
            if(timer.current){
                clearTimeout(timer.current);
            }
        }
    },[isStart,sek]);
    return (
        <div className="text-right">
            <strong>{min > 9 ? min : `0${min}`}:{sek > 9 ? sek : `0${sek}`}</strong>
        </div>
    )
}
const TheTopUsers = ({id})=>{
   const [iqTestRate,setIqTestRate] = useState([]);
   const [loader,setLoader] = useState(false);
   const [count,setCount] = useState(false);
   const navigate = useNavigate();
   const dispatch = useDispatch();
    useEffect(()=>{
        setLoader(true)
       Req({
           type: `${GET_ONE_IQ_TEST}${id}/info_statistics/`,
       })
           .then(res=>{
               setIqTestRate(res.data.results);
               setCount(res.data.count);
           })
           .catch(err=>{
               const {data,status} = err.response;
               if(status < 500){
                   dispatch({
                       type: 'toast',
                       payload: {
                           type: 'error',
                           message: data?.message
                       }
                   });
                   if(status === 401 || status === '401'){
                       localStorage.removeItem('token');
                       dispatch({
                           type: 'isUser',
                           payload: null
                       });
                       navigate('/login')
                   }
               }else{
                   dispatch({
                       type: 'toast',
                       payload: {
                           type: 'error',
                           message: "Tizim hatoligi qayta urinib ko'ring!"
                       }
                   });
               }
           })
           .finally(()=>{
               setLoader(false)
           })
    },[]);
    return(
        <div>
            {
                loader ?
                    <Skeleton
                        active
                        avatar
                        paragraph={{
                            rows: 0,
                        }}
                    />:
                    iqTestRate.length ?
                        <DivAvatarBlock>
                            {
                                iqTestRate.map((item,i)=>{
                                    return(
                                        <Tooltip title={
                                            <span className="text-capitalize small">
                                                {item.user.full_name.toLowerCase()}, {item.ball}%
                                            </span>
                                        }>
                                            <DivAvatar style={{zIndex: count - i, left: `${i*25}px`}} key={`userAvatar${item.id}`}>
                                                {
                                                    item.user.image ?
                                                        <img className="w-100" src={item.user.image} alt=""/>:
                                                        item.user.full_name.substring(0,1)
                                                }
                                            </DivAvatar>
                                        </Tooltip>
                                    )
                                })
                            }
                            {
                                count - iqTestRate.length ?
                                    <Tooltip title={'Jami testni yechganlar!'}>
                                        <DivAvatar style={{zIndex: iqTestRate.length, left: `${iqTestRate.length*28}px`, border: 'none'}}>
                                            <div>
                                                +<strong>
                                                {count - iqTestRate.length}
                                            </strong>
                                            </div>
                                        </DivAvatar>
                                    </Tooltip> :''
                            }
                        </DivAvatarBlock>
                        :''
            }
        </div>
    )
}

const DivAvatarBlock = Style.div`
    width: 100%;
    position: relative;
    display: flex;
    align-items: center;
    margin: 1rem 0;
    height: 45px;
`
const DivAvatar = Style.div`
    position: absolute;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    overflow: hidden;
    border: 3px solid #f1f1f1;
    background-color: #2842C8;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    
`

const {Step} = Steps;
function IqTestContent({questions = []}){
    const navigate = useNavigate()
    const {testId} = useParams();
    const [post,loader] = usePost();
    const dispatch = useDispatch();
    const iqTestStep = useSelector(s=>s.iqTestStep || 0);
    const iqTestUserAnswers = useSelector(s=>s.iqTestUserAnswers || []);
    const [test,setTest] = useState([]);
    const [sort,sorted] = useRandomSort();
    useEffect(()=>{
        if(sorted.length){
            const randomTestArray = sorted.map(id=> {
                return questions.find(question => question.id === id);
            })
            setTest(randomTestArray);
        }
    },[sorted])
    useEffect(()=>{
        if(questions.length){
            const arrayIdsOfQuestions = questions.map(v=> v.id);
            sort(arrayIdsOfQuestions)
        }
    },[questions]);
    const onSetStep=(index)=>{
       dispatch({
           type: 'iqTestStep',
           payload: index
       })
    }
    const onEndTest = ()=>{
        if(iqTestUserAnswers.length === questions.length){
            post(`${ADD_IQ_TEST_QUESTION}${testId}/upload_answers/`,{
                answers:iqTestUserAnswers
            },()=>{
                dispatch({
                    type: 'iqTestStep',
                    payload: 0
                });
                dispatch({
                    type: 'iqTestUserAnswers',
                    payload: []
                })
                dispatch({
                    type: 'isStart',
                    payload: false
                })
                navigate('/cabinet/iq-test')
            });
        }else{
            dispatch({
                type: 'iqTestStep',
                payload: 0
            })
        }
    }
    return(
        <div className="py-4">
            {
                iqTestStep >= questions.length ?
                    <div className="py-5 text-center">
                        <h4 className="w-50 mx-auto mb-3 text-muted">
                            Siz barcha savollarga javob berdingiz.
                            Test berilgan javobni saqalash uchun "Testni yakunlash" tugmasini bosing
                        </h4>
                       <Button disabled={loader} type="primary" onClick={onEndTest}>
                           <IconSave/> Testni yakunlash
                       </Button>
                    </div>
                    :
                    <>
                        <Test setStep={onSetStep} step={iqTestStep} question={test[iqTestStep]}/>
                        <Row justify="space-between" className="my-3">
                            <Col>
                                <Button disabled={iqTestStep <= 0 } size="small" type="primary" onClick={()=>onSetStep(iqTestStep-1)}>
                                    <IconChevronLeft/> Oldingisi
                                </Button>
                            </Col>
                            <Col span={20}>
                                <Steps progressDot current={iqTestStep}>
                                    {
                                        questions.map((item,i)=>{
                                            return(
                                                <Step key={`iqTestQuestion${item.id}`} title={i+1} />
                                            )
                                        })
                                    }
                                </Steps>
                            </Col>
                            <Col>
                                <Button disabled={iqTestStep >= questions.length -1 } size="small" type="primary" onClick={()=>onSetStep(iqTestStep+1)}>
                                    Keyingisi <IconChevronRight/>
                                </Button>
                            </Col>
                        </Row>
                    </>

            }
        </div>
    )
}
function Test({question = {},setStep,step}){
    const dispatch = useDispatch();
    const iqTestUserAnswers = useSelector(s=>s.iqTestUserAnswers||[]);
    const [answer,setAnswer] = useState([]);
    const [variant,setVariant] = useState(['A','B','C','D']);
    const [active,setActive] = useState(null)
    const [sort,sorted] = useRandomSort();
    useEffect(()=>{
        if('choices' in question){
            const arrayIdsOfChoices = question.choices.map(v=> v.id);
            sort(arrayIdsOfChoices);
        }
    },[question]);
    useEffect(()=>{
        if(sorted.length){
            const randomTestArray = sorted.map(id=> {
                return question.choices.find(choice => choice.id === id);
            });
            setAnswer(randomTestArray);
        }
    },[sorted]);
    const onSetActive = (v)=>{
        setActive(v.target.value);
    }
    const onFinish = (v)=>{
        const userAnswer = iqTestUserAnswers;
        userAnswer.push({
            "question_id": question.id,
            "choice_id": v.answer
        })
        dispatch({
            type: 'iqTestUserAnswers',
            payload: userAnswer
        });
        setStep(step+1);
    }
    const form = useMemo(()=>{
        let isDisabled = false;
        if(iqTestUserAnswers.length){
            const a = iqTestUserAnswers.find(v=>v.question_id === question.id);
            isDisabled = a ? true : false;
        }
        return(
            <Form
                disabled={isDisabled}
                name="questionForm"
                layout="vertical"
                onFinish={onFinish}
            >
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: "Iltimos variantlardan birini tanlang!"
                        }
                    ]}
                    name="answer"
                >
                    <Radio.Group onChange={onSetActive} style={{width: '100%'}}>
                        {
                            answer.map((item,i)=>{
                                return(
                                    <div data-item={item.id} data-active={active} style={{backgroundColor: active === item.id ? 'rgba(40,66,200,0.4)': `#f1f1f1`}} key={`iqTestAnswer${item.id}`} className="p-2 rounded mb-2">
                                        <Radio value={item.id}>
                                            {variant[i]}. {item.text}
                                        </Radio>
                                    </div>
                                )
                            })
                        }
                    </Radio.Group>
                </Form.Item>
                <Form.Item>
                    <Button disabled={isDisabled} htmlType="submit" size="small" type="primary">
                        <IconCheckMark/> Javob berish
                    </Button>
                </Form.Item>
            </Form>
        )
    },[question,answer,active,iqTestUserAnswers,step]);
    return(
        <div>
            <h4>
                Savol: <strong>{question.text}</strong>
            </h4>
            {
                form
            }
        </div>
    )
}
export default CabinetTestId;