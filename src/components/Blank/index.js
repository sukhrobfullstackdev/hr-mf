import Style from "styled-components";
import {useSelector} from "react-redux";
import {useLayoutEffect, useState} from "react";

const Wrapper = Style.div`
    margin: 0 auto;
    padding: 3rem;
`
const Gerb = Style.div`
    width: 120px;
    height: 120px;
    background-image: url('/images/uzb-gerb.png');
    background-size: 100%;
    background-position: center center;
    background-repeat: no-repeat;
    margin: 0 auto;
`
const Title = Style.h1`
    font-size: 20px;
    font-weight: bold;
    max-width: 75%;
    margin: 0 auto;
    text-align: center;
    text-transform: uppercase;
`
const TitleWrapper = Style.div`
    padding: 1rem 0;
    border-bottom: 4px solid #333333;
`
function Blank({children, title = "Buyruq"}){
    const user = useSelector(s=>s.isUser || null);
    const [orgName,setOrgName] = useState([]);
    useLayoutEffect(()=>{
        if(user && user.current_organization){
            let name = user.current_organization.name.split(' ');
            let newName = [];
            while (name.length){
                newName.push(`${name[0]} ${name[1] ? name[1] : ''}`);
                name.splice(0,2);
            }
            setOrgName(newName)
        }
    },[])
    return  <Wrapper className='app-blank'>
                <div>
                    <Gerb/>
                    <TitleWrapper>
                        {
                            orgName.map((item,i)=>{
                                return <Title key={`orderOrganName${i}`}>{item}</Title>
                            })
                        }
                        <Title>{title}</Title>
                    </TitleWrapper>
                </div>
                {children}
            </Wrapper>
}
export default Blank;