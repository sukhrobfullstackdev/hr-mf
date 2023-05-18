import {useCallback, useState} from "react";
import Req from "../../store/api";
import {GET_USER_WEATHER} from "../../store/types";

function useGetWeather(){
    const [data,setData] = useState({});
    const [api, setApi] = useState('14de62eedf6146126e2aadb583dcb183')
    const [loader,setLoader] = useState(false);
    const get = useCallback((units = 'metric')=>{
        setLoader(true);
        Req({
            type: GET_USER_WEATHER,
            query: {
                lat: 41.31131945000897, //,
                lon: 69.2797272461777,
                appid: api,
                units: units
            }
        }).then(res=>{
            setData(res.data)
        }).finally(()=>{
            setLoader(false)
        })
        // navigator.geolocation.getCurrentPosition((value)=>{
        //     const lat = value.coords.latitude;
        //     const lon = value.coords.longitude
        //
        // })
    },[]);
    return [data,get,loader]
}
export default useGetWeather