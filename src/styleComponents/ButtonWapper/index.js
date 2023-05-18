import Style from "styled-components";

const Wrapper = Style.div`
    width: 100%;
    background-color: #2842C8;
    border:none;
    outline: none;
    padding: .7rem 0 .5rem 0;
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    color: #ffffff;
`

function ButtonWrapper({children,onClick, className = ''}) {

    return  <Wrapper onClick={onClick} className={className}>
                {
                    children
                }
            </Wrapper>
}

export default ButtonWrapper;