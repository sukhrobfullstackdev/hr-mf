import Style from "styled-components";

const UserName = Style.h1`
    font-size: ${p=>p.size ? p.size : '24px'};
    font-weight: bold;
`
export default UserName;