import {Outlet, useOutlet} from "react-router-dom";
import ListData from "./components/ListData";

function Identification() {
    const outlet = useOutlet();
    return (
        outlet ? <Outlet/> :
            <ListData/>
    )
}

export default Identification;