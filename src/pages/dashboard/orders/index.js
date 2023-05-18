import {Outlet, useOutlet} from "react-router-dom";
import ListOrders from "./component/ListOrders";

function Orders(){
    const outlet = useOutlet();
    return(
        outlet ? <Outlet/>:
                 <ListOrders/>

    )
}
export default Orders;