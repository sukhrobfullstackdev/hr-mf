import {Button, Col, Collapse, Row} from "antd";
import CollapsePanel from "antd/es/collapse/CollapsePanel";
import {IconEdit, IconTrash} from "../../../../../components/Icon";
import {Link, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

function ListQuestions({questions = []}){
    return(
        questions.length ?
            <div>
                <div className="py-3 text-muted">
                    <strong>Hozirda mavjud savollar</strong>
                </div>
                <Collapse accordion className="border-bottom mb-4">
                    {
                        questions.map((item,index)=>{
                            return(
                                <CollapsePanel className="border"
                                   header={<Title item={item} index={index}/>}
                                   key={`qusetionPanel${item.id}`}
                                >
                                    <ContentPaneQuestion item={item} index={index}/>
                                </CollapsePanel>
                            )
                        })
                    }
                </Collapse>
            </div> : null
    )
}
const Title = ({item,index})=>{
    return(
        <Row align="middle">
            <Col span={24}>
                <span className="text-muted">Savol N:{index+1}. </span> {item.text}
            </Col>
        </Row>
    )
}
const ContentPaneQuestion = ({item})=>{
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const onSetQuestion = ()=>{
        let a = item.choices.map((v,index)=>v.is_true ? index : null).join('');
        if(a==='0'){
            a = 'A'
        }
        if(a==='1'){
            a = 'B'
        }
        if(a==='2'){
            a='C'
        }
        if(a==='3'){
            a= "D"
        }
        dispatch({
            type: 'editedQuestion',
            payload: {
                ...item,
                text: item.text,
                aKey: item.choices[0].text,
                bKey: item.choices[1].text,
                cKey: item.choices[2].text,
                dKey: item.choices[3].text,
                isAnswer: a
            }
        })
        navigate(`/dashboard/iq-test/${item.id}`);
    }
    return(
        <Row gutter={12}>
            {
                item.choices.map((ch,chI)=>{
                    return(
                        <Col key={`choices${ch.id}`} span={12}>
                            <div className="bg-weight rounded p-2 mb-2">
                                <span className="text-muted">Javob {chI+1}. </span> {ch.text}
                            </div>
                        </Col>
                    )
                })
            }
            <Col span={24} className="text-right">
                <Button type="danger"  title="O'chirish" className="p-2 mr-2">
                    <IconTrash/>
                </Button>
                <Button onClick={onSetQuestion} type="primary" title="Taxrirlash" className=" p-2 mr-2">
                    <IconEdit/>
                </Button>
            </Col>
        </Row>
    )
}
export default ListQuestions;