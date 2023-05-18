import React, {useEffect, useState} from "react";
import {Popover} from 'antd';
import {useSelector} from "react-redux";
import {MessageOutlined} from "@ant-design/icons";

import {useGetDynamic} from "../../../../../hooks/useGet";
import {GET_VACATION_STAFF} from "../../../../../store/types";
import AppTable from "../../../../../components/AppTabel";
import ChangeButtons from "../ChangeButtons";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import CommentsPopover from "../../../../../components/CommentsPopover";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";

function Vacation({ type }) {
  const [data, get, loader] = useGetDynamic();
  const [reload, setReload] = useState();
  const [columns, setColumns] = useState([
    {
      title: 'Ariza raqami',
      dataIndex: 'id',
      width: '10%'
    }, {
      title: "Hodim",
      dataIndex: 'user',
      render: (_, col) => {
        return <div className="text-capitalize">
          {col?.staff?.full_name.toLowerCase()}
        </div>
      }
    }, {
      title: "Ariza sanasi",
      dataIndex: 'begin_date',
      render: (_, col) => {
        return <div className="text-center">
          {
            col.begin_date
          }
          {
            col.end_date ?
              <>
                <span className="text-muted"> dan </span>
                {col.end_date}
                <span className="text-muted"> gacha </span>
              </> : ''
          }
        </div>
      }
    }, {
      title: "Rasmiylashtirilgan sana",
      dataIndex: 'from_vacation_date',
      render: (_, col) => {
        return <div className="text-center">
          {
            col.from_vacation_date && col.to_vacation_date ?
              <span>
                {col.from_vacation_date}  <span className="text-muted">dan </span>
                {col.to_vacation_date}   <span className="text-muted">gacha</span>
              </span> :
              <span className="text-muted small">
                Mavjud emas
              </span>
          }
        </div>
      }
    },
    {
      title: "Izox",
      align: 'center',
      render: (_, col) => {
        return (
          <Popover
            trigger="hover"
            placement="topLeft"
            title={"Izohlar"}
            content={<CommentsPopover left={col?.hr_comments} leftTitle={'Bosh kadr'} rightTitle={'Hodim'} right={col?.staff_comments} />}
          >
            <ButtonDefault className="p-0">
              <MessageOutlined />
            </ButtonDefault>
          </Popover>
        )
      }
    },
    {
      title: "Holati",
      dataIndex: 'status',
      render: (_, col) => {
        return <div className="text-center">
          <StatusBadge status={col.status === 'in_progress' ? `${col.status}_1` : col.status} />
        </div>
      }
    }, {
      title: "Amallar",
      dataIndex: 'action',
      render: (_, col) => {
        return <ChangeButtons reload={setReload} appeal={col} />
      }
    }
  ]);
  const tablePage = useSelector(s => s.tablePage || 1);
  useEffect(() => {
    const query = tablePage > 1 ? { vacation_type: type, page: tablePage } : {
      vacation_type: type
    }
    get(GET_VACATION_STAFF, query);
  }, [reload]);
  return <AppTable loader={loader} data={data} columns={columns} />
}
export default Vacation;