import { useEffect, useMemo, useState } from "react";
import { Card, Tabs } from "antd";

import Vacation from "./component/Vacation";
import { useGetDynamic } from "../../../hooks/useGet";
import { GET_VACATION_TYPES } from "../../../store/types";
import TabInfo from "../../../components/TabInfo";

const { TabPane } = Tabs;

function ListData() {
  const [activeKey, setActiveKey] = useState('annual_leave');
  const [vacationTypes, setVacationTypes] = useState([]);

  const [data, get, loader] = useGetDynamic();

  useEffect(() => {
    get(GET_VACATION_TYPES);
  }, []);

  const onChangeTab = (key) => {
    setActiveKey(key)
  }

  // const vacation = useMemo(() => {
  //   return (
  //     data.map(item => (
  //       <TabPane tab={< TabInfo tabInfo={item} type='vacations' />} key={item.vacation_type} >
  //         <Vacation type={activeKey} />
  //       </TabPane >
  //     ))
  //   )
  // }, [activeKey])

  return (
    <Card>
      <Tabs onChange={onChangeTab} className='cabinet-main-tab' defaultActiveKey={activeKey}>
        {
          data.map(item => (
            <TabPane tab={<TabInfo tabInfo={item} type='vacations' />} key={item.vacation_type} >
              <Vacation type={activeKey} />
            </TabPane >
          ))
        }
        {/* <TabPane tab="Mexnat ta'tili" key="annual_leave">
        {vacation}
      </TabPane>
      <TabPane tab="O'z hisobidan ta'til" key="free_leave">
        {vacation}
      </TabPane> */}
      </Tabs>
    </Card>
  )
}
export default ListData;