import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Input, Col, Row, Space, Tag, Tooltip } from "antd";
import { IconEdit } from "../../../../components/Icon";
import { useSelector, useDispatch } from "react-redux";

import { IconSearch } from "../../../../components/Icon";
import { GET_STATE_USERS, CHANGE_STAFF_USER_STATUS } from "../../../../store/types";
import AppTable from "../../../../components/AppTabel";
import usePost from "../../../../hooks/usePost";

function DataList() { 
  const data = useSelector(state => state.stateUsers)
  const dispatch = useDispatch();
  const [post] = usePost();

  const [query, setQuery] = useState({});

  const changeStatusHandler = (record) => {
    post(CHANGE_STAFF_USER_STATUS,
      {
        is_active: !record?.is_active,
        user_id: record?.id
      },
      () => {
        dispatch({
          type: 'reload',
          payload: Math.random()
        })
      }
    )
  }

  const columns = useMemo(() => [
    {
      title: 'FIO',
      dataIndex: 'full_name',
    },
    {
      title: 'Foydalanuvchi nomi',
      dataIndex: 'username',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      render: record => {
        switch (record) {
          case 'admin':
            return 'Admin'
          case 'head_staff':
            return 'Bo\'lim boshlig\'i'
          case 'staff':
            return 'Hodim'
          default:
            break;
        }
      }
    },
    {
      title: 'Holati',
      dataIndex: 'is_active',
      render: record => record ?
        <Tag color='#87d068'>Faol</Tag> :
        <Tag color="#f50">Nofaol</Tag>
    },
    {
      title: 'Tashkilot',
      dataIndex: 'department',
      render: record => record?.id ? <Link to={`/state/state-departments/${record?.id}`}>{record?.code}-{record?.name}</Link> : <>{record?.code}-{record?.name}</>
    },
    {
      title: 'Amallar',
      dataIndex: 'operation',
      width: 90,
      align: 'center',
      render: (_, record) => {
        return (
          <div className="text-center">
            {record.role !== 'admin' &&
              <Tooltip title="Holatini o'zgartirish">
                <span className="action-icon" onClick={() => changeStatusHandler(record)}>
                  <IconEdit color="#fff" />
                </span>
              </Tooltip>
            }
            {/* <Tooltip title="O'chirish">
              <span onClick={() => onRemove(record.id)} className='action-icon'>
                <IconTrash color="#fff" />
              </span>
            </Tooltip> */}
          </div>
        )
      },
    },
  ], []);

  const onSearch = (v) => {
    setQuery({
      search: v
    })
  }

  return (
    <Row justify='end' align='middle' gutter={[10, 16]}>
      <Col sm={24} lg={12}>
        <h3 className="mb-0">
          <strong>Shtat Hodimlar</strong>
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
        </Space>
      </Col>
      <Col span={24}>
        <AppTable
          columns={columns}
          data={data}
          search={query}
          type={GET_STATE_USERS}
        />
      </Col>
    </Row>
  )
}

export default DataList;