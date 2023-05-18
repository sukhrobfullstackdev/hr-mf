import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Card, Form, Tabs, Spin } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";

import Title from "../../../../styleComponents/Title";
import FormItems from "./FormItems";
import { CREATE_STATE_DEPARTMENT, GET_STATE_DEPARTMENT, UPDATE_STATE_DEPARTMENT } from "../../../../store/types";
import usePost from "../../../../hooks/usePost";
import Users from "./Users";
import Organizations from "./Organizations";
import { useGetDynamic } from "../../../../hooks/useGet";

const { TabPane } = Tabs;

function UpdateDepartment() {
  const userData = useSelector(state => state?.stateDepartmentUsers);
  const orgsData = useSelector(state => state?.stateDepartmentOrgs);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { id } = useParams();
  const [form] = Form.useForm()
  const [post, updateLoading] = usePost();
  const [data, get] = useGetDynamic();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      get(`${GET_STATE_DEPARTMENT}${id}/`, {}, false);
    }
  }, [id]);

  useEffect(() => {
    if (data?.id) {
      form.setFieldsValue(data);
      dispatch({
        type: 'stateDepartmentUsers',
        payload: data.users
      });
      dispatch({
        type: 'stateDepartmentOrgs',
        payload: data.organizations
      });
      setLoading(false)
    } else {
      dispatch({
        type: 'stateDepartmentUsers',
        payload: []
      });
      dispatch({
        type: 'stateDepartmentOrgs',
        payload: []
      });
      setLoading(false)
    }
  }, [data, form, dispatch]);

  const onFinish = (v) => {
    if (id) {
      dispatch({
        type: UPDATE_STATE_DEPARTMENT,
        payload: {
          ...v,
          id,
          users: userData,
          organizations: orgsData,
          fullUrl: "state/state-departments"
        }
      })
      return
    }
    post(CREATE_STATE_DEPARTMENT, {
      ...v,
      users: userData,
      organizations: orgsData,
    }, () => {
      navigate('/state/state-departments');
    });
  }

  return (
    <Card>
      <Title>
        Departament qo'shish
      </Title>
      <Spin spinning={loading || updateLoading}>
        <Form
          id='form'
          form={form}
          layout='vertical'
          onFinish={onFinish}
        >
          <FormItems />
        </Form>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Hodimlar" key="1">
            <Users />
          </TabPane>
          <TabPane tab="Tashkilot" key="2">
            <Organizations />
          </TabPane>
        </Tabs>
      </Spin>

      <div className="text-right mt-3">
        <Link to="/state/state-departments" className="ant-btn ant-btn-danger mr-3">
          <ArrowLeftOutlined /> Bekor qilish
        </Link>
        <Button type="primary" htmlType="submit" form="form">
          <SaveOutlined /> Saqlash
        </Button>
      </div>
    </Card>
  )
}
export default UpdateDepartment;