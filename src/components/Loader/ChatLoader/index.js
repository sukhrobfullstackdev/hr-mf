import {Col, Row, Skeleton} from "antd";

export default function ChatLoader(){
    return  <div className="chat-loader">
                <Row>
                    <Col span={14}>
                        <Skeleton active paragraph={{ rows: 2 }} />
                    </Col>
                    <Col span={14} className="ml-auto">
                        <Skeleton active paragraph={{ rows: 2 }} />
                    </Col>
                    <Col span={14}>
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </Col>
                    <Col span={14} className="ml-auto">
                        <Skeleton active paragraph={{ rows: 2 }} />
                    </Col>
                    <Col span={14}>
                        <Skeleton active paragraph={{ rows: 1 }} />
                    </Col>
                </Row>
            </div>
}