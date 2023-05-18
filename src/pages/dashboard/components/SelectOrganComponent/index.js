import {Card, Col, Row, Skeleton} from "antd";
import Style from "styled-components";
import {useDispatch} from "react-redux";
import {SELECT_ORGANISATION} from "../../../../store/types";
import Req from "../../../../store/api";
import {useNavigate} from "react-router-dom";


const H1 = Style.h1`
    font-weight: 600;
    font-size: 24px;
    margin: 0;
`
const H2 = Style.h2`
    font-weight: 600;
    font-size: 18px;
    margin:0;
`
function SelectOrganComponent({user = null}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const onChooseOrganisation = (organ)=>{
        Req({
            type: SELECT_ORGANISATION,
            data: {
                organization_id: organ.id
            }
        }).then(res=>{
            dispatch({
                type: 'activeOrganisation',
                payload: organ
            })
        }).catch(err=>{
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
    }
    return  <Card>
                {
                    user && Object.keys(user).length ?
                    <div>
                        <H1>Iltimos tashkilotni tanlang</H1>
                        <p>
                            Sizning akkaunt bir nechta tashkilotda HR lik vazifasini bajaradi.
                            Shu sababli qaysi tashkilot nomidan ish yuritishingiz kerakligini tanlang!
                        </p>
                        <Row gutter={16} className="pb-4">
                            {
                                user.organizations?.map((organ)=>{
                                    return  <Col span={8} key={`organization${organ.id}`}>
                                                <Card style={{height: '100%'}} onClick={()=>onChooseOrganisation(organ)} className="organisation-card cursor-pointer my-3">
                                                    <H2>{organ.name}</H2>
                                                    <p>STIR: {organ.organization_tin}</p>
                                                </Card>
                                            </Col>
                                })
                            }
                        </Row>
                    </div>:
                    <Skeleton active paragraph={{rows: 5}}/>
                }
            </Card>
}
export default SelectOrganComponent;