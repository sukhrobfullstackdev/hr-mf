import React, { useMemo, useState, useCallback } from 'react';
import { Space, Tooltip, Button } from 'antd';
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';

import { IconTrash } from "../../../../components/Icon";
import AppTable from '../../../../components/AppTabel';
import AddOrgModal from './AddOrgModal';

const Organizations = () => {
  const dispatch = useDispatch();
  const orgs = useSelector(state => state?.stateDepartmentOrgs || []);

  const [addOrgModalVisible, setAddOrgModalVisible] = useState(false)

  const deleteHandler = useCallback((id) => {
    const filteredData = orgs.filter(org => org.id !== id);
    dispatch({
      type: 'stateDepartmentOrgs',
      payload: filteredData
    });
  }, [orgs, dispatch])

  const columns = useMemo(() => [
    {
      title: 'Tashkilot',
      dataIndex: 'name',
    },
    {
      title: 'Turi',
      dataIndex: 'type',
      render: record => {
        switch (record) {
          case 'with_budget':
            return 'Byudjet'
          case 'with_self':
            return 'Byudjetdan tashqari'
          default:
            return ''
        }
      }
    },
    {
      title: 'INN',
      dataIndex: 'organization_tin',
    },
    {
      title: (
        <Space>
          <span>Amallar</span>
          <Tooltip title="Qo'shish">
            <Button
              type="primary"
              onClick={() => setAddOrgModalVisible(true)}
            >
              <PlusCircleOutlined />
            </Button>
          </Tooltip>
        </Space>
      ),
      dataIndex: 'operation',
      width: 90,
      align: 'center',
      render: (_, record) => {
        return (
          <div className="text-center">
            <Tooltip title="O'chirish">
              <span
                className='action-icon'
                onClick={() => deleteHandler(record.id)}
              >
                <IconTrash color="#fff" />
              </span>
            </Tooltip>
          </div>
        )
      },
    },
  ], [deleteHandler]);

  const addOrgHandler = (values) => {
    dispatch({
      type: 'stateDepartmentOrgs',
      payload: [...orgs, values]
    });
    setAddOrgModalVisible(false);
  }

  return (
    <>
      <AppTable
        columns={columns}
        data={orgs}
      />
      {addOrgModalVisible &&
        <AddOrgModal
          visible={addOrgModalVisible}
          onOk={addOrgHandler}
          onCancel={() => setAddOrgModalVisible(false)}
        />}
    </>
  );
};

export default React.memo(Organizations);