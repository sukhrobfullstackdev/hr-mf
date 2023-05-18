import {Badge, Col, Row} from "antd";
import User from "../../../../styleComponents/User";
import {BellOutlined, MessageOutlined} from "@ant-design/icons";
import Style from "styled-components";
import {connect, useSelector} from "react-redux";


const BadgeWrapper = Style.div`
    font-size: 24px;
`
const UserBlock = Style.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`

function DashboardHeader({isUser = null, activeOrganisation = null}){
    return (
        <Row justify='end'>
            <Col span={20}>
                {
                    activeOrganisation && Object.keys(activeOrganisation).length ?
                        <strong>
                            {
                                activeOrganisation.name
                            }
                        </strong>
                        : ''
                }
            </Col>
            <Col span={4}>
                {/* {
                    isUser && Object.keys(isUser).length? */}
                        <UserBlock>
                            {/* <div className="mr-3">
                                <Badge>
                                    <BadgeWrapper>
                                        <MessageOutlined />
                                    </BadgeWrapper>
                                </Badge>
                            </div>
                            <div className="mr-2">
                                <Badge>
                                    <BadgeWrapper>
                                        <BellOutlined/>
                                    </BadgeWrapper>
                                </Badge>
                            </div> */}
                            <div>
                                <User user={{
                                    username: isUser?.username,
                                }}/>
                            </div>
                        </UserBlock>
                {/* } */}
            </Col>
        </Row>
    )
}

export default connect((s)=>{
    return {
        activeOrganisation: s.activeOrganisation || null,
        isUser: s.isUser || null
    }
})(DashboardHeader)