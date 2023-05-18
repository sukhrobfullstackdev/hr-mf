import {Outlet,useOutlet} from "react-router-dom";
import ListData from "./components/ListData";

function DashboardOrderTypes(){
    const outlet = useOutlet();
    return(
        outlet ?
        <Outlet/>:
            <ListData/>
    )
}
export default DashboardOrderTypes;