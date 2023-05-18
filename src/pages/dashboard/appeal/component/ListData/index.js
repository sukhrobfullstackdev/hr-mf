import { Card, Tabs } from "antd";
import AppealEmployee from "../AppealEmployee";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { GET_APPEAL_TYPES } from "../../../../../store/types";
import { useGetDynamic } from "../../../../../hooks/useGet";
import TabInfo from "../../../../../components/TabInfo";

const { TabPane } = Tabs;
function ListData() {
  const [data, get, loader] = useGetDynamic();
  const [tab, setTab] = useState([]);

  const dispatch = useDispatch();
  // const { appealActiveKey = 'annual_leave' } = useSelector(s => s)

  useEffect(() => {
    return () => {
      dispatch({
        type: 'appealActiveKey',
        payload: 'dismiss'
      })
    }
  }, []);

  // useEffect(() => {
  //   if (data && Object.keys(data).length) {
  //     const newTab = tab.map(v => {
  //       const candidate = data.find(item => item.type === v.type);
  //       if (candidate) {
  //         return {
  //           ...v,
  //           count: candidate.total_count
  //         }
  //       }
  //       return v
  //     });
  //     setTab(newTab);
  //   }
  // }, [data]);

  useEffect(() => {
    // get(GET_APPEAL_STAT_BY_TYPE);
    get(GET_APPEAL_TYPES);
  }, []);

  useEffect(() => {
    setTab(data);
  }, [data]);

  const onChangeTab = (key) => {
    dispatch({
      type: 'appealActiveKey',
      payload: key
    })
  }

  const tabPane = useMemo(() => {
    return (
      tab.map(pane => {
        return (
          <TabPane tab={<TabInfo tabInfo={pane} type={'orders'} />} key={pane.key}>
            <AppealEmployee type={pane.key} />
          </TabPane>
        )
      })
    )
  }, [tab]);

  return (
    <Card>
      <Tabs onChange={onChangeTab} className='cabinet-main-tab' defaultActiveKey='dismiss'>
        {tabPane}
      </Tabs>
    </Card>
  )
}
export default ListData