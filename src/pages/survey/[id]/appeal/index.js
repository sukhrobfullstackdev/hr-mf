import Container from "../../../../components/Container";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { ADD_APPEAL, GET_APPEAL_TEMPLATE } from "../../../../store/types";
import Req from "../../../../store/api";
import {Link, useNavigate, useParams} from "react-router-dom";
import { Button, Col, Form, Input, Row, Skeleton } from "antd";
import Blank from "../../../../components/Blank";
import {IconChevronLeft} from "../../../../components/Icon";

function SurveyAppeal() {
  const { id } = useParams();
  const userAppeal = useSelector(s => s.userAppeal || {});
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (!Object.keys(userAppeal).length) {
      setLoader(true)
      Req({
        type: GET_APPEAL_TEMPLATE,
        data: {
          survey_id: id,
          type: 'employment'
        }
      }).then(res => {
        dispatch({
          type: 'userAppeal',
          payload: res.data
        });
      }).catch(err => {
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: "Hatolik! Qayta urunib ko'ring!"
          }
        })
        navigate('/survey');
      }).finally(() => {
        setLoader(false)
      })
    }
  }, []);
  const onSend = (v) => {
    setLoader(true)
    Req({
      type: ADD_APPEAL,
      data: {
        ...v,
        survey: id,
        type: "employment",
        top: userAppeal.top
      }
    }).then(res => {
      dispatch({
        type: 'toast',
        payload: {
          type: 'success',
          message: "Arizangiz qabul qilindi!"
        }
      });
      navigate('/');
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
      <Blank>
        {
          loader ? <Skeleton active /> :
              <Row justify={"center"}>
                <Col span={24}>
                  <Row justify="end">
                    <Col span={8} className="pt-4">
                      {
                        userAppeal.top
                      }
                    </Col>
                  </Row>
                  <h1 className="text-center my-4">
                    {userAppeal.title}
                  </h1>
                  <Form
                      name="userappeal"
                      onFinish={onSend}
                      initialValues={{
                        text: userAppeal.body
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
                      <Link to="/" className="pr-3">
                        <IconChevronLeft/> Bosh sahifaga qaytish
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
    </Container>
  )
}
export default SurveyAppeal;