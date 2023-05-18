import {Col, Row} from "antd";
import ChatRightBar from "./component/ChatRightBar";
import ChatLeftBar from "./component/ChatLeftBar";
import {ChatButton} from "../../../components/Chat";
import {Outlet, useOutlet} from "react-router-dom";
import ChatSelectContent from "./component/ChatSelectContent";

function Chat(props){
    const outlet = useOutlet();
    return  <Row className="mt-4" gutter={24}>
                <Col span={6}>
                    <ChatLeftBar/>
                </Col>
                <Col span={12}>
                    {
                        outlet ?
                        <Outlet/> :
                        <ChatSelectContent/>
                    }
                </Col>
                <Col span={6}>
                   <ChatRightBar/>
                </Col>
            </Row>
}
export default Chat;