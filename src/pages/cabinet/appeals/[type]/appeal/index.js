import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {useParams, useNavigate, Link} from "react-router-dom";
import {Button, Card, Col, Form, Input, Row, Skeleton} from "antd";

import Container from "../../../../../components/Container";
import { GET_APPEAL_TEMPLATE, ADD_APPEAL } from "../../../../../store/types";
import Req from "../../../../../store/api";
import Blank from "../../../../../components/Blank";
import {IconArrowLeftFill, IconChevronLeft} from "../../../../../components/Icon";

function CabinetAppeal() {
  const { type } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loader, setLoader] = useState(true);
  const [item, setItem] = useState({});

  useEffect(() => {
    Req({
      type: GET_APPEAL_TEMPLATE,
      data: {
        type
      }
    })
      .then(res => setItem(res.data))
      .catch(err => {
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
      .finally(() => setLoader(false));
  }, [dispatch, type]);
  const onSend = (v) => {
    setLoader(true)
    Req({
      type: ADD_APPEAL,
      data: {
        ...v,
        top: item?.top,
        type
      }
    }).then(res => {
      dispatch({
        type: 'toast',
        payload: {
          type: 'success',
          message: "Arizangiz qabul qilindi!"
        }
      });
      navigate('/cabinet/appeals')
    }).catch(err => {
      dispatch({
        type: 'toast',
        payload: {
          type: 'error',
          message: "Hatolik! Qayta urinib ko'riung!"
        }
      })
    }).finally(() => {
      setLoader(false)
    })
  }

  return (
    <Container className="py-5">
      <Card>
        <Blank title='Ariza'>
          {
            loader ? <Skeleton active /> :
                <Row justify={"center"}>
                  <Col span={24}>
                    <Row justify="end" className="text-justify">
                      <Col span={6}>
                        {
                          item?.top
                        }
                      </Col>
                    </Row>
                    <h1 className="text-center my-4">
                      {item?.title}
                    </h1>
                    <Form
                        name="userappeal"
                        onFinish={onSend}
                        initialValues={{
                          text: item?.body
                        }}
                        layout={"vertical"}
                    >
                      <Form.Item
                          name="text"
                      >
                        <Input.TextArea style={{ lineHeight: '32px', minHeight: '200px' }} placeholder="Ariza mazmuni" />
                      </Form.Item>

                      <p className="mt-5 text-muted">
                        Sana: {new Date(Date.now()).toLocaleDateString()}
                      </p>
                      <div className="text-right my-4">
                        <Link to={"/cabinet/appeals"} className="mr-3">
                          <IconChevronLeft/> Qaytish
                        </Link>
                        <Button htmlType="submit" type="primary">
                          Yuborish
                        </Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
          }
        </Blank>
      </Card>
    </Container>
  )
}
export default CabinetAppeal;