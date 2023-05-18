import Style from 'styled-components';
import {Col, Divider, Row} from "antd";
import LoginForm from "./components/LoginForm";
import OneId from "./components/OneId";
import Ekey from "./components/Ekey";
import {useEffect} from "react";
import {USER_ME} from "../../store/types";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";
import MfId from "./components/MfId";

const LoginWrapper = Style.div`
    width: 100%;
    height: 100vh;
`
const LoginBackground = Style.div`
    height: 100%;
    width: 100%;
    background-image: url(/images/login.svg), linear-gradient(180deg, #2943C9 0%, #4662E9 100%);
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50%, 100%;
`
const LoginCard = Style.div`
    height: 100vh;
    overflow: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 0 40px rgba(0,0,0,0.25);
    padding: 1rem 8rem;
    background-color: #fff;
     @media (max-width: 768px) {
        padding: 1rem 4rem;
     }
     @media (max-width: 490px) {
        padding: 1rem 1rem;
        overflow: visible;
        height: auto;
        box-shadow:none;
     }
`
const Title = Style.h1`
    font-size: 26px;
    text-align: center;
    font-weight: bold;
    margin: 0;
    line-height: 39px;
    color: #333333;
    opacity: .83;
`
const SubTitle = Style.p`
    color: #333333;
    text-align: center;
    font-size: 24px;
    line-height: 36px;
`
function Login(props){
    const dispatch = useDispatch();
    useEffect(()=>{
        const token = localStorage.getItem('token');
        const isStaffList = localStorage.getItem('isStaffList');
        if(token && token !== undefined && !isStaffList){
            dispatch({
                type: USER_ME,
                payload: {
                    loginPage: true
                }
            })
        }else{
            localStorage.removeItem('token');
        }
        localStorage.removeItem('isStaffList');
    },[]);
    return  <LoginWrapper>
                <Row justify='end'>
                    <Col sm={24} md={8} xxl={12}>
                        <LoginBackground className="p-5">
                            <img src="/images/logo_w.svg" alt="Logo" className="my-5 mx-3"/>
                        </LoginBackground>
                    </Col>
                    <Col sm={24} md={16} xxl={12}>
                        <LoginCard>
                            <p className="text-silver mb-0">
                                <Title>
                                    O'zbekiston Respublikasi Moliya Vazirligi
                                </Title>
                            </p>
                            <SubTitle className="text-center">
                                <strong>HR</strong> tizimiga kirish
                            </SubTitle>
                            <LoginForm/>
                            <Divider plain className="mt-5">
                                Boshqa tizimlar orqali kiring
                            </Divider>
                            <Row gutter={16} style={{padding: '1rem 0'}}>
                                <Col xs={8} md={8} xxl={8}>
                                    <OneId/>
                                </Col>
                                <Col xs={8} md={8} xxl={8}>
                                    <MfId/>
                                </Col>
                                <Col xs={8} md={8} xxl={8}>
                                    <Ekey/>
                                </Col>
                            </Row>
                            <Row className="mt-3">
                                <Col span={24}>
                                    <Link to="/survey" className="text-muted small">
                                        Ishga qabul uchun murojaat topshirish yoki holatni tekshirish
                                    </Link>
                                </Col>
                            </Row>
                        </LoginCard>
                    </Col>
                </Row>
            </LoginWrapper>
}
export default Login;