import { useEffect, useState } from "react"
import { Button, Card, Spin, Form } from "antd";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftOutlined, SaveOutlined, SyncOutlined } from "@ant-design/icons";

import Title from "../../../../styleComponents/Title";
import FormItem from "./FormItems";
import { setToast } from '../../../../store/actions';
import { useGetDynamic } from "../../../../hooks/useGet";
import { UPDATE_STATE_ORG, GET_STATE_ORG } from "../../../../store/types";;

function UpdateStateOrganization() {
  const [data, get] = useGetDynamic();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [form] = Form.useForm()

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      get(`${GET_STATE_ORG}${id}/`, {}, false)
    }
  }, [id]);

  useEffect(() => {
    if (data.id) {
      form.setFieldsValue(data);
      setLoading(false);
    }
  }, [data, form]);

  const onFinish = (v) => {
    dispatch({
      type: UPDATE_STATE_ORG,
      payload: {
        ...data,
        ...v,
        fullUrl: "state/state-organizations"
      }
    })
  }
  return (
    <Card>
      <Title>
        <div className="d-flex justify-content-between align-items-center">
          <span>Shtat tashkilot tahrirlash</span>
          <Button
            type="primary"
            onClick={() => dispatch(setToast({
              type: 'warning',
              message: 'Malumot topilmadi'
            }))}
          >
            <SyncOutlined /> DMBAT dan olish
          </Button>
        </div>
      </Title>
      <Spin spinning={loading} size='large'>
        <Form
          form={form}
          name='form'
          layout='vertical'
          onFinish={onFinish}
        // initialValues={stateOrg}
        >
          <FormItem />
          <Form.Item className="text-right">
            <Link to='/state/state-organizations' className="ant-btn ant-btn-danger mr-3">
              <ArrowLeftOutlined /> Ortga
            </Link>
            <Button type="primary" htmlType='submit'>
              <SaveOutlined /> Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  )
}
export default UpdateStateOrganization;