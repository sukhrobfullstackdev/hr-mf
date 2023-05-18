import ListData from "./components/ListData";
import {useOutlet, Outlet} from "react-router-dom";

function SalaryList(){
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/> : <ListData/>
    )
}
export default SalaryList;