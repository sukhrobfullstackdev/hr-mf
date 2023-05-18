import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetDynamic } from "../../../../hooks/useGet";
import { useEffect, useState } from "react";
import { CHECK_APPEAL_STATUS_BY_HO, GET_APPEAL_HR, GET_APPEAL_ONE_HR } from "../../../../store/types";
import { Card, Col, Row, Select, Skeleton } from "antd";
import { IconChevronLeft, IconChevronRight } from "../../../../components/Icon";
import { useSelector } from "react-redux";
import NoData from "../../../../components/NoData";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import usePost from "../../../../hooks/usePost";
import StatusBadge from "../../../../styleComponents/StatusBadge";

function AppealView() {
  const user = useSelector(s => s.isUser || null);
  const [random, setRandom] = useState()
  const [post, postLoader] = usePost();
  const { id } = useParams();
  const [appeal, get, loader] = useGetDynamic();
  useEffect(() => {
    get(`${GET_APPEAL_ONE_HR}${id}`);
  }, [id, random]);
  const onReject = () => {
    post(
      CHECK_APPEAL_STATUS_BY_HO, {
      application_id: id,
      status: 'rejected'
    }
    )
  }
  const onVisible = () => {
    post(
      CHECK_APPEAL_STATUS_BY_HO,
      {
        application_id: id,
        status: 'confirmed'
      },
      () => {
        setRandom(Math.random());
      })
  }
  return (
    <>
      {
        loader && Object.keys(appeal).length ?
          <Loader /> :
          <Row gutter={16}>
            <Col span={18}>
              <Card style={{ position: 'sticky', top: 0, }} className="p-5">
                <div className="text-justify w-25 ml-auto">
                  {
                    appeal?.top
                  }
                </div>
                <h1 className="text-center my-4">
                  {appeal?.middle}
                </h1>
                <p className="text-justify mb-3">
                  {
                    appeal?.text
                  }
                </p>
                <Row className="py-3">
                  <Col span={12}>
                    Hodim: <strong>{appeal?.user?.full_name}</strong>
                  </Col>
                  <Col span={12} className="text-right">
                    Sana: <strong>{'created_date' in appeal ? new Date(appeal.created_date).toLocaleDateString() : ""}</strong>
                  </Col>
                </Row>
                <Row>
                  <Col span={24} className="border-top mt-3">
                    <p className="text-muted mb-0">
                      <strong>Kelishuvchilar</strong>
                    </p>
                    {
                      appeal.approvers && appeal.approvers.length ?
                        appeal.approvers.map(item => {
                          return (
                            <StatusBadge className="mt-1 mr-1" badgeType="pill" status={item.status} key={`approversuser${item.id}`}>
                              <span className="text-capitalize">
                                {item.user.full_name.toLowerCase()}
                              </span>
                            </StatusBadge>
                          )
                        }) :
                        <p className="text-muted small">
                          Kelishuvchilar mavjud emas!
                        </p>
                    }
                  </Col>
                </Row>
                <div className="mt-3 text-right">
                  <Link to="/dashboard/appeal" className="mr-3">
                    <IconChevronLeft /> Arizalar
                  </Link>
                  {
                    user && user.current_role === 'HO' && appeal.status && appeal.status !== 'confirmed' ?
                      <>
                        <ButtonDefault onClick={onReject} className="text-danger">
                          Bekor qilish
                        </ButtonDefault>
                        <ButtonDefault onClick={onVisible} className="text-primary pr-0">
                          Tasdiqlash
                        </ButtonDefault>
                      </> : ""
                  }
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <OtherAppeals random={random} />
              </Card>
            </Col>
          </Row>
      }
    </>
  )
}
const { Option } = Select;
const OtherAppeals = ({ random }) => {
  const { appealActiveKey = null, user = null } = useSelector(s => {
    return {
      ...s,
      user: s.isUser
    }
  });
  const [appealType, setAppealType] = useState('all');
  const [appeals, get, appealsLoader, _, totalCount] = useGetDynamic();
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [type, setType] = useState([
    {
      key: 'all',
      title: 'Barchasi'
    },
    {
      key: 'annual_leave',
      title: "Mexnat ta'tili arizasi",
    },
    {
      key: 'free_leave',
      title: `O'z hisobidan ta'til arizasi`,
    },
    {
      key: 'employment',
      title: `Ishga qabul qilish arizasi`,
    },
    {
      key: 'dismiss',
      title: `Ishdan bo'shatish arizasi`,
    },
    {
      key: 'business_trip',
      title: `Xizmat safari arizasi`,
    },
    {
      key: 'general',
      title: `Umumiy ariza`,
    },
  ]);
  useEffect(() => {
    get(GET_APPEAL_HR, {
      type: appealType === 'all' ? '' : appealType,
      page: page,
      status: user && user.current_role === 'HO' ? 'approved' : 'new'
    })
  }, [appealType, appealActiveKey, page, random]);
  const onSetAppealId = (id) => {
    navigate(`/dashboard/appeal/view/${id}`);
  };
  const onChangeSelect = (v) => {
    setAppealType(v);
  }
  return (
    <div>
      <Row align="middle" className="text-muted small border-bottom">
        <Col span={12}>
          {
            user && user.current_role === 'HO' ? 'Tasdiqlanishdagi' : 'Kelib tushgan'
          }
        </Col>
        <Col span={12}>
          <Select onChange={onChangeSelect} size="small" style={{ width: '100%' }} defaultValue={'all'}>
            {
              type.map(item => {
                return <Option value={item.key} key={item.key}>{item.title}</Option>
              })
            }
          </Select>
        </Col>
      </Row>
      {
        appealsLoader ?
          <div className="mt-3">
            <Skeleton active />
            <Skeleton active />
          </div> :
          appeals.length ? appeals.map(item => {
            return (
              <div key={`appeals${item.id}`} className="py-2 border-bottom button-effect" onClick={() => onSetAppealId(item.id)}>
                <p className="text-muted small m-0">
                  {type.find(v => v.key === item.type).title}
                </p>
                <div className="py-1">
                  <strong className="text-capitalize">
                    {
                      item.user?.full_name.toLowerCase()
                    }
                  </strong>
                </div>
                <p className="mb-0 small text-muted">
                  Sana: {item.created_date}
                </p>
              </div>
            )
          }) :
            <div className="mt-3">
              <NoData size="sm" />
            </div>
      }
      <Row align="middle" justify="end" className="mt-3 small text-muted">
        <Col className="text-muted">
          <strong>{totalCount}</strong> ta dan
          <strong className="px-2">{appeals.length}</strong>
          <button onClick={() => setPage(page - 1)} disabled={page <= 1} className="button-un-styled">
            <IconChevronLeft />
          </button>
          <strong className="px-2">{page}</strong>
          <button onClick={() => setPage(page + 1)} disabled={page >= totalCount / 10} className="button-un-styled">
            <IconChevronRight />
          </button>
        </Col>
      </Row>
    </div>
  )
}
const Loader = () => {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Skeleton active />
      </Col>
      <Col span={8}>
        <Skeleton active />
      </Col>
      <Col span={8}>
        <Skeleton active />
      </Col>
    </Row>
  )
}
export default AppealView;