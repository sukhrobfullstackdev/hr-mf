import {ButtonLink} from "../../../../styleComponents/ButtonDefault";
import {IconEdit, IconEye, IconTrash} from "../../../../components/Icon";
import {Link} from "react-router-dom";

function BusinessTripButton({item}){
    return(
        <>
           <div>
               <Link to={`view/${item.id}`} className="ant-btn-link">
                   <IconEye/>Ko'rish
               </Link>
           </div>
            <div>
               <Link to={`add/${item.id}`} className="ant-btn-link">
                   <IconEdit/>Taxrirlash
               </Link>
           </div>
            <div>
                <ButtonLink className="text-danger">
                    <IconTrash/> O'chirish
                </ButtonLink>
            </div>
        </>
    )
}
export default BusinessTripButton