import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button, Card, Col, Form, Input, Row, Skeleton} from "antd";

import Container from "../../../../../components/Container";
import {CHECK_APPEAL_STATUS_BY_HR, GET_APPEAL_HR} from "../../../../../store/types";
import Req from "../../../../../store/api";
import Blank from "../../../../../components/Blank";

function CabinetAppeal() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(true);
  const [item, setItem] = useState({});
  useEffect(() => {
    Req({
      type: `${GET_APPEAL_HR}${id}`,
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
  }, [dispatch, id]);
  const onSend = (v) => {
    setLoader(true);
    Req({
      type: `${CHECK_APPEAL_STATUS_BY_HR}${id}/`,
      data: {
        ...v,
        top: item?.top,
        middle: item?.middle,
        type: item.type
      }
    }).then(res => {
      dispatch({
        type: 'toast',
        payload: {
          type: 'success',
          message: "Arizangiz qabul qilindi!"
        }
      });
      navigate('/cabinet/appeals');
    }).catch(err => {
      dispatch({
        type: 'toast',
        payload: {
          type: 'error',
          message: "Hatolik! Qayta urinib ko'riung!"
        }
      })
    }).finally(() => {
      setLoader(false);
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
                      <Row justify="end">
                        <Col span={6} className="text-justify my-5">
                          {
                            item?.top
                          }
                        </Col>
                      </Row>
                      <h1 className="text-center my-4">
                        {item?.middle}
                      </h1>
                      <Form
                          name="userappeal"
                          onFinish={onSend}
                          initialValues={{
                            text: item?.text
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
          </Blank>
        </Card>
      </Container>
  )
}
export default CabinetAppeal;