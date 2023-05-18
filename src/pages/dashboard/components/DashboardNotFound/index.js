import Style from "styled-components";
import NoData from "../../../../components/NoData";
import {Card} from "antd";
import {Link} from "react-router-dom";


const Wrapper = Style.div`
    min-height: 600px;
    margin: 1rem;
`
const Msg = Style.div`
     text-align: center;
     padding: 1rem 0;
`

function Message({msg}){
    return  <Msg>
                <strong>Opps!</strong> Bunday sahifa mavjud emas yoki o'chirib yuborilgan!
                {
                    msg ? <p className="py-2">{msg}</p>:''
                }
            </Msg>
}
function DashboardNotFound(props){
    return  <Wrapper>
                <Card className='text-center h-100'>
                    <img src="/images/404.webp" alt=""/>
                    <Message msg={<Link to={'/dashboard'}>Bosh sahifaga qaytish</Link>}/>
                </Card>
            </Wrapper>
}
export default DashboardNotFound;