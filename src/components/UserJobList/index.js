import {Col, Row} from "antd";
import Small from "../../styleComponents/Small";
import {useEffect, useState} from "react";

function UserJobList({position}){
    const [positionHistory,setPositionHistory] = useState([]);
    useEffect(()=>{
        if(position && 'result' in position
            && 'data' in position.result && 'experiences' in position.result.data
            && position.result.data.experiences && position.result.data.experiences.length){
            const userPositionIsSort = position.result.data.experiences.sort((a,b)=>{
                return new Date(b.start_date) - new Date(a.start_date)
            })
            setPositionHistory(userPositionIsSort)
        }
    },[position]);
    return(
        <Row>
            <Col span={24}>
                <h3 className="mb-4">
                    <strong>
                        Hodim mehnat faoliyati
                    </strong>
                </h3>
                {
                    positionHistory.map(item=>{
                        return(
                            <Row key={`itemuserpositionhistory${item.transaction_id}`} gutter={16} className="border-bottom mb-3">
                                <Col span={8}>
                                    <Small className="text-muted">
                                        <strong>Tashkilot-korxona nomi</strong>
                                    </Small>
                                    {item.company_name}
                                </Col>
                                <Col span={8}>
                                    <Small className="text-muted">
                                        <strong>Egallagan lavozimi</strong>
                                    </Small>
                                    {item.position_name}
                                </Col>
                                <Col span={4}>
                                    <Small className="text-muted">
                                        <strong>Ish boshlagan sana</strong>
                                    </Small>
                                    {item.start_date}
                                </Col>
                                <Col span={4}>
                                    <Small className="text-muted">
                                        <strong>Ish tugatgan sana</strong>
                                    </Small>
                                    {item.end_date ? item.end_date : 'Hozirdagi ish joyi'}
                                </Col>
                            </Row>

                        )
                    })
                }
            </Col>
        </Row>
    )
}
export default UserJobList