import {Badge, Col, Row} from "antd";
import User from "../../../../styleComponents/User";
import Style from "styled-components";
import {connect} from "react-redux";
import {IconMessageCircle} from "../../../../components/Icon";
import Notification from "../../../../components/Notification";

const UserBlock = Style.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`
const BadgeWrapper = Style.button`
    font-size: 24px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0;
`
function DashboardHeader({isUser = null, activeOrganisation = null}){
    return(
        <>
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
                    {
                        isUser && Object.keys(isUser).length?
                            <UserBlock>
                                <div className="mr-3">
                                    <Badge>
                                        <BadgeWrapper>
                                            <IconMessageCircle/>
                                        </BadgeWrapper>
                                    </Badge>
                                </div>
                                <div className="mr-2">
                                    <Notification/>
                                </div>
                                <div>
                                    <User user={{
                                        username: isUser.username,
                                    }}/>
                                </div>
                            </UserBlock>:""
                    }
                </Col>
            </Row>
        </>
    )
}
export default connect((s)=>{
    return {
        activeOrganisation: s.activeOrganisation || null,
        isUser: s.isUser || null,
        fbmMessages: s.fbmMessages || [],
        showFbmMessages: s.showFbmMessages,
        notReadFbmMessage: s.notReadFbmMessage
    }
})(DashboardHeader)