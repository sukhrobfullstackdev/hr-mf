import React, {useEffect} from "react";
import {useGetDynamic} from "../../../../hooks/useGet";
import {GET_SURVEY} from "../../../../store/types";
import Loader from "../../../../components/Loader";

function Resume({indexKey}){
    const [resume,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(GET_SURVEY);
    },[indexKey]);
    return loader ?
            <div className="py-4">
                <Loader full={false}/>
            </div>:'Resume'
}
export default Resume;