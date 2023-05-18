import {Card, Col, Collapse, Row, Skeleton} from "antd";
import Small from "../../../../styleComponents/Small";
import useJobHistory from "../../../../hooks/useJobHstory";
import UserJobList from "../../../../components/UserJobList";
import {useEffect} from "react";

const Template = ({item = {}})=>{
    return  <Card className="mb-3">
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="mb-2 border-bottom">
                            <Small className="text-muted">Tashkilot nomi</Small>
                            <Small case={'uppercase'} className='py-1'>
                                <strong>{item.company_name}</strong>
                            </Small>
                        </div>
                        <div className="mb-2 border-bottom">
                            <Small className="text-muted">Lavozim</Small>
                            <Small case={'uppercase'} className='py-1'>
                                <strong>{item.position_name}</strong>
                            </Small>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="mb-2 border-bottom">
                            <Small className="text-muted">Ish boshlash sanasi</Small>
                            <Small className='py-1'>
                                <strong>{new Date(item.start_date).toLocaleDateString()}</strong>
                            </Small>
                        </div>
                        <div className="mb-2 border-bottom">
                            <Small className="text-muted">Ish tugatish sanasi</Small>
                            <Small className='py-1'>
                                <strong>
                                    {
                                        item.end_date ?  new Date(item.end_date).toLocaleDateString() :'Bu kungacha'
                                    }
                               </strong>
                            </Small>
                        </div>
                    </Col>
                </Row>
            </Card>
}

const {Panel} = Collapse

function HeaderInfo({company,start_d,end_d = null}) {
    return  <Row style={{width: '100%'}}>
                <Col span={16}>
                    {company}
                </Col>
                <Col span={8} className="text-right">
                    {
                        new Date(start_d).toLocaleDateString()
                    }
                     -
                    {
                        end_d ?  new Date(end_d).toLocaleDateString() : 'Bu kungacha'

                    }
                </Col>
            </Row>;
}

function UserJob({user = {}}){
    const {jobs,loader} =useJobHistory();
    return   loader ?
        <Skeleton active/>
        :
        <UserJobList position={jobs}/>
}
export default UserJob;