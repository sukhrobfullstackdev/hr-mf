import usePanel from "../../../hooks/usePanel";
import {Card, Col, Row, Skeleton} from "antd";
import {Icon, IconItem, Title} from "../components/Page/styleComponent";
import {ApartmentOutlined, StockOutlined, UserOutlined, UserSwitchOutlined} from "@ant-design/icons";
import {connect} from "react-redux";
import StatByDepartment from "./components/StatByDepartment";
import StatByPosition from "./components/StatByPosition";
import StaffByYear from "./components/StaffByYear";
import StatByNationality from "./components/StatByNationality";


function DashboardMain({loader = false}){
    const panels = usePanel();
    return(
        <>
            <h3 className="my-3">
                <strong>
                    Asosiy
                </strong>
            </h3>
            <Row gutter={{xs:12,sm:16, md:20}}>
                <Col className="mb-3" xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
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
                <Col className="mb-3" xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
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
                <Col className="mb-3" xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
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
                <Col className="mb-3" xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
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
                <Col className="mb-3" xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
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
                <Col className="mb-3" xs={24} sm={24} md={12} lg={8} xl={6} xxl={4}>
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
            <Row gutter={20} className="mb-4">
                <Col span={8}>
                    <StatByDepartment/>
                </Col>
                <Col span={16}>
                    <StatByPosition/>
                </Col>
            </Row>
            <Row gutter={20} className="mb-3">
                <Col span={16}>
                    <StatByNationality/>
                </Col>
                <Col span={8}>
                    <StaffByYear/>
                </Col>
            </Row>
        </>
    )
}
export default connect((s)=>{
    return{
        loader: s?.loader
    }
})(DashboardMain)