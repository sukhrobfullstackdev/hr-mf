import Style from "styled-components";
import {SettingOutlined} from "@ant-design/icons";


const Wrapper = Style.div`
    width: 100%;
    padding: 3rem 1rem;
    border-radius: 12px;
    color: #bfbfbf;
    text-align: center;
`
const Icon = Style.img`
    width: 100%;
    height: auto;
`
const IconWrapper = Style.div`
    width: 150px;
    margin: 0 auto;
    position: relative;
`
const IconOverlay = Style.div`
    background-color: #f5f5f5ab;
    position: absolute;
    right: 0;
    top: 50%;
    font-size: 50px;
    line-height: 50px;
    transform: translate(50%,-50%);
    color: #06C975;
    border-radius: 50px;
`
function Title(){
    return  <>
                <div>
                    <strong>Bu bo'lim ishlab chiqish jarayonida.</strong>
                </div>
                <div>
                    <strong>Tez orada bu imkoniyat bizning tizimda paydo bo'ladi!</strong>
                </div>
            </>
}
function UnderDevelopment({title = <Title/>}){
    return(
        <Wrapper className='under-development-block'>
            <IconWrapper>
                <Icon src='/images/coding.png'/>
                <IconOverlay>
                    <SettingOutlined spin />
                </IconOverlay>
            </IconWrapper>
            <div className="m-0 py-3">
                {title}
            </div>
        </Wrapper>
    )
}

export default UnderDevelopment;