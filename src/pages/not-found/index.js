import {Col, Row} from "antd";
import {Link} from "react-router-dom";

function NotFound({message}){
    return  <Row>
                <Col span={24} className="text-center">
                    <img src="/images/404.webp" alt=""/>
                    <p>
                        {
                            message
                        }
                    </p>
                    <p>
                      <Link to="/">
                          Bosh sahifaga qaytish
                      </Link>
                    </p>
                </Col>
            </Row>
}
export default NotFound;