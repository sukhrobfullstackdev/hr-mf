import { Outlet, useOutlet } from "react-router-dom";
import DataList from "./DataList/DataList";

const StateUser = () => {
    const outlet = useOutlet();
    return (
        outlet ? <Outlet /> : <DataList />
    )
}

export default StateUser