import { Col, Radio, Row } from "antd";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useGetDynamic } from "../../hooks/useGet";

function DocTypes({ type, onChange, activeStatus, url }) {
  console.log(activeStatus);
  const user = useSelector(s => s.isUser || null);
  const [statusData, get] = useGetDynamic();
  const [status, setStatus] = useState({
    new: 0,
    checked: 0,
    confirmed: 0,
    approved: 0
  })
  
  useLayoutEffect(() => {
    get(url, {
      key: type
    })
  }, [type]);
  
  useEffect(() => {
    const newStatus = {};
    for (const key in status) {
      const candidate = statusData.find(v => v.status === key);
      if (candidate) {
        newStatus[key] = candidate.total_count
      } else {
        newStatus[key] = status[key]
      }
    }
    setStatus(newStatus);
  }, [statusData]);
  
  return (
    <Row justify="end">
      <Col span={24} className="mb-3">
        <Radio.Group
          onChange={onChange}
          value={activeStatus}
        >
          {
            user && user.current_role === 'HR' ?
              <>
                <Radio.Button value="new">
                  <span className="position-relative">
                    Yangi kelib tushgan
                    {
                      status.new && status.new > 0 ?
                        <span className="tab-count">{status.new}</span> : ''
                    }
                  </span>
                </Radio.Button>
                <Radio.Button value="checked">
                  <span className="position-relative">
                    Qabul qilingan
                    {
                      status.checked && status.checked > 0 ?
                        <span className="tab-count">{status.checked}</span> : ''
                    }
                  </span>
                </Radio.Button>
              </> :
              ''
          }
          <Radio.Button value="approved">
            <span className="position-relative">
              Tasdiqlash uchun
              {
                status.approved && status.approved > 0 ?
                  <span className="tab-count">{status.approved}</span> : ''
              }
            </span>
          </Radio.Button>
          <Radio.Button value="confirmed">
            <span className="position-relative">
              Tasdiqlangan
              {
                status.confirmed && status.confirmed > 0 ?
                  <span className="tab-count">{status.confirmed}</span> : ''
              }
            </span>
          </Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  )
}
export default DocTypes