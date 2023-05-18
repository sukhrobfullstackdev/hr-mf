import {Card, Col, Row} from "antd";
import Style from "styled-components";
import UserAvatar from "../UserAvatar";
import {connect, useDispatch} from "react-redux";
import Small from "../../../../styleComponents/Small";
import {Link, useNavigate} from "react-router-dom";
import UserName from "../../../../styleComponents/UserName";
import useJob from "../../../../hooks/useJob";
import {IconChevronLeft, IconChevronRight, IconLogOut, IconSettings} from "../../../../components/Icon";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {useEffect, useMemo} from "react";

const H1 = Style.h1`
    font-size: ${p => p.sm ? '16px':'36px'};
    line-height:${p => p.sm ? '20px':'54px'}; ;
    margin: 0;
`
const ButtonSideBarToggle = Style.button`
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    font-size: 20px;
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 9;
    transition: all 0.25s linear;
    &:hover{
        background-color: #f1f1f1;
        box-shadow: 0 2px 8px rgba(0,0,0,.2);
    }
`
function SideBar({user = {}, mode = false, windowWidth = 0,sideBarHide}){
    const dispatch = useDispatch();
    const jobs = useJob();
    const avatar = useMemo(()=>{
        return (
            user && user.images ?
                <UserAvatar  size={sideBarHide ? 'sm' : 'lg'} file={user.images} gender={user.gender}/> : ''
        )
    },[user,sideBarHide]);
    const onHide = ()=>{
        dispatch({
            type: 'sideBarHide',
            payload: !sideBarHide
        })
    }
    return useMemo(()=>{
        return(
            <div style={{position: 'sticky', top: 0}}>
                {
                    windowWidth <= 768 ?
                        <ButtonSideBarToggle onClick={onHide}>
                            {
                                sideBarHide ? <IconChevronRight/> : <IconChevronLeft/>
                            }
                        </ButtonSideBarToggle>:""
                }
                <Card className={`cabinet-sidebar`}>
                    {
                        !sideBarHide ? <H1>Mening profilim</H1> :""
                    }
                    <Row align='middle'>
                        <Col xs={sideBarHide ? 6: 24} sm={sideBarHide ? 6 : 24} md={sideBarHide ? 8 : 24} lg={24} xxl={24}>
                            {avatar}
                        </Col>
                        <Col xs={sideBarHide ? 18: 24} sm={sideBarHide ? 18 : 24} md={sideBarHide ? 16 : 24} lg={24} xxl={24}>
                            <UserName size={sideBarHide ? '18px' : false}>
                                {user?.full_name}
                            </UserName>
                        </Col>
                    </Row>
                    {
                        !sideBarHide ? Array.isArray(jobs) ?
                            jobs.map(item=>{
                                return <Job key={`job${item.dep_id}`} job={item}/>
                            }) :
                            <Job job={jobs}/> : <SideBarFooter card={false}/>
                    }
                </Card>
                {
                    !sideBarHide ? <SideBarFooter/> : ''
                }
            </div>
        )
    },[jobs,avatar,user,sideBarHide]);
}

function Job({job}){
    return  (
        <>
            <div className="mb-2">
                <Small className="text-muted">Ish joyi</Small>
                <Small className="py-1">{job.org}</Small>
            </div>
            <div className="mb-2">
                <Small className="text-muted">Bo'lim - departament nomi</Small>
                <Small className="py-1">{job.dep_name}</Small>
            </div>
            <div className="mb-2">
                <Small className="text-muted">Lavozim</Small>
                <Small className="py-1">{job.position}</Small>
            </div>
            <div className="mb-2">
                <Small className="text-muted">Ish boshlash sanasi</Small>
                <Small className="py-1">{job.begin_date}</Small>
            </div>
        </>
    )
}
const SideBarFooter = ({card = true})=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logOut = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('userChat');
        dispatch({
            type: 'userChat',
            payload: null
        })
        localStorage.removeItem('isStaffList');
        dispatch({
            type: 'activeOrganisation',
            payload: null
        })
        dispatch({
            type: 'isUser',
            payload: null
        });
        navigate('/login');
    }
    return(
        <Card size={card ? 'default' : 'small'} bordered={card} className={`${card ? 'my-3' : ''}`}>
            <Row>
                <Col xs={8} sm={8} md={8} lg={12} xxl={12}>
                    <Link to={'/cabinet/settings'} className="text-body">
                        <IconSettings/> Sozlamalar
                    </Link>
                </Col>
                <Col xs={16} sm={16} md={16} lg={12} xxl={12} className="text-right">
                    <ButtonDefault onClick={logOut}>
                        <IconLogOut/> Tizimdan chiqish
                    </ButtonDefault>
                </Col>
            </Row>
        </Card>
    )
}
export default connect((s)=>{
    return{
        user: s?.isUser,
        mode: s?.mode,
        windowWidth: s.windowWidth || 0,
        sideBarHide: s.sideBarHide || false
    }
})(SideBar)