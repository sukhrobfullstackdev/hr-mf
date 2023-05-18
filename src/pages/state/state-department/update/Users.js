import React, { useState, useCallback, useMemo } from 'react';
import { Space, Tooltip, Button } from 'antd';
import { PlusCircleOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from 'react-redux';

import AppTable from '../../../../components/AppTabel';
import AddUserModal from './AddUserModal';
import { IconTrash } from "../../../../components/Icon";
import { setToast } from '../../../../store/actions';

const User = () => {
  const dispatch = useDispatch();
  const users = useSelector(state => state?.stateDepartmentUsers || []);
  const [addUserModalVisible, setAddUserModalVisible] = useState(false)
  // const [userData, setUserData] = useState(users)

  const deleteUserHandler = useCallback((id) => {
    const filteredData = users.filter(user => user.id !== id);
    // setUserData(filteredData);
    dispatch({
      type: 'stateDepartmentUsers',
      payload: filteredData
    });
  }, [users, dispatch])

  const userColumns = useMemo(() => [
    {
      title: 'FIO',
      dataIndex: 'full_name',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      render: record => {
        if (record === 'SH_STAFF') {
          return 'Hodim'
        } else {
          return "Bo'lim boshlig'i"
        }
      }
    },
    {
      title: (
        <Space>
          <span>Amallar</span>
          <Tooltip title="Qo'shish">
            <Button type="primary" onClick={() => setAddUserModalVisible(true)}>
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
                onClick={() => deleteUserHandler(record.id)}
              >
                <IconTrash color="#fff" />
              </span>
            </Tooltip>
          </div>
        )
      },
    },
  ], [deleteUserHandler]);

  const addUserHandler = (values) => {
    if (users?.filter(item => item.role === 'SH_STAFF_HO').length > 0 && values.role === 'SH_STAFF_HO') {
      dispatch(setToast({
        type: 'warning',
        message: 'Bo\'lim boshlig\' mavjud'
      }))
      return
    }
    // setUserData((prevState) => [...prevState, values]);
    dispatch({
      type: 'stateDepartmentUsers',
      payload: [...users, values]
    });
    setAddUserModalVisible(false);
  }
  return (
    <>
      <AppTable
        columns={userColumns}
        data={users}
      />
      {addUserModalVisible &&
        <AddUserModal
          visible={addUserModalVisible}
          onOk={addUserHandler}
          onCancel={() => setAddUserModalVisible(false)}
        />}
    </>
  );
};

export default React.memo(User);