import { Card, Col, Row, Skeleton, Tabs } from "antd";
import SideBar from "../component/SideBar";
import { connect } from "react-redux";
import { useMemo, useState } from "react";
import Vacation from "./component/Vacation";

const { TabPane } = Tabs;

function Appeals({ loader = false }) {

  return (
      <Row gutter={24} className="mt-4">
        <Col span={7}>
          {
            loader ?
                <Card className="h-100">
                  <Skeleton active />
                </Card> :
                <SideBar />
          }
        </Col>
        <Col span={17}>
          {
            loader ?
                <Card className="h-100">
                  <Skeleton active />
                </Card> :
                <Card>
                  <Tabs className='cabinet-main-tab' defaultActiveKey="1">
                    <TabPane tab="Mexnat ta'til arizasi" key="annual_leave">
                      <Vacation type="annual_leave" />
                    </TabPane>
                    <TabPane tab="O'z hisobidan ta'til arizasi" key="free_leave">
                      <Vacation type="free_leave" />
                    </TabPane>
                    <TabPane tab="Ishga qabul qilish" key="employment">
                      <Vacation type="employment" />
                    </TabPane>
                    <TabPane tab="Ishdan bo'shash arizasi" key="dismiss">
                      <Vacation type="dismiss" />
                    </TabPane>
                    <TabPane tab="Umumiy ariza" key="general">
                      <Vacation type="general" />
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
    s: s?.loader
  }
})(Appeals);