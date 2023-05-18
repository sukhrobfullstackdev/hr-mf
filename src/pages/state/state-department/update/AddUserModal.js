import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd'

import { useGetDynamic } from '../../../../hooks/useGet';
import { SELECT_STATE_USERS, GET_STAFFLIST_ROLES } from '../../../../store/types';

const { Option } = Select;

const AddUser = ({ visible, ...props }) => {
  const [form] = Form.useForm();
  const [usersData, get, loader, setUsersData] = useGetDynamic();
  const [roles, getRoles, rolesLoader] = useGetDynamic();

  const [search, setSearch] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    if (visible) {
      getRoles(GET_STAFFLIST_ROLES);
    }
  }, [visible])

  useEffect(() => {
    if (visible && search) {
      const getData = setTimeout(() => { 
        get(SELECT_STATE_USERS, { search });
      }, 1000);

      return () => clearTimeout(getData);
    }
  }, [search, visible])

  const onOk = () => {
    form.validateFields()
      .then(values => {
        values.full_name = userData?.children;
        values.pinfl = userData?.pinfl;
        console.log(values);
        props.onOk(values)
      })
  }

  return (
    <Modal
      title="Hodim qo'shish"
      visible={visible}
      onOk={onOk}
      onCancel={() => {
        form.resetFields();
        props.onCancel();
      }}
    >
      <Form
        form={form}
        name='form'
        layout='vertical'
      >
        <Form.Item
          label="FIO"
          name='id'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Qidiring!"
            getPopupContainer={(trigger) => trigger.parentNode}
            onClear={() => setUsersData([])}
            onSearch={val => setSearch(val)}
            onSelect={((_, data) => setUserData(data))}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {usersData.map(item => <Option key={item.id} value={item.id} pinfl={item.pinfl}>{item.full_name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label="Foydalanuvchi nomi"
          name='username'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <Input placeholder='Foydalanuvchi nomi' />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Rol"
          rules={[
            {
              required: true,
              message: 'Tanlang!',
            }
          ]}
        >
          <Select
            placeholder="Tanlang!"
            getPopupContainer={(trigger) => trigger.parentNode}
          >
            {roles.map(item => <Option key={item.id} value={item.id} disabled={item.name === 'admin'}>{item.name}</Option>)}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddUser;