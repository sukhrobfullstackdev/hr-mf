import Style from "styled-components";

const Small = Style.p`
    margin: 0;
    font-size: ${p=>p.size ? `${p.size}px` : '14px'};
    text-transform: ${p => p.case ? p.case : 'unset'}
`
export default Small