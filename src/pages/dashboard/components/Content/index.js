import Style from "styled-components";
const ContentWrapper = Style.div`
    width: 100%;
    height: 100%;
    overflow-x: none;
    overflow-y: auto;
    padding: 0 1rem;
`

function DashboardContent({children}){
    return (
       <ContentWrapper>
           {children}
       </ContentWrapper>
    )
}
export default DashboardContent