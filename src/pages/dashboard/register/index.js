import {Outlet, useOutlet} from "react-router-dom";
import ListData from "./component/ListData";

function Register({register = {}}){
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/>:
            <ListData/>
    )
}

export default Register