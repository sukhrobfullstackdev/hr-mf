// import { useEffect } from "react";
import { Col, Form, Input, Row } from "antd";

// import useRegion from "../../../../../hooks/useRegion";
// import useDistrict from "../../../../../hooks/useDistrict";
// import useCompanyType from "../../../../../hooks/useCompanyType";
// import { useGetDynamic } from "../../../../../hooks/useGet";
// import { GET_STATE_ORG } from "../../../../../store/types";

// const { Option } = Select;

function FormItem({ initialValues = {} }) {
  // const [data, getData, organsLoader] = useGetDynamic();
  
  // useEffect(() => {
  //   if (!data.length) {
  //     getData(GET_STATE_ORG);
  //   }
  // }, []);
  
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Form.Item
          label="Bob"
          name='chapter_code'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <Input
            placeholder="Bob"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="BO'LIM"
          name='department_code'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <Input
            placeholder="BO'LIM"
          />
        </Form.Item>
      </Col>
      <Col span={8}>
        <Form.Item
          label="KICHIK BO'LIM"
          name='small_department_code'
          rules={[
            {
              required: true,
              message: `Ma'lumot kiriting`,
            }
          ]}
        >
          <Input
            placeholder="KICHIK BO'LIM"
          />
        </Form.Item>
      </Col>
    </Row>
  )
}
export default FormItem;