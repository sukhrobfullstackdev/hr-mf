import { useMemo, useState } from "react";
// import { Link } from "react-router-dom";
import { Col, Row, Input } from "antd";
import { useSelector } from "react-redux";

// import { IconEdit } from "../../../../components/Icon";
import { GET_STAFFLIST_DEPARTMENT_USERS } from "../../../../store/types";
import AppTable from "../../../../components/AppTabel";
import { IconSearch } from "../../../../components/Icon";

const DataList = () => {
  const data = useSelector(state => state.stafflistDepartmentUsers);
  const [query, setQuery] = useState({});

  const columns = useMemo(() => [
    {
      title: 'id',
      width: '4%',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'FIO',
      dataIndex: 'full_name',
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
          data={data}
          type={GET_STAFFLIST_DEPARTMENT_USERS}
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