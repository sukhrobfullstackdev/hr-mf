import {useLayoutEffect, useState} from "react";
import {useSelector} from "react-redux";

function TabInfo({tabInfo,type = 'order'}){
    const [count,setCount] = useState(0);
    const user = useSelector(s=>s.isUser || null);
    useLayoutEffect(()=>{
        if(user){
            if(type === 'order'){
                const infoCount = tabInfo.counts_by_status;
                if(user.current_role === 'HO'){
                    setCount(
                        infoCount.approved
                    )
                }else{
                    setCount(
                        infoCount.checked + infoCount.new + infoCount.rejected
                    )
                }
            }else{
                setCount(tabInfo.total_count);
            }
        }
    },[tabInfo])
    return(
        <div className="position-relative">
            <span className="text-no-wrap w-100 overflow-hidden d-block">
                {tabInfo.title}
            </span>
            { count > 0 ?
                    <span className="tab-count">
                    {count}
                </span>: ""
            }
        </div>
    )
}
export default TabInfo