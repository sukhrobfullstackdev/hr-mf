import {Image} from "antd";
import {useNavigate, useSearchParams, useOutlet, Outlet, useParams} from "react-router-dom";
import {useEffect} from "react";
import Container from "../../components/Container";

function UserCard(){
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user_id');
    const orgTin = searchParams.get('org_tin');
    const navigate = useNavigate();
    useEffect(()=>{
        if(userId && orgTin){
            navigate(`/visit-card/${userId}/${orgTin}`);
        }
    },[])
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/> : null
    )
}
export const UserCardImage = ()=>{
    const {userId,orgTin} = useParams();
    return(
        <Container className="py-5">
            <Image src={`${process.env.REACT_APP_SERVER_URL}/vc-service/get-vc-image/?user_id=${userId}&org_tin=${orgTin}`}/>
        </Container>
    )
}
export default UserCard