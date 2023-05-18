import {Tabs} from "antd";
import OrderApprove from "./components/OrderApprove";
import Applications from "./components/Applications";
import DismissSheet from "./components/DismissSheet";
import CabinetNotice from "./components/Notice";
import {useNavigate, useParams} from "react-router-dom";

const {TabPane} = Tabs;
function Approved(){
    const {tab = 'orders'} = useParams();
    const navigate= useNavigate();
    const onChange = (v)=>{
        navigate(`${v}`);
    }
    return (
        <div>
            <h3 className="py-4 m-0">
                <strong>
                    Kelishish uchun
                </strong>
            </h3>
            <Tabs defaultActiveKey={tab} onChange={onChange}>
                <TabPane tab="Buyruqlar" key="orders">
                    <OrderApprove/>
                </TabPane>
                <TabPane tab="Arizalar" key="applications">
                    <Applications/>
                </TabPane>
                <TabPane tab="Ishdan bo'shash varaqasi" key="dismissSheet">
                    <DismissSheet/>
                </TabPane>
                <TabPane tab="Bildirgilar" key="notice">
                    <CabinetNotice/>
                </TabPane>
            </Tabs>
        </div>
    )
}
export default Approved;