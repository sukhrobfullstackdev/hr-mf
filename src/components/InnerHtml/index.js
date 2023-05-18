import Style from "styled-components";

const Wrapper = Style.div`
    p {
        margin-bottom: 0;
    }
`

function InnerHtml({content}){
    const createMarkup = ()=>{
        return { __html:content }
    }
    return (
        <Wrapper>
            <div dangerouslySetInnerHTML={createMarkup()}/>
        </Wrapper>
    )
}
export default InnerHtml;