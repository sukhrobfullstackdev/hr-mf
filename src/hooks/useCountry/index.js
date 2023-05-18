import {useGetDynamic} from "../useGet";
import {useEffect} from "react";
import React from "react";
import {GET_COUNTRY} from "../../store/types";

function useCountry(){
    const [data,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(GET_COUNTRY);
    },[]);
    return [data,loader];
}
export default useCountry;