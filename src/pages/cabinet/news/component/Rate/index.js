import {useEffect, useState} from "react";
import BlockLoader from "../../../../../components/Loader/BlockLoader";
import {Col, Row} from "antd";
import {IconArrowDown, IconArrowUp} from "../../../../../components/Icon";
import Req from "../../../../../store/api";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

function RateItem({rate = {}}){
    return  <Row align='middle' className="border-bottom mt-2">
                <Col span={3}>
                    <img src={`/images/icon/${rate.Ccy === 'CNY' ? 'JPY': rate.Ccy}.svg`} alt={rate.Ccy}/>
                </Col>
                <Col span={14}>
                    <p className="m-0">
                        <strong>{rate.Ccy}</strong>
                    </p>
                    <p className="text-muted m-0">
                        {rate.CcyNm_UZ}
                    </p>
                </Col>
                <Col span={7} className='text-right'>
                    <p className="m-0">
                        <strong>{rate.Rate}</strong>
                    </p>
                    <p className={`text-muted m-0 ${rate.Diff > 0 ? 'text-success' : 'text-danger'}`}>
                        {
                            rate.Diff > 0 ?<IconArrowUp/> : <IconArrowDown/>
                        }
                        {Math.abs(rate.Diff)}
                    </p>
                </Col>
            </Row>
}
function Rate(){
    const [rate, setRate] = useState([]);
    const [loader,setLoader] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(()=>{
        setLoader(true);
        Req({
            type: 'get user/currency/'
        }).then(res=>{
            const r = res.data.filter(v=> v.Ccy === 'USD' || v.Ccy === 'RUB' || v.Ccy === 'EUR' || v.Ccy === 'JPY' || v.Ccy === 'GBP' || v.Ccy === 'CNY' || v.Ccy === 'TRY');
            setRate(r);
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
        }).finally(()=>{
            setLoader(false);
        })
    },[]);
    return  loader ?
                <div>
                    <BlockLoader className="mt-2"/>
                    <BlockLoader className="mt-2"/>
                    <BlockLoader className="mt-2"/>
                </div>:
                rate.map(item=>{
                    return <RateItem rate={item} key={`rate${item.Ccy}`}/>
                })
}
export default Rate;