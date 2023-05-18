import {Empty} from "antd";
import Style from "styled-components";
import {Link} from "react-router-dom";

const NoDataWrapper = Style.div`
    width: 100%;
    height: ${props=>props.size === 'lg' ? '600px' : 'auto'};
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${props=> props.color};
    padding: 1.5rem 0;
    border-radius: 12px;
    flex-direction: column;
`

function NoData({isBack = null, message = "Ma'lumot mavjud emas!", color='#f3f3f3', size='lg'}){
    return  <NoDataWrapper size={size} color={color}>
                <Empty description={message} />
                {
                    isBack ?
                        <Link to={isBack} className="py-3">
                            Ortga qaytish
                        </Link> : ""
                }
            </NoDataWrapper>
}
export default NoData