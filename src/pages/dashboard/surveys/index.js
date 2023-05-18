import {useOutlet,Outlet} from "react-router-dom";
import ListData from "./components/ListData";

function Surveys(){
    const outlet = useOutlet();
    return(
        outlet ?
            <Outlet/>:
            <ListData/>
    )
}
export default Surveys;