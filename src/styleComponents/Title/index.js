import Style from "styled-components";

const TitleWrapper = Style.h1`
    font-weight: bold;
    margin: 0;
    padding: 1rem 0;
    border-bottom: 1px solid #f3f3f3;
    margin-bottom: 1rem;
`
function Title({children}){
    return  <TitleWrapper>
                {children}
            </TitleWrapper>
}
export default Title;