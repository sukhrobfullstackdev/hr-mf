import {Card, Col, Row, Skeleton} from "antd";
import {Icon, IconItem, Title} from "./styleComponent";
import {ApartmentOutlined, StockOutlined, UserOutlined, UserSwitchOutlined} from "@ant-design/icons";
import usePanel from "../../../../hooks/usePanel";
import {connect} from "react-redux";



function DashboardPage({loader = false}){
    const panels = usePanel();
    return(
        <div>
            <Row gutter={20}>
                <Col span={4}>
                    <Card>
                        {
                            loader ?
                                <Skeleton active paragraph={{rows: 1}} avatar/>:
                                <Row>
                                    <Col className='pl-3'>
                                        <Icon bg="#00A389">
                                            <IconItem>
                                                <UserOutlined/>
                                            </IconItem>
                                        </Icon>
                                    </Col>
                                    <Col className='pl-3'>
                                        <Title>
                                            {panels?.users_count?.all_users}
                                        </Title>
                                        <p className="m-0 text-muted">Hodimlar</p>
                                    </Col>
                                </Row>

                        }
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        {
                            loader ?
                                <Skeleton active paragraph={{rows: 1}} avatar/>:
                                <Row>
                                    <Col className='pl-3'>
                                        <Icon bg="#25ccc0">
                                            <IconItem>
                                                <UserOutlined/>
                                            </IconItem>
                                        </Icon>
                                    </Col>
                                    <Col className='pl-3'>
                                        <Title>
                                            {panels?.users_count?.males}
                                        </Title>
                                        <p className="m-0 text-muted">Erkaklar</p>
                                    </Col>
                                </Row>

                        }
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        {
                            loader ?
                                <Skeleton active paragraph={{rows: 1}} avatar/>:
                                <Row>
                                    <Col className='pl-3'>
                                        <Icon bg="#a638eb">
                                            <IconItem>
                                                <UserOutlined/>
                                            </IconItem>
                                        </Icon>
                                    </Col>
                                    <Col className='pl-3'>
                                        <Title>
                                            {panels?.users_count?.females}
                                        </Title>
                                        <p className="m-0 text-muted">Ayollar</p>
                                    </Col>
                                </Row>

                        }
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        {
                            loader ?
                                <Skeleton active paragraph={{rows: 1}} avatar/>:
                                <Row>
                                    <Col className='pl-3'>
                                        <Icon bg="#E93030">
                                            <IconItem>
                                                <StockOutlined />
                                            </IconItem>
                                        </Icon>
                                    </Col>
                                    <Col className='pl-3'>
                                        <Title>
                                            0
                                        </Title>
                                        <p className="m-0 text-muted">Eng faollar</p>
                                    </Col>
                                </Row>

                        }
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        {
                            loader ?
                            <Skeleton active paragraph={{rows: 1}} avatar/>:
                            <Row>
                                <Col className='pl-3'>
                                    <Icon bg="#5775FC">
                                        <IconItem>
                                            <ApartmentOutlined />
                                        </IconItem>
                                    </Icon>
                                </Col>
                                <Col className='pl-3'>
                                    <Title>
                                        {panels?.count_depart}
                                    </Title>
                                    <p className="m-0 text-muted">Bo'limlar</p>
                                </Col>
                            </Row>
                        }
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        {
                            loader ?
                                <Skeleton active paragraph={{rows: 1}} avatar/>:
                                <Row>
                                    <Col className='pl-3'>
                                        <Icon bg="#FFAB2D">
                                            <IconItem>
                                                <UserSwitchOutlined/>
                                            </IconItem>
                                        </Icon>
                                    </Col>
                                    <Col className='pl-3'>
                                        <Title>
                                            {panels?.count_position}
                                        </Title>
                                        <p className="m-0 text-muted">Lavozimlar</p>
                                    </Col>
                                </Row>
                        }
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
export default connect((s)=>{
    return{
        loader: s?.loader
    }
})(DashboardPage)