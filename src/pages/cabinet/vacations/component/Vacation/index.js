import React, { useEffect, useState } from "react";
import { Button, Col, Drawer, Form, Input, Row, Popover } from "antd";
import { Link } from "react-router-dom";
import { MessageOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { useGetDynamic } from "../../../../../hooks/useGet";
import { IconClose, IconEdit, IconPlus, IconSave } from "../../../../../components/Icon";
import AppTable from "../../../../../components/AppTabel";
import TextArea from "antd/es/input/TextArea";
import { GET_VACATION_STAFF, POST_VACATION_STAFF, PUT_VACATION_STAFF } from "../../../../../store/types";
import Req from "../../../../../store/api";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import ButtonDefault from "../../../../../styleComponents/ButtonDefault";
import CommentsPopover from "../../../../../components/CommentsPopover";

function Vacation({ type }) {
  const [item, setItem] = useState({});
  const [visible, setVisible] = useState(false);
  
  const [data, get, loader] = useGetDynamic();
  const reload = useSelector(s => s.reload || null);
  const dispatch = useDispatch();
  
  const update = (item) => {
    setItem(item);
    setVisible(true);
  }

  const [columns, _] = useState([
    {
      title: "Ta'til raqami",
      dataIndex: 'id',
      width: '10%'
    },
    {
      title: "Ta'til sanasi",
      dataIndex: 'begin_date'
    },
    {
      title: "Tatil oralig'i",
      render: (record) => `${record?.from_vacation_date ? record?.from_vacation_date : '-'} / ${record?.to_vacation_date ? record?.to_vacation_date : '-'}`
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
            content={<CommentsPopover rightTitle={'Bosh kadr'} right={col?.hr_comments} leftTitle={'Hodim'} left={col?.staff_comments} />}
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
        if (col.status === 'confirmed') {
          return <StatusBadge status={`${col.status}_1`} />
        }
        return <StatusBadge status={col.status} />
      }
    }, {
      title: "Amallar",
      dataIndex: 'action',
      render: (_, col) => {
        if (col.status === 'in_progress') {
          return (
            <Button size="small" type="primary">
              <Link to={`/cabinet/${col.vacation_type}`}>
                Ariza shakillantirish
              </Link>
            </Button>
          )
        } else if (col.status === 'confirmed') {
          return (
            <Button size="small" type="primary" disabled>
              Ariza shakillantirilgan
            </Button>
          )
        }

        return <div className="text-right">
          {
            col.status === 'new' || col.status === 'rejected' ?
              <Button size="small" type="primary" onClick={() => update(col)}>
                <IconEdit /> O'zgartirish
              </Button> :
              <Button size="small" type="primary" disabled>
                <IconEdit /> O'zgartirish
              </Button>
          }
        </div>
      }
    }
  ]);


  useEffect(() => {
    get(GET_VACATION_STAFF, { vacation_type:type });

  }, [reload, type]);



  const onFinish = (v) => {
    v.begin_date = moment(v.begin_date).format('YYYY-MM-DD');
    Req({
      type: Object.keys(item).length ? `${PUT_VACATION_STAFF}${item.id}/` : POST_VACATION_STAFF,
      data: {
        ...v,
        vacation_type: type
      }
    })
      .then(res => {
        // setReload(Math.random());
        onClose();
        setItem({})
      })
      .catch(err => {
        dispatch({
          type: 'toast',
          payload: {
            type: 'error',
            message: "Hatolik, qayta urinib ko'ring!"
          }
        })
      });
  }

  const onClose = () => {
    setVisible(false);
  }
  
  const onOpen = () => {
    setVisible(true);
  }
  return <>
    <Row>
      <Col span={24} className="text-right">
        <Button type='primary' onClick={onOpen}>
          <IconPlus /> Ta'til so'rash
        </Button>
      </Col>
      <Col span={24} className="mt-3">
        <AppTable loading={loader} data={data} columns={columns} />
      </Col>
    </Row>
    <Drawer title="Mexnat ta'tilini rasmiylashtirish" placement="right" onClose={onClose} visible={visible}>
      <Form
        name='vacation'
        onFinish={onFinish}
        layout='vertical'
        initialValues={item}
      >
        <Form.Item
          name='begin_date'
          label="Taxminiy ta'tiliga chiqish sanasi"
          rules={[
            {
              required: true,
              message: "Iltimos tanlang!"
            }
          ]}
        >
          <Input type='date' />
        </Form.Item>
        <Form.Item
          name='comment'
          label="Izox"
        >
          <TextArea placeholder="Qo'shimcha ma'lumot yoki izox" />
        </Form.Item>
        <Form.Item className="text-right">
          <Button type="danger" size='small' className="mr-2" onClick={onClose}>
            <IconClose /> Bekor qilish
          </Button>
          <Button type="primary" htmlType='submit' size='small'>
            <IconSave /> Yuborish
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  </>
}
export default Vacation