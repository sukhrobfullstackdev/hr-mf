import { Card, Col, Row, Skeleton, Tabs } from "antd";
import { connect } from "react-redux";

import SideBar from "../component/SideBar";
import Vacation from "./component/Vacation";
import {useState} from "react";

const { TabPane } = Tabs;

function Vacations({ loader = false, sideBarHide }) {
    const [activeKey, setActiveKey]= useState("annual_leave")
    const onTabChange = (key)=> {
        setActiveKey(key)
        console.log(`activeKey changed to ${key}`)
    }
  return (
    <Row gutter={24} className="mt-4">
      <Col className="mb-3" xs={24} sm={24} md={sideBarHide ? 24 : 8} lg={sideBarHide ? 24 : 7} xxl={sideBarHide ? 24 : 7}>
        <SideBar />
      </Col>
      <Col className="mb-3" xs={24} sm={24} md={sideBarHide ? 24 : 16} lg={sideBarHide ? 24 : 17} xxl={sideBarHide ? 24 : 17}>
        {
          loader ?
            <Card className="h-100">
              <Skeleton active />
            </Card> :
            <Card>
              <Tabs onChange={onTabChange} className='cabinet-main-tab' defaultActiveKey={activeKey}>
                <TabPane tab="Mexnat ta'til" key="annual_leave">
                  <Vacation type={activeKey} />
                </TabPane>
                <TabPane tab="O'z hisobidan ta'til" key="free_leave">
                  <Vacation type={activeKey} />
                </TabPane>
              </Tabs>
            </Card>
        }
      </Col>
    </Row>
  )
}
export default connect(s => {
  return {
    loader: s?.loader,
    sideBarHide: s.sideBarHide || false
  }
})(Vacations);