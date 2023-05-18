import ButtonWrapper from "../../../../styleComponents/ButtonWapper";
import {useState} from "react";

function MfId(){
    const [url,setUrl] = useState(`https://id.mf.uz/oauth2/authorize?response_type=code&client_id=${process.env.REACT_APP_MF_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}/mf-id&state=txts`)
    const onRedirect = () => {
        window.location.href = url;
    }
    return(
        <ButtonWrapper onClick={onRedirect}>
           <span style={{fontSize: '18px', letterSpacing: '1px'}}>
                MFID
           </span>
        </ButtonWrapper>
    )
}
export default MfId;