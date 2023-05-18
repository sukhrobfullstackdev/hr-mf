import React, { useState, useEffect, useCallback } from 'react';
import { Form, Row, Col, Input, Button, Spin } from 'antd';
import { SaveOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from 'react-redux';

import usePost from '../../../hooks/usePost';
import { CHECK_STAFF_USER_PASSWORD, CHANGE_STAFF_USER_PASSWORD } from '../../../store/types';

const UserSettings = () => {
  const [form] = Form.useForm();
  const userData = useSelector(state => state?.userData);
  const [post, postLoader] = usePost()
  const dispatch = useDispatch()

  const [validPassword, setValidPassword] = useState(false);

  useEffect(() => {
    form.setFieldsValue({ userName: userData?.full_name })
  }, [form, userData])

  const oldPasswordBlurHandler = e => {
    if (e?.target?.value === '') {
      return
    }
    setValidPassword(false);
    post(CHECK_STAFF_USER_PASSWORD,
      {
        password: e?.target?.value,
      },
      () => {
        setValidPassword(true);
      }
    )
    form.setFieldsValue({ newPassword: null })
  }

  const onFinish = useCallback((values) => {
    post(CHANGE_STAFF_USER_PASSWORD,
      {
        password: values.newPassword,
      },
      () => {
        dispatch({
          type: 'redirect',
          payload: '/login',
        })
        localStorage.removeItem('token');
      }
    )
  }, [dispatch, post])

  return (
    <Spin size='large' spinning={postLoader}>
      <h3>
        <strong>Foydalanuvchi sozlamalari</strong>
      </h3>
      <Form
        id='form'
        form={form}
        layout='vertical'
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Foydalanuvchi"
              name='userName'
              rules={[
                {
                  required: true,
                  message: `Ma'lumot kiriting`,
                }
              ]}
            >
              <Input
                readOnly
                placeholder="Foydalanuvchi"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Parol"
              name='oldPassword'
              rules={[
                {
                  required: true,
                  message: `Ma'lumot kiriting`,
                }
              ]}
            >
              <Input.Password
                placeholder="Parol"
                onBlur={oldPasswordBlurHandler}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Yangi parol"
              name='newPassword'
              rules={[
                {
                  required: true,
                  message: `Ma'lumot kiriting`,
                }
              ]}
            >
              <Input.Password
                placeholder="Yangi parol"
                readOnly={!validPassword}
              />
            </Form.Item>
            <div className="text-right mt-3">
              <Button type="primary" htmlType="submit" form="form">
                <SaveOutlined /> Saqlash
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
};

export default UserSettings;