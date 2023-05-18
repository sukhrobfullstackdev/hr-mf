import {useEffect, useRef} from "react";
import Req from "../../../../store/api";
import {useSelector} from "react-redux";
import UnderDevelopment from "../../../../components/UnderDevelopment";
import {IconDownload} from "../../../../components/Icon";
import {Image} from "antd";

function UserVisitedCard(){
    const link = useRef();
    const user = useSelector(s=>s.isUser || null)
    return(
        <div>
            {
                user ?
                    <>
                        <div>
                            <Image src={`${process.env.REACT_APP_SERVER_URL}/vc-service/get-vc-image/?user_id=${user.id}&org_tin=${user.current_organization.organization_tin}`}/>
                        </div>
                        <div className="py-4 text-right">
                            <a href={`${process.env.REACT_APP_SERVER_URL}/api/mf_id/card/?user_id=${user.id}`} ref={link} target="_blank">
                                <IconDownload/> Yuklab olish
                            </a>
                        </div>
                    </>:''
            }
        </div>
    )
}
export default UserVisitedCard;