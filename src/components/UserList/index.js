import {Col, Dropdown, Row, Skeleton} from "antd";
import UserAvatar from "../../styleComponents/UserAvatar";
import './index.scss';
import ButtonDefault from "../../styleComponents/ButtonDefault";
import {
    IconArrowLeftFill,
    IconArrowRightFill,
    IconBookmark,
    IconChevronDown,
    IconChevronRight,
    IconDotsHorizontal, IconDownload,
    IconEdit,
    IconEye,
    IconForwardFill,
    IconSkipBackFill, IconTrash
} from "../Icon";
import {useEffect, useLayoutEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {DeleteOutlined} from "@ant-design/icons";
import {GET_STAFF_LIST_BT_ID, REMOVE_SECTION} from "../../store/types";
import {connect, useDispatch} from "react-redux";
import {useGetDynamic} from "../../hooks/useGet";
import Loader from "../Loader";


function CollapseList({user= {}, isShow}){
    const [data,get,loader] = useGetDynamic();
    useEffect(()=>{
        if(isShow && !Object.keys(data).length){
           get(`${GET_STAFF_LIST_BT_ID}/${user.id}`, {choice: 'K'})
       }
    },[isShow,user.id]);
    return  loader ?
                <Loader full={false}/> :
                Object.keys(data).length &&
                data.sickness_tables.map((item,i)=>{
                    return  <Row key={`sickness${item.id}`}
                                 gutter={16}
                                 className={`${i >= data.sickness_tables.length - 1 ? '' : 'border-bottom' } py-1`}
                                 align='middle'>
                                <Col span={1}>
                                    #{item.id}
                                </Col>
                                <Col span={4}>
                                    <span className="user-list-collapse-title">{item.sickness_type}</span>
                                    <p className="text-muted m-0">
                                        Kasallik turi
                                    </p>
                                </Col>
                                <Col span={4}>
                                    <span className="user-list-collapse-title">{item.hospital_name}</span>
                                    <p className="text-muted m-0">
                                        Shifoxona nomi
                                    </p>
                                </Col>
                                <Col span={2}>
                                    <span className="user-list-collapse-title">{new Date(item.begin_date).toLocaleDateString()}</span>
                                    <p className="text-muted m-0">
                                        Boshlanish vaqti
                                    </p>
                                </Col>
                                <Col span={2}>
                                    <span className="user-list-collapse-title">{new Date(item.end_date).toLocaleDateString()}</span>
                                    <p className="text-muted m-0">
                                        Tugash vaqti
                                    </p>
                                </Col>
                                <Col span={2} className="ml-auto">
                                    <span className="user-list-collapse-title">{item.template_number}</span>
                                    <p className="text-muted m-0">
                                        Blanka raqami
                                    </p>
                                </Col>
                                <Col span={2} className="ml-auto">
                                    <span className="user-list-collapse-title">{item.serial_number}</span>
                                    <p className="text-muted m-0">
                                        Seriasi va raqami
                                    </p>
                                </Col>
                                <Col span={3} className="ml-auto">
                                    <span className="user-list-collapse-title">
                                        <span>{item.total_years} yil, </span>
                                        <span>{item.total_months} oy, </span>
                                        <span>{item.total_days} kun</span>
                                    </span>
                                    <p className="text-muted m-0">
                                        Hodimning staji
                                    </p>
                                </Col>
                                <Col>
                                    <Link to={`/dashboard/staff/is-ill/update/${item.id}`}>
                                        <IconEdit/>Taxrirlash
                                    </Link>
                                </Col>
                            </Row>
                })
}

function List({user, index, activeTab}){
    const dispatch = useDispatch();
    const [isShow, setIsShow] = useState(false);
    const onRemove =(id)=>{
        dispatch({
            type: REMOVE_SECTION,
            payload: id
        })
    }
    const menu =(
        <>
            <div className='px-2 py-1'>
                <a target="_blank" href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/user/reference/download/?user_id=${user.id}`} className="w-100">
                    <IconDownload/> Ma'lumotnoma
                </a>
            </div>
            <div className='px-2 py-1'>
                <a target="_blank"
                   href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/v1/survey/download/?key=${user.survey_key}`}
                   className={`w-100 ${user.survey_key || 'disabled'}`}>
                    <IconDownload/> So'rovnoma
                </a>
            </div>
            <div className='px-2 py-1'>
                <Link to={`/dashboard/staff/${user.id}`} className="w-100">
                    <IconEdit/> Tahrirlash
                </Link>
            </div>
            <div className='px-2 py-1'>
                <Link to={`/dashboard/staff/view/${user.id}`} className="w-100">
                    <IconEye/> Ko'rish
                </Link>
            </div>
            <div className="w-100 px-2 py-1 cursor-pointer text-danger" onClick={()=>onRemove(user.id)}>
                <IconTrash/> Remove
            </div>
        </>
    )
    const actionMenu = (
        <div>
            {/*<div onClick={()=>setUser(user,`/dashboard/staff/is-ill/${user.id}`)}  className="ant-btn-default cursor-pointer px-2 pt-1">*/}
            {/*    Bemorlikni rasmiylashtirish*/}
            {/*</div>*/}
            <div className="text-muted px-2">
                Xizmat safarini rasmiylashtirish
            </div>
            <div className="text-muted px-2">
                Mexnat ta'tilini rasmiylashtirish
            </div>
            <div className="text-muted px-2 pb-1">
                Dikretni rasmiylashtirish
            </div>
        </div>
    );
    return  <>
                <div className="user-list-card" style={{animationDelay: `${index/10}s`}}>
                    <Row align={"middle"} justify='space-between'>
                        {
                            activeTab === 2 ?
                                <Col span={1}>
                                    <ButtonDefault onClick={()=>setIsShow(!isShow)}>
                                        {
                                            isShow ?
                                                <IconChevronDown/>:
                                                <IconChevronRight/>
                                        }
                                    </ButtonDefault>
                                </Col> :''
                        }
                        <Col span={1}>
                            <UserAvatar size='sm' user={user}/>
                        </Col>
                        <Col span={5} className="px-3">
                            <div className="user-list-name">{user.full_name && user.full_name.toLowerCase()}</div>
                            <p className="text-muted m-0">F.I.SH.</p>
                        </Col>
                        <Col span={4} className="px-3">
                            <div className="user-list-name">{user.position_names || 'Mavjud emas!'}</div>
                            <p className="text-muted m-0">Lavozimi</p>
                        </Col>
                        <Col span={4} className="px-3">
                            <div className="user-list-name">{user.mob_phone_no || 'Mavjud emas!'}</div>
                            <p className="text-muted m-0">Telefon raqami</p>
                        </Col>
                        <Col span={4} className="px-3">
                            <div className="user-list-name">{user.email || 'Mavjud emas!'}</div>
                            <p className="text-muted m-0">Elektron pochta</p>
                        </Col>
                        <Col span={2} className="px-3">
                            <div className="user-list-name">{user.birth_city ? "Mavjud" : 'Mavjud emas!'}</div>
                            <p className="text-muted m-0">Tug'ilgan joyi</p>
                        </Col>
                        <Col span={2} className="text-right">
                            <Dropdown overlay={actionMenu} placement="bottomRight" className="p-0">
                                <ButtonDefault>
                                    <IconBookmark/>
                                </ButtonDefault>
                            </Dropdown>
                        </Col>
                        <Col span={2} className="text-right">
                            <Dropdown overlay={menu} placement="bottomRight">
                                <ButtonDefault>
                                    <IconDotsHorizontal/>
                                </ButtonDefault>
                            </Dropdown>
                        </Col>
                    </Row>
                </div>
                <div className={`user-list-collapse ${isShow ? 'show' : ''}`}>
                    <CollapseList isShow={isShow} user={user}/>
                </div>
            </>
}

function UserList({
    staffs = [],
    loader = true,
    activeTab = 1,
    tableCount,
    page,
    pageSize
}){
    const dispatch = useDispatch();
    const select = useRef();
    const toRight = ()=>{
       if(tableCount > pageSize * page){
           dispatch({
               type: 'page',
               payload: page + 1
           })
       }
    }
    const toLeft = ()=>{
        if(page > 1){
            dispatch({
                type: 'page',
                payload: page - 1
            })
        }
    }
    const toStart = ()=>{
        dispatch({
            type: 'page',
            payload: 1
        })
    }
    const toEnd = ()=>{
        dispatch({
            type: 'page',
            payload: Math.ceil(tableCount / pageSize)
        });
    }
    const changeSize = ()=>{
        dispatch({
            type: 'pageSize',
            payload: select.current.value
        })
    }
    return  <div className="user-list mt-3">
        {
            loader ?
                <div>
                    <div className="user-list-card">
                        <Skeleton active avatar paragraph={{rows: 0}}/>
                    </div>
                    <div className="user-list-card">
                        <Skeleton active avatar paragraph={{rows: 0}}/>
                    </div>
                    <div className="user-list-card">
                        <Skeleton active avatar paragraph={{rows: 0}}/>
                    </div>
                    <div className="user-list-card">
                        <Skeleton active avatar paragraph={{rows: 0}}/>
                    </div>
                </div>:
                <>
                    {
                        staffs.map((user,i)=>{
                            return <List activeTab={activeTab} index={i / (page / 2)} key={`userList${user.id}`} user={user}/>
                        })
                    }
                </>
        }
                <ul className={`user-list-pagination ${page >= tableCount ? 'disabled' :''}`}>
                    <li>
                        <label htmlFor="userSelect">Qatorlar: </label>
                        <select onChange={changeSize} ref={select} name="user-select" id='userSelect'>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={30}>30</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </li>
                    <li className="px-3">
                        {tableCount} <span className="px-1">ta dan</span> {pageSize}-{page} ta
                    </li>
                    <li className={`pagination-btn ${page <= 1 ? 'disabled' : ''}`} onClick={toStart}>
                        <IconSkipBackFill color={page <= 1 ? '#2E3A59' : '#697E8D'}/>
                    </li>
                    <li className={`pagination-btn ${page <= 1 ? 'disabled' : ''}`} onClick={toLeft}>
                        <IconArrowLeftFill color={page <= 1 ? '#2E3A59' : '#697E8D'}/>
                    </li>
                    <li className={`pagination-btn ${pageSize * page >= tableCount ? 'disabled' : ''}`} onClick={toRight}>
                        <IconArrowRightFill color={pageSize * page <= tableCount ? '#2E3A59' : '#697E8D'}/>
                    </li>
                    <li className={`pagination-btn ${pageSize * page >= tableCount? 'disabled' : ''}`} onClick={toEnd}>
                        <IconForwardFill color={pageSize * page <= tableCount ? '#2E3A59' : "#697E8D"}/>
                    </li>
                </ul>
            </div>
}
const stp = (state)=>{
    return {
        loader: state.loader || false,
        staffs: state.staffs || [],
        tableCount: state.tableCount || 0,
        page: state.page || 1,
        pageSize: state.pageSize || 10
    }
}
export default connect(stp)(UserList)