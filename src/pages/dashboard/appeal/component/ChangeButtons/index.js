import {Button, Drawer, Form, Input, Popconfirm} from "antd";
import {IconCheckmarkCircle, IconClose, IconCloseCircle, IconSave} from "../../../../../components/Icon";
import Req from "../../../../../store/api";
import {PUT_VACATION_STAFF} from "../../../../../store/types";
import {useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import StatusBadge from "../../../../../styleComponents/StatusBadge";
import {useNavigate} from "react-router-dom";


function PopTile({ comment }) {
  return <div>
    Haqiqatdan ham bu arizani bekor qilmoxchimisiz!
    <div className="mt-2">
      <strong>Sabab izox</strong>
    </div>
    <div>
      <input ref={comment} placeholder="Bekor qilishga sabab yoki izox" className="ant-input ant-input-sm" type="text" />
    </div>
  </div>
}

function AllowAppealTitle({ comment }) {
  return <div>
    Haqiqatdan ham bu arizaga ruhsat bermoqchimisiz!
    <div className="mt-2">
      <strong>Izoh</strong>
    </div>
    <div>
      <input ref={comment} placeholder="Izoh" className="ant-input ant-input-sm" type="text" />
    </div>
  </div>
}

function ChangeButtons({ appeal, reload }) {
  const user = useSelector(s => s?.isUser);
  const navigate = useNavigate();
  const [item, setItem] = useState({});
  const [visible, setVisible] = useState(false);
  const onClose = () => {
    setVisible(false);
    setItem({});
  }
  const dispatch = useDispatch();
  const [statusLoader, setLoader] = useState(false);
  const comment = useRef();
  const update = (item) => {
    if ('current_role' in user && user.current_role === 'HO') {
      setItem(item);
      setStatus({
        status: 'confirmed'
      })
    } else {
      setItem(item);
      setVisible(true);
    }
  }
  const closePopconfirm = () => {
    comment.current.value = '';
  }
  const confirm = (id, status) => {
    setLoader(true);
    Req({
      type: `${PUT_VACATION_STAFF}${id}/`,
      data: {
        comment: comment ? comment.current.value : null,
        status
      }
    }).catch(err => {
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
    }).finally(() => {
      setLoader(false);
      comment.current.value = '';
      reload(Math.random())
    })
  }

  const onFinish = (v) => {
    setStatus({
      ...v,
      status: "pending"
    })
  }
  const setStatus = (data) => {
    Req({
      type: `${PUT_VACATION_STAFF}${item.id}/`,
      data: data
    })
      .then(res => {
        reload(Math.random());
        onClose();
      })
      .catch(err => {
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
      }).finally(() => {
        setItem({})
      })
  }
  return <div className="text-center">
    {
      appeal.status === 'new' ?
        <span>
          <Popconfirm
            placement="topRight"
            title={
              <PopTile comment={comment} />
            }
            onConfirm={() => confirm(appeal.id, 'rejected')}
            okText="Ha"
            cancelText="Yo'q"
            onCancel={closePopconfirm}
          >
            <Button disabled={statusLoader} size="small" className="mr-2 mb-2" type="danger">
              <IconCloseCircle /> Bekor qilish
            </Button>
          </Popconfirm>
          <Button size="small" type="primary" onClick={() => update(appeal)}>
            <IconCheckmarkCircle /> Qabul qilish
          </Button>
        </span> :
        appeal.status === 'pending' ?
          <Popconfirm
            placement="topRight"
            title={
              <AllowAppealTitle comment={comment} />
            }
            onConfirm={() => confirm(appeal.id, 'in_progress')}
            okText="Ha"
            cancelText="Yo'q"
            onCancel={closePopconfirm}
          >
            <Button disabled={statusLoader} size="small" className="mr-2" type="primary">
              <IconCheckmarkCircle /> Arizaga ruxsat berish
            </Button>
          </Popconfirm>
          :
          <Popconfirm
            placement="topRight"
            title={
              <AllowAppealTitle comment={comment} />
            }
            onConfirm={() => confirm(appeal.id, 'pending')}
            okText="Ha"
            cancelText="Yo'q"
            onCancel={closePopconfirm}
          >
            <Button disabled={statusLoader} size="small" className="ml-2" type="danger">
              <IconCloseCircle /> Bekor qilish
            </Button>
          </Popconfirm>

    }
    <Drawer title="Mexnat ta'tilini rasmiylashtirish" placement="right" onClose={onClose} visible={visible}>
      <Form
        name='vacation'
        onFinish={onFinish}
        layout='vertical'
        initialValues={item}
      >
        <Form.Item
          name='from_vacation_date'
          label="Ta'til rasmiylashtirish sanasi (boshlanish)"
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
          name='to_vacation_date'
          label="Ta'til rasmiylashtirish sanasi (tugash)"
          rules={[
            {
              required: true,
              message: "Iltimos tanlang!"
            }
          ]}
        >
          <Input type='date' />
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
  </div>
}
function Status({ status }) {
  return <Button disabled className="mb-2">
    {
      <StatusBadge status={status} />
    }
  </Button>
}
export default ChangeButtons;