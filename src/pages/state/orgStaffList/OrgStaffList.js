import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Input } from "antd";
import { useSelector } from "react-redux";

import { GET_ORG_STAFFLIST } from "../../../store/types";
import AppTable from "../../../components/AppTabel";
import { IconSearch } from "../../../components/Icon";

const OrgStaffList = () => {
  const data = useSelector(state => state.orgStaffList);
  const [query, setQuery] = useState({});

  const columns = useMemo(() => [
    {
      title: 'id',
      width: '4%',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'Tashkilot',
      dataIndex: 'organization_name',
      render: (_, record) => <Link to={`${record?.id}`}>{record?.organization_name}</Link>
    },
    {
      title: 'INN',
      dataIndex: 'organization_tin',
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      render: record => {
        switch (record) {
          case 'pending':
            return 'Yangi'
          case 'checked':
            return 'Tekshirilgan'
          case 'approved':
            return 'Kelishilgan'
          case 'confirmed':
            return 'Tasdiqlangan'
          case 'finished':
            return 'Tugatilgan'
          default:
            return ''
        }
      }
    },
    // {
    //   title: 'Amallar',
    //   dataIndex: 'operation',
    //   width: 90,
    //   align: 'center',
    //   render: (_, record) => {
    //     return (
    //       <div className="text-center">
    //         <Tooltip title="Tahrirlash">
    //           <Link to={`/state/state-organizations/${record.id}`} className='action-icon'>
    //             <IconEdit color="#fff" />
    //           </Link>
    //         </Tooltip>
    //       </div>
    //     )
    //   },
    // },
  ], []);

  const onSearch = (v) => {
    setQuery({
      search: v
    })
  }

  return (
    <Row justify='end' align='middle' gutter={[0, 16]}>
      <Col span={20}>
        <h3 className="mb-0">
          <strong>Tashkilot Shtati</strong>
        </h3>
      </Col>
      <Col span={4} className="text-right">
        <Input.Search
          allowClear
          enterButton={<IconSearch />}
          placeholder="Izlash"
          onSearch={onSearch}
          style={{
            width: '100%',
          }}
        />
      </Col>
      <Col span={24}>
        <AppTable
          columns={columns}
          data={data}
          type={GET_ORG_STAFFLIST}
          search={query}
          scroll={{
            x: "max-content",
            y: '60vh'
          }}
        />
      </Col>
    </Row>
  )
}

export default OrgStaffList;