import Style from "styled-components";
import {useSelector} from "react-redux";

const Img = Style.img`
    width: ${p=>p.size === 'sm' ? '80px' : '100%'};
    object-fit: cover;
`
const PinHeader = Style.div`
    width: 100%;
    text-align: center;
    border-bottom: 3px solid #1e1e1e;
    position: relative;
    padding: .5rem 0;
    &::before{
        content: '';
        position: absolute;
        left:0;
        right:0;
        bottom: -6px;
        border-bottom: 1px solid #1e1e1e;
    }
`
const PinContent = Style.div`
    width: 100%;
    text-align: center;
    border-bottom: 3px solid #1e1e1e;
    position: relative;
    padding: 1rem 0;
`
function Pin({size = 'lg', children, className}){
    const user = useSelector(s=>s.isUser || {});
    return  <div className={className || ''}>
                <PinHeader>
                    <Img size={size} src='/images/uzb-gerb.png'/>
                    <p className="mb-0 py-2">
                        <strong>
                            {
                                user?.organizations[0] ?
                                    user.organizations[0]?.name :""
                            }
                        </strong>
                    </p>
                </PinHeader>
                <PinContent>
                    {children}
                </PinContent>
            </div>
}
export default Pin