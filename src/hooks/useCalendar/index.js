import {useEffect, useMemo, useState} from "react";
import Req from "../../store/api";
import {GET_DAY_OFF, GET_TABLE_STATISTIC} from "../../store/types";
import {useDispatch} from "react-redux";
import { Col, Row} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import Style from "styled-components";

const Badge = Style.span`
    display: inline-block;
    background-color: ${p=>p.bc};
    border-radius:10px;
    color: #fff;
    height: 18px;
    min-width: 18px;
    line-height: 18px;
    text-align: center;
    vertical-align: middle;
    font-size: 12px;
    padding: 0 .2rem;
`
export function useDayOff(year = null,month = null){
    const dispatch = useDispatch();
    const [data,setData] = useState([]);
    const [loader,setLoader] = useState(false);
    useEffect(()=>{
        setLoader(true)
        Req({
            type: GET_DAY_OFF,
            query: {year,month}
        }).then(res=>{
            let resDate = res.data.vacations;
            resDate = resDate.map(item=> item.day);
            setData(resDate);
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
    },[year,month]);
    return {
        data,
        loader
    };
}
export function useCalendarStatistic(year= null, month = null){
    const [data,setData] = useState({
        data: {},
        loader: false,
    });
    useEffect(()=>{
        setData({
            ...data,loader: true
        })
        Req({
            type: GET_TABLE_STATISTIC,
            query: {
                year: year ,
                month: month
            }
        }).then(res=>{
            setData({
                loader: false,
                data: res.data
            })
        }).catch(err=>{
            setData({
                loader: false,
                data: []
            });
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
    },[year,month]);
    const content = useMemo(()=>{
        const statistic = data.data;
        const {total = {}} = statistic;
        return  <Row gutter={16}>
                    <Col>
                        Jami kelganlar: { data.loader ? <LoadingOutlined />: <Badge bc="#52c41a">{total['C']}</Badge>  }
                    </Col>
                    <Col>
                        Jami ishga chiqmaganlar: { data.loader ? <LoadingOutlined />: <Badge bc="#f5222d">{total['CH']}</Badge>}
                    </Col>
                    <Col>
                        Jami xizmat safarlari: { data.loader ? <LoadingOutlined />: <Badge bc="#13c2c2">{total['X']}</Badge>}
                    </Col>
                    <Col>
                        Jami bemorlik: { data.loader ? <LoadingOutlined />: <Badge bc="#fa8c16">{total['K']}</Badge>}
                    </Col>
                    <Col>
                        Jami mexnat tatillari: { data.loader ? <LoadingOutlined />: <Badge bc="#2f54eb">{total['MT']}</Badge>}
                    </Col>
                    <Col>
                        Jami o'quv tatillari: { data.loader ? <LoadingOutlined />: <Badge bc="#a0d911">{total['U']}</Badge>}
                    </Col>
                    <Col>
                        Jami pulsiz tatillari: { data.loader ? <LoadingOutlined />: <Badge bc="#1890ff">{total['PT']}</Badge>}
                    </Col>
                </Row>
    },[data]);
    return [data,content];
}