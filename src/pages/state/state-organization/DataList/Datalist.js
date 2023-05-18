import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
import { Col, Row, Input } from "antd";
import { useSelector } from "react-redux";

// import { IconEdit } from "../../../../components/Icon";
import { GET_STATE_ORGS } from "../../../../store/types";
import AppTable from "../../../../components/AppTabel";
import { IconSearch } from "../../../../components/Icon";

const DataList = () => {
  const stateOrgs = useSelector(state => state.stateOrgs);
  const [query, setQuery] = useState({});

  const columns = useMemo(() => [
    {
      title: 'Tashkilot',
      dataIndex: 'name',
    },
    {
      title: 'INN',
      dataIndex: 'organization_tin',
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
          <strong>Shtat Tashkilotlar</strong>
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
          data={stateOrgs}
          type={GET_STATE_ORGS}
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

export default DataList;