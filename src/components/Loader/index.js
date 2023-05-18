import Style from "styled-components";
import {LoadingOutlined} from "@ant-design/icons";
import {useEffect, useMemo} from "react";

const {connect} = require("react-redux");


const LoaderWrapper = Style.div`
    position: ${props=>props.full ? 'fixed' : 'static'};
    left:0;
    right:0;
    bottom: 0;
    top: 0;
    background-color: rgba(255,255,255,.5);
    text-align: center;
    display: ${props=>props.full ? 'flex':'block'};
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 99;
`
function Loader({loader = false,full = true}){
    return useMemo(()=>{
        return  <LoaderWrapper full={full}>
            <LoadingOutlined style={{fontSize: '32px'}}/>
            <p style={{margin: '1rem 0'}}>
                Iltimos kuting...
            </p>
        </LoaderWrapper>
    },[loader]);
}
export default connect((state)=>{
    return{
        loader: state?.loader
    }
})(Loader);