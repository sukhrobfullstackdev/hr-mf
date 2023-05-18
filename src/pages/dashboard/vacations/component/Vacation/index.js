import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Popover } from 'antd';
import { useSelector } from "react-redux";
import { MessageOutlined } from "@ant-design/icons";

import { useGetDynamic } from "../../../../../hooks/useGet";
import { GET_COMMAND_APPROVERS, GET_VACATION_STAFF } from "../../../../../store/types";
import AppTable from "../../../../../components/AppTabel";
import ChangeButtons from "../ChangeButtons";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import CommentsPopover from "../../../../../components/CommentsPopover";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import DocTypes from "../../../../../components/DocTypes/DocTypes";

function Vacation({ type }) {
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
            content={<CommentsPopover right={col?.hr_comments} rightTitle={'Bosh kadr'} leftTitle={'Hodim'} left={col?.staff_comments} />}
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
    },
    {
      title: "Amallar",
      dataIndex: 'action',
      render: (_, col) => {
        return <ChangeButtons appeal={col} />
      }
    }
  ]);
  const [initial, setInitial] = useState(true);
  const { vacationStaff = [] } = useSelector(s => s);
  const tablePage = useSelector(s => s.tablePage || 1);
  const user = useSelector(s => s.isUser || null);
  
  const [query, setQuery] = useState(null);

  useEffect(() => {
    if (initial) {
      setQuery({
        vacation_type: type,
        status: user && user.current_role === 'HR' ? 'new' : 'approved',
      });
      setInitial(false);
    }
    return () => setInitial(true);
  }, [type]);

  const onChange = (e) => {
    setQuery({
      ...query,
      status: e.target.value,
    })
  }

  return useMemo(() => {
    return (
      query ?
        <>
          <DocTypes type={type} url={GET_VACATION_STAFF} activeStatus={query.status} onChange={onChange} />
          <AppTable search={query} type={GET_VACATION_STAFF} data={vacationStaff} columns={columns} />
        </> :
        ''
    )
  }, [query, vacationStaff]);
}

export default Vacation;
