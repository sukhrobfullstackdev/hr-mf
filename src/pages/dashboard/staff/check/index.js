import {Card, Tabs} from "antd";
import {useState} from "react";
import StaffNarcologie from "./components/StaffNarcalogie";
import UnderDevelopment from "../../../../components/UnderDevelopment";
import Staff from "../index";
import StaffPsychology from "./components/StaffPsychology";
import StaffConviction from "./components/StaffConviction";
import StaffDeath from "./components/StaffDeath";
import StaffDivorced from "./components/StaffDiverced";
import StaffMarriage from "./components/StaffMarriage";

const {TabPane} = Tabs;
function DashboardStaffCheck(){
    const [activeKey,setActiveKey] = useState('narcologie')
    const onChange = (key)=>{
        setActiveKey(key)
    }
    return(
        <div>
            <Tabs defaultActiveKey={activeKey} onChange={onChange}>
                <TabPane tab="Narkalogiya bo'yicha" key="narcologie">
                   <Card>
                       <StaffNarcologie/>
                   </Card>
                </TabPane>
                <TabPane tab="Psixalogik dispanser bo'yicha" key="psychology">
                    <Card>
                        <StaffPsychology/>
                    </Card>
                </TabPane>
                <TabPane tab="Sudlanganlik bo'yicha" key="conviction">
                    <Card>
                        <StaffConviction/>
                    </Card>
                </TabPane>
                <TabPane tab="Vafot etganlik bo'yicha" key="death">
                    <Card>
                        <StaffDeath/>
                    </Card>
                </TabPane>
                <TabPane tab="Ajirim bo'yicha" key="divorced">
                    <Card>
                        <StaffDivorced/>
                    </Card>
                </TabPane>
                <TabPane tab="Turmush qurish bo'yicha" key="marriage">
                    <Card>
                        <StaffMarriage/>
                    </Card>
                </TabPane>
            </Tabs>
        </div>
    )
}
export default DashboardStaffCheck;