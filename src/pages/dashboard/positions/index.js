import {Outlet, useOutlet} from "react-router-dom";
import ListPosition from "./component/ListPosition";

function Positions({positions = [], loader = false}){
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/>:
        <ListPosition/>
    )
}

export default Positions