import {Card, Carousel, Col, Row} from "antd";
import UserMainInfo from "../UserMainInfo";
import UserJob from "../UserJob";
import UserTable from "../UserTable";
import UserEducation from "../UserEducation";
import UserSurvey from "../UserSurvey";
import {Outlet, useNavigate, useOutlet, useParams} from "react-router-dom";
import UserIdentification from "../UserIdentification";
import UserFamilyInfo from "../UserFamilyInfo";
import UserDismissSheet from "../UserDismissSheet";
import UserSalary from "../UserSalary";
import UserTax from "../UserTax";
import UserVisitedCard from "../UserVisitedCard";
import {IconChevronLeft, IconChevronRight} from "../../../../components/Icon";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {useMemo, useRef} from "react";
import AppTab, {AppTabButton} from "../../../../components/AppTab";
import App from "../../../../App";


function Content(props){
    const outlet = useOutlet();
    const navigate = useNavigate();
    const {infoKey} = useParams();
    const carousel = useRef();
    const onChangeTab = (infoKey)=>{
        navigate(`/cabinet/info/${infoKey}`);
    }
    const next = ()=>{
        carousel.current.next();
    }
    const prev = ()=>{
        carousel.current.prev();
    }
    const tabContent = useMemo(()=>{
        return <TabContent infoKey={infoKey}/>
    },[infoKey])
    return  (
        outlet ?
            <Outlet/>:
            <Card className="h-100">
                <AppTab className="py-2">
                    <AppTabButton onClick={()=>onChangeTab('infos')} isActive={infoKey === 'infos'}>Mening ma'lumotlarim</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('jobs')} isActive={infoKey === 'jobs'}>Mexnat daftarchasi</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('family')} isActive={infoKey === 'family'}>Qarindoshlar</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('dismiss-sheet')} isActive={infoKey === 'dismiss-sheet'}>Ishdan bo'shash varaqasi</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('survey-info')} isActive={infoKey === 'survey-info'}>Rezume</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('identification')} isActive={infoKey === 'identification'}>Elektron guvoxnoma</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('table')} isActive={infoKey ==='table'}>Tabel</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('visited-card')} isActive={infoKey === 'visited-card'}>Tashrif qog'ozi</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('salary')} isActive={infoKey === 'salary' }>Oylik maosh ma'lumoti</AppTabButton>
                    <AppTabButton onClick={()=>onChangeTab('tax')} isActive={infoKey === 'tax'}>Soliq ma'lumotlari</AppTabButton>
                </AppTab>
                {
                    tabContent
                }
            </Card>
    )
}
const TabContent = ({infoKey})=>{
    if(infoKey === 'infos'){
        return (
            <>
                <UserMainInfo/>
                <UserEducation/>
            </>
        )
    }
    if(infoKey === 'jobs'){
        return (
            <UserJob/>
        )
    }
    if(infoKey === 'family'){
        return (
            <UserFamilyInfo/>
        )
    }
    if(infoKey === 'dismiss-sheet'){
        return (
            <UserDismissSheet/>
        )
    }
    if(infoKey === 'survey-info'){
        return (
            <UserSurvey/>
        )
    }
    if(infoKey === 'table'){
        return (
            <UserTable/>
        )
    }
    if(infoKey === 'identification'){
        return (
            <UserIdentification/>
        )
    }
    if(infoKey === 'visited-card'){
        return (
            <UserVisitedCard/>
        )
    }
    if(infoKey === 'salary'){
        return (
            <UserSalary/>
        )
    }
    return (
        <UserTax/>
    )
}
export default Content;