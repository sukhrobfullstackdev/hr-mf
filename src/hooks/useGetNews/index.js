import {useCallback, useEffect, useState} from "react";
import axios from "axios";

function useGetNews(){
    const [data,setData] = useState([]);
    const [baseUrl,setUrl] = useState('https://mf.uz/api/v1/site/post/list/?menu_group=news')
    const [loader,setLoader] = useState(true);
    const get = useCallback((query = {})=>{
        setLoader(true)
        axios.get(baseUrl,{
            headers:{
                "Accept-Language": 'uz'
            },
            params: query
        }).then(res=>{
            if('results' in res.data){
                setData(res.data.results)
            }

        }).finally(()=>{
            setLoader(false)
        })
    },[])
    return [data,get,loader];
}
export default useGetNews;