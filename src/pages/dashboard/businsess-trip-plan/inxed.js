import {useOutlet,Outlet} from "react-router-dom";
import ListData from "./components/ListData";

function DashboardBusinessTripPlan(){
    const outlet = useOutlet();
    return(
        outlet ?
            <Outlet/>:
            <ListData/>
    )
}
export default DashboardBusinessTripPlan