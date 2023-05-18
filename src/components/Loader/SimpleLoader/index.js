import Style from "styled-components";
import {LoadingOutlined} from "@ant-design/icons";

const Wrapper = Style.div`
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(255,255,255,.5);
    backdrop-filter: blur(2px);
    z-index: 9;
    display: flex;
    align-items: center;
    justify-content: center;
`
const Loader = Style.div`
    font-size: 24px;
    text-align: center;
`
const H1 = Style.h1`
    font-size: 16px;
    text-align: center;
    margin: 1rem 0;
`
export default function SimpleLoader(){
    return  <Wrapper>
                <div>
                    <Loader>
                        <LoadingOutlined />
                    </Loader>
                    <H1>
                        Iltimos kuting ...
                    </H1>
                </div>
            </Wrapper>
}