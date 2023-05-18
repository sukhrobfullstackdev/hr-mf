import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Col, Row, Tooltip, Space } from "antd";
import { useSelector, useDispatch } from "react-redux";

import { IconEdit, IconPlus, IconTrash, IconSearch } from "../../../../components/Icon";
import { GET_STATE_DEPARTMENTS, REMOVE_DEPARTMENT } from "../../../../store/types";
import AppTable from "../../../../components/AppTabel";

function DataList() {
  const dispatch = useDispatch();
  const data = useSelector(state => state.stateDepartments)
  const [query, setQuery] = useState({});

  const onRemove = useCallback((id) => {
    dispatch({
      type: REMOVE_DEPARTMENT,
      payload: id
    })
  }, [dispatch])
  
  const columns = useMemo(() => [
    {
      title: 'id',
      width: '4%',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: 'Bo\'lim',
      dataIndex: 'name',
    },
    {
      title: 'Ko\'d',
      dataIndex: 'code',
    },
    {
      title: 'Amallar',
      dataIndex: 'operation',
      width: 90,
      align: 'center',
      render: (_, record) => {
        return (
          <div className="text-center">
            <Tooltip title="Tahrirlash">
              <Link to={`/state/state-departments/${record.id}`} className='action-icon'>
                <IconEdit color="#fff" />
              </Link>
            </Tooltip>
            <Tooltip title="O'chirish">
              <span onClick={() => onRemove(record.id)} className='action-icon'>
                <IconTrash color="#fff" />
              </span>
            </Tooltip>
          </div>
        )
      },
    },
  ], [onRemove]);

  const onSearch = (v) => {
    setQuery({
      search: v
    })
  }

  return (
    <Row justify='end' align='middle' gutter={[10, 16]}>
      <Col sm={24} lg={12}>
        <h3 className="mb-0">
          <strong>Shtat Bo'limlar</strong>
        </h3>
      </Col>

      <Col sm={24} lg={12} className="text-right">
        <Space>
          <Input.Search
            allowClear
            enterButton={<IconSearch />}
            placeholder="Izlash"
            onSearch={onSearch}
            style={{
              width: '100%',
            }}
          />
          <Link className="ant-btn ant-btn-primary" to={`add`}>
            <IconPlus color="#fff" /> Qo'shish
          </Link>
        </Space>
      </Col>
      <Col span={24}>
        <AppTable
          columns={columns}
          data={data}
          search={query}
          type={GET_STATE_DEPARTMENTS}
        />
      </Col>
    </Row>
  )
}

export default DataList;