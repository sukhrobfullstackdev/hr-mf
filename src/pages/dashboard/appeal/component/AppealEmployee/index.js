import { useGetDynamic } from "../../../../../hooks/useGet";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  CHECK_APPEAL_STATUS_BY_HO,
  CHECK_APPEAL_STATUS_BY_HR,
  COMMAND_GENERATE,
  GET_APPEAL_HR,
  GET_APPEAL_PDF_URL, GET_APPEAL_STAT_BY_STATUS,
  GET_COMMAND_APPROVERS
} from "../../../../../store/types";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import AppTable from "../../../../../components/AppTabel";
import { Button, Col, Dropdown, Form, Modal, Popover, Row, Select, Radio } from "antd";
import {
  IconCheckMark,
  IconClose,
  IconDotsHorizontal,
  IconEye,
  IconFile,
  IconFileText
} from "../../../../../components/Icon";
import usePost from "../../../../../hooks/usePost";
import ButtonDefault, { ButtonLink } from "../../../../../styleComponents/ButtonDefault";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Req from "../../../../../store/api";
import SortTypes from "../SortTypes";

const { Option } = Select;
const ConfirmButton = ({ col }) => {
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const user = useSelector(s => s.isUser || null);
  const [post, postLoader, res] = usePost();
  const onDownloadPdf = () => {
    setLoader(true)
    Req({
      type: `${GET_APPEAL_PDF_URL}${col.id}/get_pdf/`
    }).then(res => {
      window.open(`${process.env.REACT_APP_SERVER_URL_BY_FILE}${res.data.pdf_file}`, '_blank');
    }).catch(err => {
      dispatch({
        type: 'toast',
        payload: {
          type: 'error',
          message: "PDF yuklash bilan bog'liq hatolik!"
        }
      })
    }).finally(() => {
      setLoader(false);
    })
  }
  const onConfirm = (item) => {
    post(
      `${CHECK_APPEAL_STATUS_BY_HR}${item.id}/checked/`,
      {
        status: 'checked',
        approvers: item.approvers,
      },
      () => {
        dispatch({
          type: 'reload',
          payload: Math.random()
        })
        onCancel();
      }
    );
  };
  const onVisible = () => {
    if (user && user.current_role === 'HO') {
      post(
        CHECK_APPEAL_STATUS_BY_HO,
        {
          application_id: col.id,
          status: 'confirmed'
        },
        () => {
          dispatch({
            type: 'reload',
            payload: Math.random()
          })
        })
    }
    if (user && user.current_role === 'HR') {
      setSelectedItem(col);
      setVisible(true);
    }
  }
  const onCancel = () => {
    setSelectedItem(null);
    setVisible(false);
  }
  const onReject = () => {
    if (user && user.current_role === 'HO') {
      post(
        CHECK_APPEAL_STATUS_BY_HO, {
        application_id: col.id,
        status: 'rejected'
      }
      )
    }
    if (user && user.current_role === 'HR') {
      post(
        `${CHECK_APPEAL_STATUS_BY_HR}${col.id}/checked/`,
        {
          status: 'rejected',
        },
        () => {
          dispatch({
            type: 'reload',
            payload: Math.random()
          })
        }
      );
    }
  }
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const onGenerateOrder = () => {
    if (col.type === 'general') {
      navigate('/dashboard/orders/add');
    } else {
      setLoader(true)
      Req({
        type: COMMAND_GENERATE,
        data: {
          application: col.id
        }
      }).then(res => {
        navigate(`/dashboard/orders/${res.data.id}`)
      }).catch(err => {
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: "Hatolik qayta urinib ko'ring!"
          }
        })
      }).finally(() => {
        setLoader(false)
      })
    }
  }
  const onCreateUser = () => {
    navigate(`/dashboard/staff/create-user-by-order/${col.id}/${col.survey}`);
  }
  return (
    <>
      {
        (col.status === 'new' && user.current_role === 'HR') ?
          <>
            <ButtonLink onClick={onReject} size="small" className="text-left text-danger ant-btn-block ant-btn-link-danger">
              <IconClose /> Bekor qilish
            </ButtonLink>
            <ButtonDefault className={'text-left ant-btn-link ant-btn-block'} size="small" onClick={onVisible}>
              <IconCheckMark /> Qabul qilish
            </ButtonDefault>
          </> : ""
      }
      {
        col.status === 'checked' && user.current_role === "HR" ?
          <ButtonDefault className={'text-left ant-btn-link ant-btn-block'} size="small" onClick={onVisible}>
            <IconCheckMark /> Kelishuvchilarni o'zgartirish
          </ButtonDefault> : ''
      }
      {
        col.status === 'confirmed' && user.current_role === 'HR' && col.type !== 'dismiss' && col.type !== 'employment' ?
          <>
            <ButtonDefault disabled={loader || col.has_order} size="small" className="text-left ant-btn-link ant-btn-block" onClick={col.has_order ? null : onGenerateOrder}>
              <IconFile /> Buyruq shakillantirish
            </ButtonDefault>
          </>
          : ""
      }
      {
        col.status === 'confirmed' && user.current_role === 'HR' && col.type !== 'dismiss' && col.type === 'employment' ?
          <ButtonDefault disabled={loader || col.has_order} size="small" className="text-left ant-btn-link ant-btn-block" onClick={col.has_order ? null : onCreateUser}>
            <IconFile /> Buyruq shakillantirish
          </ButtonDefault> : ''
      }
      {
        col.status === 'confirmed' && user.current_role === 'HR' && col.type === 'dismiss' ?
          <Link to={`/dashboard/dismiss-sheet/${col.id}`}
            className={`ant-btn-link ant-btn-block text-left ${col.dismiss_sheet_id ? 'disabled' : ''}`}>
            <IconFileText />
            {
              col.dismiss_sheet_id ? "Ishdan bo'shash varaqasi shakillantirilgan" : "Ishdan bo'shash varaqasi"
            }
          </Link> : ""
      }
      {
        col.status === 'confirmed' ?
          <div>
            <ButtonDefault className="ant-btn-link ant-btn-block text-left" onClick={onDownloadPdf} disabled={loader}>
              <IconFile /> PDF yuklab olish
            </ButtonDefault>
          </div> : ""
      }
      <Link to={`/dashboard/appeal/view/${col.id}`} className="text-left ant-btn-link ant-btn-block">
        <IconEye /> Ko'rish
      </Link>
      <Modal footer={null} title="Arizani tasdiqlash" visible={visible} onCancel={onCancel}>
        <Confirm onCancel={onCancel} onConfirm={onConfirm} item={selectedItem} />
      </Modal>
    </>
  )
}
const Confirm = ({ item, onCancel, onConfirm }) => {
  const tablePage = useSelector(s => s.tablePage || 1);
  const [approvals, getApprovals, loaderApprovals] = useGetDynamic();
  useEffect(() => {
    const query = tablePage > 1 ? { page: tablePage } : {}
    getApprovals(GET_COMMAND_APPROVERS, query);
  }, [tablePage]);
  const onFinish = (v) => {
    onConfirm({
      ...item,
      ...v,
    })
  }
  return (
    <Form
      initialValues={{
        approvers: item?.approvers?.map(subItem => subItem?.user.id)
      }}
      onFinish={onFinish}
      layout="vertical"
      name='confirmForm'
    >
      <Form.Item
        name="approvers"
        label="Kelishuvchilarni tanlang"
      >
        <Select
          placeholder="Kelishubvchilarni tanlang!"
          size="small"
          style={{
            width: '100%',
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          mode="multiple"
        >
          {
            approvals.map(item => {
              return (
                <Option value={item.id} key={`appealApprovers${item.id}`}>
                  {
                    item.full_name
                  }
                </Option>
              )
            })
          }
        </Select>
      </Form.Item>
      <p className="small text-muted">
        Agar kelishuvchilar mavjud bo'lmasa "Tasdiqlash" tugmasini bosing
      </p>
      <Form.Item className="text-right">
        <Button size="small" className="mr-2" type='danger' onClick={onCancel}>
          Bekor qilish
        </Button>
        <Button size="small" type="primary" htmlType='submit'>
          Tasdiqlash
        </Button>
      </Form.Item>
    </Form>
  )
}
function ListApprovals({ list = [] }) {
  return useMemo(() => {
    return list.map(item => {
      return (
        <div className="small">
          <StatusBadge status={item.status}>
            {
              item.user.full_name
            }
          </StatusBadge>
        </div>
      )
    });
  }, [list]);
}

function AppealEmployee({ type, data }) {
  // console.log(type);
  const dispatch = useDispatch();
  const user = useSelector(s => s.isUser || null);
  const applicationType = useSelector(s => s.appealActiveKey || null);
  const [initial, setInitial] = useState(true);

  useEffect(() => {
    if (type === applicationType && !initial) {
      setQuery({
        type: applicationType,
        status: 'new'
      })
    }
    setInitial(false);
  }, [applicationType])

  const [columns, setColumns] = useState([
    {
      title: 'T/R',
      dataIndex: 'id',
      render: (_, render, index) => {
        return <div>{index + 1}</div>
      }
    },
    {
      title: "Hodim",
      dataIndex: 'staff',
      width: '15%',
      render: (_, record) => (
        record?.user?.full_name ? record.user.full_name : record.survey ?
          <Link to={`/dashboard/surveys/${record.survey}`}>
            So'rovnomani ko'rish
          </Link>
          : ''
      ),
    },
    {
      title: "Ariza mazmuni",
      dataIndex: 'text',
      width: '60%'
    },
    {
      title: 'Ariza raqami',
      dataIndex: 'id',
      width: '10%'
    },
    {
      title: "Buyruq holari",
      dataIndex: 'has_order',
      render: (_, col) => {
        return (
          col.has_order ? "Shakillantirilgan" : 'Shakillantirilmagan'
        )
      }
    },
    {
      title: 'Holati',
      dataIndex: 'status',
      render: (_, record) => {
        return record.approvers.length ?
          <Popover placement="topLeft" title={"Kelishuvchilar"} content={<ListApprovals list={record.approvers} />} trigger="hover">
            <ButtonDefault className="p-0">
              <StatusBadge status={record.status} />
            </ButtonDefault>
          </Popover>
          : <StatusBadge status={record.status} />
      },
    }, {
      title: "Amallar",
      dataIndex: 'action',
      render: (_, col) => {
        return (
          <Dropdown overlay={<ConfirmButton col={col} />}>
            <div className="text-center">
              <ButtonDefault className="text-muted">
                <IconDotsHorizontal />
              </ButtonDefault>
            </div>
          </Dropdown>
        )
      }
    }
  ]);
  const [query, setQuery] = useState({
    type,
    status: user && user.current_role === 'HR' ? 'new' : 'approved',
  });

  const onChange = (e) => {
    setQuery({
      ...query,
      status: e.target.value,
      // page: 1
    })
    // dispatch({
    //   type: 'tableCurrent',
    //   payload: 1
    // })
  }

  return (
    <>
      <SortTypes type={type} activeStatus={query.status} onChange={onChange} />
      <AppTable search={query} type={GET_APPEAL_HR} data={data} columns={columns} />
    </>
  )
}
const stp = (state) => {
  return {
    data: state.applications || []
  }
}
export default connect(stp)(AppealEmployee);