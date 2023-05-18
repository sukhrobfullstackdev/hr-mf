import {Col, Row} from "antd";
import SideBar from "../component/SideBar";
import Content from "../component/Content";
import {connect} from "react-redux";

function Info({sideBarHide}){
    return (
        <Row gutter={24} className="mt-4">
            <Col className="mb-3" xs={24} sm={24} md={sideBarHide ? 24 : 8} lg={sideBarHide ? 24 : 7} xxl={sideBarHide ? 24 : 7}>
                <SideBar/>
            </Col>
            <Col className="mb-3" xs={24} sm={24} md={sideBarHide ? 24 : 16} lg={sideBarHide ? 24 : 17} xxl={sideBarHide ? 24 : 17}>
                <Content/>
            </Col>
        </Row>
    )
}
export default connect((s)=>{
    return{
        sideBarHide: s.sideBarHide || false
    }
})(Info);