
import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Card, Pagination, Table, Row, Col, Spin, Button } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons'
import { useDispatch } from "react-redux";

import { GET_ONE_ORG_STAFFLIST } from "../../../store/types";
import { useSimpleGet } from "../../../hooks/useGet";
import NoData from "../../../components/NoData";
import AppTabel from "../../../components/AppTabel";
import Req from "../../../store/api";

const Bottom = styled.div`
position: fixed;
bottom: 0;
z-index: 9;
`

const BackButton = styled.div`
display: flex;
align-items: center;
gap: 20px
`

const ReportContent = ({ item }) => {
  return (
    <Card className="mb-3">
      <div className="text-center mb-3">
        <strong>{item.name}</strong>
      </div>
      <Content item={item} />
    </Card>
  )
}

const Content = ({ item = [] }) => {
  const column = useMemo(() => [
    {
      title: 'Lavozim',
      dataIndex: 'name',
      width: '30%'
    }, {
      title: 'Shtat birligi',
      dataIndex: 'count',
      render: (_, col) => <div className="text-right">{col.count}</div>
    }, {
      title: `YTS bop'yicha razryad`,
      dataIndex: 'razryad_coefficient',
      render: (_, col) => {
        const SubVal = col.razryad_subtract + '-' + col.razryad_value + '%';
        const val = col.razryad_value;
        return (
          <div className="text-right">

            {
              col.razryad_subtract !== 0 ? SubVal : val
            }

          </div>

        )
      }
    }, {
      title: 'Tarif koefitsenti',
      dataIndex: 'razryad_coefficient',
      render: (_, col) => <div className="text-right">{col.razryad_coefficient || 'x'}</div>
    },
    {
      title: "To`g`irlovchi koefitsenti",
      dataIndex: 'right_coefficient',
      render: (_, col) => <div className="text-right">{col.right_coefficient || 'x'}</div>
    },
    {
      title: "Lavozim bo'yicha oylik ish xaqqi",
      dataIndex: 'minimal_salary',
      render: (_, col) =>
        <div className="text-right">
          {
            col.minimal_salary ? Intl.NumberFormat().format(col.minimal_salary) : 'x'
          }
        </div>
    }, {
      title: "Rag'batlantirish koeffitsienti",
      dataIndex: 'bonus_salary',
      render: (_, col) =>
        <div className="text-right">
          {
            col.bonus_salary ? Intl.NumberFormat().format(col.bonus_salary) : 'x'
          }
        </div>
    }, {
      title: 'Jami ish xaqqi',
      dataIndex: 'base_salary',
      render: (_, col) => <div className="text-right">{col.base_salary ? Intl.NumberFormat().format(col.base_salary) : 'x'}</div>
    },
  ], []);

  const summary = (data = []) => {
    return (
      <Table.Summary.Row>
        <Table.Summary.Cell index={0}> 
          <strong>Jami</strong>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={1}>
          <p className="m-0 text-right">
            <strong>{data.total_count.toString()}</strong>
          </p>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={2}>
          <p className="m-0 text-right">
            <strong>x</strong>
          </p>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3}>
          <p className="m-0 text-right">
            <strong>x</strong>
          </p>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={3}>
          <p className="m-0 text-right">
            <strong>x</strong>
          </p>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <p className="m-0 text-right">
            <strong>
              {Intl.NumberFormat().format(data.total_minimal_salary)}
            </strong>
          </p>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={4}>
          <p className="m-0 text-right">
            <strong>
              {Intl.NumberFormat().format(data.total_bonus_salary)}
            </strong>
          </p>
        </Table.Summary.Cell>
        <Table.Summary.Cell index={5}>
          <p className="m-0 text-right">
            <strong>
              {Intl.NumberFormat().format(data.total_base_salary)}
            </strong>
          </p>
        </Table.Summary.Cell>
      </Table.Summary.Row>
    )
  }

  return (
    <AppTabel
      summary={() => summary(item)}
      size="small"
      data={item?.positions}
      pagination={false}
      columns={column}
    />
  )
}

const OrgStaffs = () => {
  const { id } = useParams();
  const [data, get, loader] = useSimpleGet();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    get(`${GET_ONE_ORG_STAFFLIST}${id}/`);
  }, [id]);

  const downloadFileHandler = useCallback(() => {
    setLoading(true)
    Req({
      type: `${GET_ONE_ORG_STAFFLIST}${data?.results[0].id}/get_excel/`,
      responseType: "blob"
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'shtatka.xlsx')
      document.body.appendChild(link)
      link.click()
    }).catch(err => {
      const { data, status } = err.response;
      if (status < 500) {
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: data?.message
          }
        });
        if (status === 401 || status === '401') {
          localStorage.removeItem('token');
          dispatch({
            type: 'isUser',
            payload: null
          });
          navigate('/login')
        }
      } else {
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: "Tizim hatoligi qayta urinib ko'ring!"
          }
        });
      }
    })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch, data, navigate])

  const paginationChangeHandler = (page, pageSize) => {
    get(
      `${GET_ONE_ORG_STAFFLIST}${id}/`,
      {
        page,
        page_size: pageSize
      }
    );
  }

  return (
    <Spin size='large' spinning={loader || loading} style={{ minHeight: '90vh' }}>
      <h1 className="text-center">
        <strong>Shtatlar jadvali</strong>
      </h1>
      {data?.results?.map(item => <React.Fragment key={item.id}>
        <Row gutter={[15, 0]} className='pb-3'>
          <Col md={20}>
            <div>
              <strong>Tashkilotning to'liq nomi:</strong>&nbsp;
              {item.name}
            </div>
            <div>
              <strong>To'liq manzili:</strong>&nbsp;
              {item.address}
            </div>
            <div>
              <strong>Bo'lim:</strong>&nbsp;
              {item.department_code}
            </div>
            <div>
              <strong>Kichik bo'lim:</strong>&nbsp;
              {item.small_department_code}
            </div>
            <div>
              <strong>Bob:</strong>&nbsp;
              {item.chapter_code}
            </div>
          </Col>
          <Col md={4}>
            <div className="text-right">
              <Button type="primary" onClick={downloadFileHandler}>
                <DownloadOutlined /> Yuklab olish
              </Button>
            </div>
          </Col>
        </Row>
        {
          item.departments ?
            item.departments.map((item) => {
              return (
                <ReportContent item={item} key={`reportKey${item.id}`} />
              )
            }) :
            <Card>
              <NoData size="sm" />
            </Card>
        }
      </React.Fragment>)}
      <Bottom>
        <Card size="small">
          <BackButton>
            <Pagination
              showQuickJumper
              defaultPageSize={1}
              total={data?.count}
              showSizeChanger={false}
              locale={{ jump_to: "Sahifa", page: '' }}
              onChange={paginationChangeHandler}
            />
            <Link to='/state/orgStaffList/' className="ant-btn ant-btn-danger mr-3">
              <ArrowLeftOutlined /> Ortga
            </Link>
          </BackButton>
        </Card>
      </Bottom>
    </Spin>
  )
}

export default OrgStaffs