import Style from "styled-components";

const Title = Style.h1`
    font-family: Poppins;
    font-weight: 600;
    font-size: 30px;
    line-height: 45px;
    margin: 0;
`
const Icon = Style.div`
    background-color:${p=> p.bg};
    width: 68px;
    height: 68px;
    border-radius: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p=>p.bg};
`
const IconItem = Style.div`
    background-color: #fff;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    text-align: center;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center
`
export {Title,Icon,IconItem};