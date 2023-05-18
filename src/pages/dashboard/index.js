import {Layout, Skeleton} from "antd";
import {Outlet, useNavigate} from "react-router-dom";
import Style from "styled-components";
import Bar from "./components/Bar";
import DashboardContent from "./components/Content";
import DashboardHeader from "./components/Header";
import Auth from "../../components/Auth";
import {useEffect, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {SELECT_ORGANISATION} from "../../store/types";
import SelectOrganComponent from "./components/SelectOrganComponent";
import Req from "../../store/api";
import {IconChevronLeft, IconChevronRight} from "../../components/Icon";

const Wrapper = Style.div`
    width: 100%;
    height: 100vh;
`
const ButtonSider = Style.button`
    z-index:99;
    background-color: #fff;
    border:none;
    width: 100%;
    display: block;
    box-shadow: 0 -5px 10px rgba(0,0,0,0.05);
    position: absolute;
    left:0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    padding: .75rem 0;
    border-radius: 0 0 12px 12px;
`
const {Sider,Header,Content} = Layout;
function Dashboard({isUser = null, activeOrganisation = null, siderHide}){
    const dispatch = useDispatch();
    const [loader,setLoader] = useState(true);
    useEffect(()=>{
        if(!activeOrganisation){
            if(isUser && Object.keys(isUser).length){
                if(isUser.role.indexOf("SA") >= 0){
                    setLoader(false);
                }else if(isUser.organizations.length && isUser.organizations.length === 1){
                    Req({
                        type:SELECT_ORGANISATION,
                        data:{
                            organization_id: isUser.organizations[0].id
                        }
                    })
                    dispatch({
                        type: 'activeOrganisation',
                        payload: isUser.organizations[0]
                    })
                }
            }
        }
    },[isUser]);
    useEffect(()=>{
        if(activeOrganisation){
            setLoader(false);
        }
    },[activeOrganisation]);
    const onToggle = ()=>{
        dispatch({
            type: 'siderHide',
            payload: !siderHide
        })
    }
    return(
        <Auth>
            <AutDashboard>
                <Wrapper className="dashboard">
                    <Layout>
                        <Sider className={`${siderHide ? 'siderHide' : 'siderShow overflow-hidden'}`} width={siderHide ? 70 : 240}>
                            {
                                loader ?
                                    <div className="p-3">
                                        <h1>Asosiy menu</h1>
                                        <Skeleton active paragraph={{rows: 10}}/>
                                    </div>
                                    :
                                    <Bar siderHide={siderHide}/>
                            }
                            <ButtonSider onClick={onToggle}>
                                {
                                    siderHide ? <IconChevronRight/>:<IconChevronLeft/>
                                }

                            </ButtonSider>
                        </Sider>
                        <Layout>
                            <Header>
                                <DashboardHeader/>
                            </Header>
                            <Content>
                                <DashboardContent>
                                    {
                                        loader ?
                                            <SelectOrganComponent user={isUser}/>:
                                            <Outlet/>

                                    }
                                </DashboardContent>
                            </Content>
                        </Layout>
                    </Layout>
                </Wrapper>
            </AutDashboard>
        </Auth>
    )
}
const AutDashboard = ({children})=>{
    const user = useSelector(s=>s.isUser || null);
    const navigate = useNavigate()
    useEffect(()=>{
        if(user && Object.keys(user).length){
            if(user.current_role === 'S'){
                navigate('/cabinet/info')
            }
        }
    },[user]);
    return children
}
export default connect((s)=>{
    return {
        isUser: s.isUser || null,
        activeOrganisation: s.activeOrganisation || null,
        siderHide: s.siderHide || false
    }
})(Dashboard);