import {Outlet, useOutlet} from "react-router-dom";
import DataList from "./component/DataList";

function Company({organs = []}){
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/> : <DataList/>
    )
}

export default Company