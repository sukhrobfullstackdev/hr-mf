import React, { useState, useEffect } from 'react';
import { Modal, Form, Select } from 'antd'

import { useGetDynamic } from '../../../../hooks/useGet';
import { GET_STATE_ORGS } from '../../../../store/types';

const { Option } = Select;

const AddOrgModal = ({ visible, ...props }) => {
  const [form] = Form.useForm();
  const [data, get, loader, setData] = useGetDynamic();
  const [search, setSearch] = useState(null);
  const [name, setName] = useState('');
  const [tin, setTin] = useState('');

  useEffect(() => {
    if (visible && search) {
      const getData = setTimeout(() => {
        get(GET_STATE_ORGS, { search }, false);
      }, 1000);
      return () => clearTimeout(getData);
    }
  }, [search, visible])

  const onOk = () => {
    form.validateFields()
      .then(values => {
        values.name = name;
        values.organization_tin = tin;
        props.onOk(values)
      })
  }

  return (
    <Modal
      title="Hodim qo'shish"
      visible={visible}
      onOk={onOk}
      onCancel={() => props.onCancel()}
    >
      <Form
        form={form}
        name='form'
        layout='vertical'
      >
        <Form.Item
          label="Tashkilot"
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
            onClear={() => setData([])}
            onSearch={val => setSearch(val)}
            onSelect={((_, data) => {
              setTin(data['data-tin']);
              setName(data.children)
            })}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {data.map(item => <Option key={item.id} value={item.id} data-tin={item.organization_tin}>{item.name}</Option>)}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tashkilot turi"
          name='type'
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
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value='with_self'>Byudjetdan tashqari</Option>
            <Option value='with_budget'>Byudjet</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddOrgModal;