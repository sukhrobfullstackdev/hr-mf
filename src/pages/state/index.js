import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout, Menu, Switch } from 'antd';
import { Link, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import DashboardHeader from "./components/Header";
import useStaffListMenu from '../../hooks/useStaffListMenu';
// import DashboardContent from "./../dashboard/components/Content/index";
// import StyledBreadcrumb from './components/StyledBreadcrumb/StyledBreadcrumb';
import { GET_STAFFLIST_USERDATA } from '../../store/types';
import classes from './staffList.module.css'

const { Header, Content, Footer, Sider } = Layout;

const State = () => {
  // const location = useLocation();
  // const pathSnippets = location.pathname.split('/').filter(i => i);
  const userRole = useSelector(state => state?.userData?.role)
  const dispatch = useDispatch()
  const items = useStaffListMenu(userRole);
  
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  // const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    if (!userRole) {
      dispatch({
        type: GET_STAFFLIST_USERDATA,
      })
    }
  }, [dispatch, userRole]);

  const changeTheme = (value) => {
    setTheme(value ? 'dark' : 'light');
  };

  // useEffect(() => {
  //   if (pathSnippets.includes('state-organizations')) {
  //     setSelectedMenu('1')
  //   } else if (pathSnippets.includes('state-departments')) {
  //     setSelectedMenu('2')
  //   } else if (pathSnippets.includes('state-user')) {
  //     setSelectedMenu('3')
  //   } else {
  //     setSelectedMenu('1')
  //   }
  // }, [location])

  return (
    <StateWrapper>
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Sider
          theme={theme}
          width={256}
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          className={classes.sider}
        >
          <div className={`${collapsed ? 'px-2' : 'pl-4'} position-sticky`}>
            <Link to='/state/state-organizations' >
              <LogoWrapper sm={collapsed}>
                <Logo src={`/images/${collapsed ? 'logo_sm.svg' : 'logo.svg'}`} />
              </LogoWrapper>
            </Link>
          </div>
          <Menu
            // selectedKeys={[selectedMenu]}
            mode="inline"
            items={items}
            theme={theme}
          />
        </Sider>
        <Layout className="site-layout">
          <Header
            className={`site-layout-background ${classes.header}`}
            style={{
              padding: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Switch
                checked={theme === 'dark'}
                onChange={changeTheme}
                checkedChildren="Qora"
                unCheckedChildren="Oq"
                style={{ marginLeft: 16 }}
              />
              <DashboardHeader />
            </div>
          </Header>
          <Content
            style={{
              margin: '0 16px',
            }}
          >
            {/* <StyledBreadcrumb /> */}
            {/* <DashboardContent> */}
              <Outlet />
            {/* </DashboardContent> */}
          </Content>
          <Footer
            style={{
              textAlign: 'center',
            }}
          >
            ©2022
          </Footer>
        </Layout>
      </Layout>
    </StateWrapper>
  );
};

export default State;

const StateWrapper = styled.div`
margin-top:1.5rem;
#components-layout-demo-side .logo {
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
}

.site-layout .site-layout-background {
  background: #fff;
}
`
const LogoWrapper = styled.div`
    width: ${p => p.sm ? '100%' : '90%'};
    padding: 36px 0;
`
const Logo = styled.img`
    width: 100%;
`