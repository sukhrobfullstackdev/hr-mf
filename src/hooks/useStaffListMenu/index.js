import React from 'react';
import { NavLink } from 'react-router-dom';
import { DesktopOutlined, TeamOutlined, HomeOutlined, BankOutlined } from '@ant-design/icons';

const useStaffListMenu = (userRole) => {
  const items = [
    getItem(
      <NavLink to="main">
        Bosh sahifa
      </NavLink>,
      '0',
      <HomeOutlined />,
    ),
    getItem(
      <NavLink to="state-organizations">
        Shtat Tashkilotlar
      </NavLink>,
      '1',
      <BankOutlined />,
      ['admin']
    ),
    getItem(
      <NavLink to="state-departments">
        Shtat Bo'limlar
      </NavLink>,
      '2',
      <DesktopOutlined />,
      ['admin']
    ),
    getItem(
      <NavLink to="state-user">
        Shtat Hodimlar
      </NavLink>,
      '3',
      <TeamOutlined />,
      ['admin']
    ),
    getItem(
      <NavLink to="users">
        Hodimlar
      </NavLink>,
      '4',
      <TeamOutlined />,
      ['head_staff']
    ),
    getItem(
      <NavLink to="orgStaffList">
        Tashkilot shtati
      </NavLink>,
      '5',
      <BankOutlined />,
      ['head_staff', 'staff']
    ),
  ];

  function getItem(label, key, icon, role) {
    if (role?.includes(userRole) || !role) {
      return {
        key,
        icon,
        label,
      };
    }
  }

  return items;
};

export default useStaffListMenu;