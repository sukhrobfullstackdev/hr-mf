import {Card, Col, Row, Skeleton} from "antd";
import SideBar from "../component/SideBar";
import {connect} from "react-redux";

function CabinetNotFound({loader = false}){
    return <Row gutter={24} className="mt-4">
                <Col span={7}>
                    {
                        loader ?
                            <Card className="h-100">
                                <Skeleton active/>
                            </Card>:
                            <SideBar/>
                    }
                </Col>
                <Col span={17}>
                    <Card className="text-center">
                        <img src="/images/404.webp" alt=""/>
                        <Col span={12} className="mx-auto">
                            <h3 className="pb-4 text-muted">Bunday sahifa mavjud emas yoki sizda bu sahifaga kirish uchun huquq mavjud emas!</h3>
                        </Col>
                    </Card>
                </Col>
            </Row>
}
export default connect(
    (s)=>{
        return {
            loader: s?.loader
        }
    }
)(CabinetNotFound)