import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Form, Input, Modal, Row, Steps,} from 'antd';
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";
import StepThree from "./components/StepThree";
import Container from "../../components/Container";
import {Link, useOutlet, Outlet, useNavigate} from "react-router-dom";
import {IconCheckMark, IconClose} from "../../components/Icon";
import axios from "axios";

const {Step} = Steps;

function Survey() {
    const outlet = useOutlet();
    const navigate = useNavigate();
    const [visible,setVisible]= useState(false);
    const current = useSelector(s => s.surveyCurrent || 0);
    const onFinish=(v)=>{
        navigate(`/survey/${v.key}`);
    }
    return (
        outlet ?
            <Outlet/> :
            <Container className="py-5">
                <Row align="middle" justify="space-between" className="mb-3">
                    <Col span={12}>
                        <h1>
                            So'rovnoma
                        </h1>
                    </Col>
                    <Col span={12} className="text-right">
                        <Button type="primary" onClick={()=>setVisible(true)}>
                            <IconCheckMark/> Holatni tekshirsh
                        </Button>
                    </Col>
                </Row>
                <Steps current={current}>
                    <Step title={`O'zi haqida`}/>
                    <Step title={`Yaqin qarindoshlik`}/>
                    <Step title={`Faoliyat`}/>
                </Steps>
                <div className="steps-content py-5">
                    {
                        current === 0 ?
                            <StepOne/> :
                            current === 1 ?
                                <StepTwo/> :
                                <StepThree/>
                    }
                </div>
                <div>
                    <Link to={"/"}>
                        Tizimga kirish
                    </Link>
                </div>
                <Modal title="Holatni tekshirish" visible={visible} footer={null} onCancel={()=>setVisible(false)}>
                    <Form
                        onFinish={onFinish}
                        name="checkSurveyForm"
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Iltimos to'ldiring!"
                                }
                            ]}
                            name="key">
                            <Input placeholder="Oldindan olgan ma'lumot kodini kiriting"/>
                        </Form.Item>
                        <Row>
                            <Col span={12}>
                                <Button type="danger">
                                    <IconClose/> Bekor qilish
                                </Button>
                            </Col>
                            <Col span={12} className="text-right">
                                <Button htmlType="submit" type="primary">
                                    <IconCheckMark/> Tekshirish
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal>
            </Container>
    )
}
export default Survey;