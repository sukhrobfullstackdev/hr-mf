import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Col, Form, Input, Row, Skeleton } from "antd";

import Container from "../../../../../components/Container";
import { GET_APPEAL_TEMPLATE, ADD_APPEAL } from "../../../../../store/types";
import Req from "../../../../../store/api";

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
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: "Hatolik, qayta urinib ko'ring!"
          }
        })
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
      {
        loader ? <Skeleton active /> :
          <Row justify={"center"}>
            <Col span={16}>
              <Row justify="end">
                <Col span={8}>
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
                <div className="text-center my-4">
                  <Button htmlType="submit" type="primary">
                    Yuborish
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
      }
    </Container>
  )
}
export default CabinetAppeal;