import {useParams} from "react-router-dom";
import {useGetDynamic} from "../../hooks/useGet";
import {useEffect} from "react";
import {GET_NOTICE_CONFIRMED} from "../../store/types";
import {NoticeContainer} from "../../components/Nitice/NoticeView";
import Container from "../../components/Container";

function OpenUrlNotice(){
    const {id} = useParams();
    const [data,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(`${GET_NOTICE_CONFIRMED}${id}/`);
    },[])
    return(
        <div className="py-5">
            <Container>
                <NoticeContainer notice={Array.isArray(data) ? {} : data}/>
            </Container>
        </div>
    )
}
export default OpenUrlNotice;