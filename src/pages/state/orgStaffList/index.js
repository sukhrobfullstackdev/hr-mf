import { Outlet, useOutlet } from "react-router-dom";
import OrgStaffList from "./OrgStaffList";

const Wrapper = () => {
    const outlet = useOutlet();
    return (
        outlet ? <Outlet /> : <OrgStaffList />
    )
}

export default Wrapper