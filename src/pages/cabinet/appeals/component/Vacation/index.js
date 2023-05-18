import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Button, Col, Dropdown, Popover, Row} from "antd";
import {Link, useNavigate} from "react-router-dom";

import {useGetDynamic} from "../../../../../hooks/useGet";
import {GET_APPEAL_HR, GET_APPEAL_PDF_URL} from "../../../../../store/types";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import AppTable from "../../../../../components/AppTabel";
import {IconDotsHorizontal, IconEdit, IconEye, IconFile, IconPlus} from "../../../../../components/Icon";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import Req from "../../../../../store/api";

const CabinetButton = ({ item, type }) => {
  const [loader,setLoader] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onDownloadPdf = ()=>{
    setLoader(true)
    Req({
      type: `${GET_APPEAL_PDF_URL}${item.id}/get_pdf/`
    }).then(res=>{
        window.open(`${process.env.REACT_APP_SERVER_URL_BY_FILE}${res.data.pdf_file}`, '_blank');
    }).catch(err=>{
      const {data,status} = err.response;
      if(status < 500){
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: data?.message
          }
        });
        if(status === 401 || status === '401'){
          localStorage.removeItem('token');
          dispatch({
            type: 'isUser',
            payload: null
          });
          navigate('/login')
        }
      }else{
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: "Tizim hatoligi qayta urinib ko'ring!"
          }
        });
      }
    }).finally(()=>{
      setLoader(false)
    })
  }
  return(
      <>
        <div>
          <Link to={`/cabinet/appeal-view/${item.id}`} className="ant-btn-link ant-btn-block">
            <IconEye/> Arizani ko'rish
          </Link>
        </div>
        {
          item.status === 'new' || item.status === 'rejected'?
              <div>
                <Link to={`/cabinet/edit-appeal/${item.id}`} className="ant-btn-link ant-btn-block">
                  <IconEdit/> Arizani o'zgartirish
                </Link>
              </div>:""
        }
        {
          item.status === 'confirmed' ?
              <div>
                <ButtonDefault className="ant-btn-link ant-btn-block" onClick={onDownloadPdf} disabled={loader}>
                  <IconFile/> PDF yuklab olish
                </ButtonDefault>
              </div> :""
        }
      </>
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
function AppealEmployee({ type }) {
  const [data, get, loader] = useGetDynamic();
  const reload = useSelector(s => s.reload || null);
  const [columns, setColumns] = useState([
    {
      title: 'Ariza raqami',
      dataIndex: 'id',
      width: '10%'
    },
    {
      title: "Ariza mazmuni",
      dataIndex: 'text',
      width: '60%'
    },
    {
      title: "Ariza sanasi",
      dataIndex: 'created_date',
      width: '10%'
    },
    {
      title: "Tasdiqlangan sanasi",
      dataIndex: 'confirmed_date',
      width: '10%'
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
      filters: [
        {
          text: 'Yangi',
          value: 'new',
        },
        {
          text: 'Tasdiqlangan',
          value: 'confirmed',
        },
      ],
      onFilter: (value, record) => record.address.indexOf(value) === 0,
    }, {
      title: "Amallar",
      dataIndex: 'action',
      width: '25%',
      render: (_, col) => {
        return (
            <Dropdown overlay={<CabinetButton item={col} type={type}/>}>
              <div className="text-center">
                <ButtonDefault className="text-muted">
                  <IconDotsHorizontal/>
                </ButtonDefault>
              </div>
            </Dropdown>
        )
      }
    }
  ]);

  useEffect(() => {
    get(GET_APPEAL_HR, { type });
  }, [reload, type]);
  return (
    <>
      <Row>
        {(type === 'dismiss' || type === 'business_trip' || type === 'general') &&
          <Col span={24} className="text-right">
            <Link to={`/cabinet/${type}`}>
              <Button type="primary">
                <IconPlus />  Arizani shakilantirish
              </Button>
            </Link>
          </Col>
        }
        <Col span={24} className="mt-3">
          <AppTable loader={loader} data={data} columns={columns} />
        </Col>
      </Row>
    </>
  )
}
export default AppealEmployee;