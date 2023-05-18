import {connect, useDispatch} from "react-redux";
import {REMOVE_NOTICE} from "../../../../../store/types";
import {Link} from "react-router-dom";
import {IconEdit, IconEye, IconTrash} from "../../../../../components/Icon";
import {ButtonLink} from "../../../../../styleComponents/ButtonDefault";
import usePost from "../../../../../hooks/usePost";
import Notice from "../../../../../components/Nitice";


const ListUserByNotice = ({list = []})=>{
    return(
        <div>
            {
                list.map(user=>{
                    return (
                        <div className="px-2 py-1" key={`userNotice${user.id}`}>
                            {user.staff.full_name}
                        </div>
                    )
                })
            }
        </div>
    )
}
const ButtonList = ({item,remove})=>{
    const dispatch = useDispatch();
    const [post,loader] = usePost();
    const onRemove = ()=>{
        post(`${REMOVE_NOTICE}${item.id}`,null,()=>{
            dispatch({
                type: 'reload',
                payload: Math.random()
            })
        })
    }
    return(
        <>
            {
                item.status === 'new' || item.status === 'rejected' ?
                    <>
                        <Link to={`/cabinet/notice/update/${item.id}`} className="ant-btn-block ant-btn-link">
                            <IconEdit/> Taxrirlash
                        </Link>
                        <ButtonLink disabled={loader} onClick={onRemove} className="ant-btn-block ant-btn-link text-left ant-btn-link-danger">
                            <IconTrash/> O'chirish
                        </ButtonLink>
                    </> : ""
            }
            <Link to={`/cabinet/notice/view/${item.id}`} className="ant-btn-block ant-btn-link">
                <IconEye/> Ko'rish
            </Link>
        </>
    )
}
function CabinetNotice({notice,loader}){
    return(
        <Notice/>
    )
}
const stp = state=>(
    {
        loader: state.loader,
        notice: state.notice || []
    }
)
export default connect(stp)(CabinetNotice);