import Style from "styled-components";

const Loader = Style.span`
    width: 12px;
    height:12px;
    display: inline-block;
    border-radius: 50%;
    border: 1px solid #909090;
    border-right-color: transparent;
    vertical-align: middle;
`
function SpinnerLoader(){
    return(
        <Loader className="rotate"/>
    )
}
export default SpinnerLoader;