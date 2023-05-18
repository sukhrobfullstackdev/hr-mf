import {Col, Row} from "antd";
import StructureComponent from "./components/Structure";
function StructureView(props){
    return(
            <Row justify='end' align='middle'>
                <Col span={24}>
                    <h3>
                        <strong>Struktura</strong>
                    </h3>
                </Col>
                <Col span={24}>
                    <StructureComponent/>
                </Col>
            </Row>
    )
}

export default StructureView