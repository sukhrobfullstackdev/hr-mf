import {Badge, Button, Col, Row, Tooltip} from "antd";
import {Link, useLocation} from "react-router-dom";
import {BellOutlined} from "@ant-design/icons";
import Style from "styled-components";
import Search from "antd/es/input/Search";
import {
    IconAward, IconBulb,
    IconCalendar,
    IconCast,
    IconClipBoard,
    IconFile,
    IconFileText,
    IconSearch
} from "../../../../components/Icon";
import {useSelector} from "react-redux";
import { ScheduleOutlined } from "@ant-design/icons";
import Notification from "../../../../components/Notification";

const BadgeWrapper = Style.div`
    font-size: 24px;
`
function Header(props){
    const location = useLocation();
    const user = useSelector(s=> s.isUser || {});
    const onSearch = (v)=>{

    }
    return  <Row align='middle'>
                <Col xs={24} sm={12} md={12} lg={12} xxl={4}>
                    <Link to='/cabinet/info' style={{opacity: 1}}>
                        <img src="/images/logo.svg" alt=""/>
                    </Link>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xxl={8}>
                    <Search
                            bordered={false}
                            enterButton={
                                <Button>
                                    <IconSearch/>
                                </Button>
                            }
                            className="bg-weight"
                            placeholder="Qidiruv"
                            onSearch={onSearch} />
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xxl={8}>
                    <Row>
                        <Col className='pl-2'>
                            <Tooltip placement="bottom" title="Shaxsiy kartochka">
                                <Link to='/cabinet/info' className={`header-link opacity-none ${location.pathname === '/cabinet/info' ? 'active' : ''}`}>
                                    <IconFile/>
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip placement="bottom" title="Ta'tillar">
                                <Link to='/cabinet/vacations' className={`header-link opacity-none ${location.pathname === '/cabinet/vacations' ? 'active' : ''}`}>
                                    <IconAward/>
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip placement="bottom" title="Test-savollar">
                                <Link to='/cabinet/iq-test' className={`header-link opacity-none ${location.pathname === '/cabinet/iq-test' ? 'active' : ''}`}>
                                    <IconBulb/>
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip placement="bottom" title="Tug'ilgan kunlar">
                                <Link to='/cabinet/birthday' className={`header-link opacity-none ${location.pathname === '/cabinet/birthday' ? 'active' : ''}`}>
                                    <IconCalendar/>
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col >
                            <Tooltip placement="bottom" title="Yangiliklar">
                                <Link to='/cabinet/news' className={`header-link opacity-none ${location.pathname === '/cabinet/news' ? 'active' : ''}`}>
                                    <IconCast/>
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col>
                            <Tooltip placement="bottom" title="Arizalar">
                                <Link to='/cabinet/appeals' className={`header-link opacity-none ${location.pathname === '/cabinet/appeals' ? 'active' : ''}`}>
                                    <IconClipBoard/>
                                </Link>
                            </Tooltip>
                        </Col>
                        {
                            user.is_approver ?
                                <Col>
                                    <Tooltip placement="bottom" title="Kelishish uchun buyuruqlar">
                                        <Link to='/cabinet/approved' className={`header-link opacity-none ${location.pathname === '/cabinet/approved' ? 'active' : ''}`}>
                                            <IconFileText/>
                                        </Link>
                                    </Tooltip>
                                </Col>:""
                        }
                    </Row>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xxl={4} className="text-right">
                    <Notification/>
                </Col>
            </Row>
}
export default Header