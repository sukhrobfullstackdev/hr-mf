import {Outlet, useOutlet} from "react-router-dom";
import ListData from "./components/ListData";

function Sections(){
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/>:
        <ListData/>
    )
}
export default Sections;