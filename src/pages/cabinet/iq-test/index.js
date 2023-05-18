import SideBar from "../component/SideBar";
import {Card, Col, Row, Skeleton} from "antd";
import {connect} from "react-redux";
import {Outlet,useOutlet} from "react-router-dom";
import ListData from "./components/CabinetIQTest";

function CabinetIQTest({loader=false}){
    const outlet = useOutlet();
    return(
        <Row gutter={24} className="mt-4">
            <Col xs={24} sm={24} md={24} lg={7}>
                {
                    loader ?
                        <Card className="h-100">
                            <Skeleton active/>
                        </Card>:
                        <SideBar/>
                }
            </Col>
            <Col xs={24} sm={24} md={24} lg={17}>
                {
                    outlet ?
                        <Outlet/>
                        : <ListData/>
                }
            </Col>
        </Row>
    )
}
const stp = (state)=>{
    return{
        loader: state.loader
    }
}
export default connect(stp)(CabinetIQTest);