import {Outlet, useOutlet} from "react-router-dom";
import DataList from "./DataList/Datalist";

const StateOrganizations = () => {
  const outlet = useOutlet();
    return(
        outlet ? <Outlet/> : <DataList/>
    )
}

export default StateOrganizations
