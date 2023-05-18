import {Outlet, useOutlet} from "react-router-dom";
import ListData from "./component/ListData";


function DashboardAppeal() {
  const outlet = useOutlet();
  return (
      outlet ?
      <Outlet/> :
          <ListData/>
  )
}
export default DashboardAppeal;