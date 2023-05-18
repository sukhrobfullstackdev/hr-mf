import ListData from "./components/ListData";
import {useOutlet, Outlet} from "react-router-dom";

function DashboardDismissSheet(){
    const outlet = useOutlet()
    return(
       outlet ?
        <Outlet/>:
           <ListData/>
    )
}
export default DashboardDismissSheet;