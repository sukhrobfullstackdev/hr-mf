import {Outlet, useOutlet} from "react-router-dom";
import Notice from "../../../components/Nitice";

function DashboardNotice(){
    const outlet = useOutlet();
    return(
        outlet ?
            <Outlet/>:
            <Notice/>
    )
}
export default DashboardNotice;