import {useEffect, useState} from "react";

async function Fetch({type, body = {}, query, headers}){
    const [method,url,key] = type.split(' '); // 'get /users/id'
    const option = {
        method: method ? method : "GET",
        headers: headers
    };
    if(method !== 'GET' && Object.keys(body).length){
        option.body = JSON.stringify(body);
    }
        const response = await fetch(`https://jsonplaceholder.typicode.com${url}`, option);
    if(!response.ok){
        throw new Error(`Error! ${response.status}`);
    }
    return response.json();
}
function useFetch({
                      type = '',
                      body = {},
                      query = {},
                      headers = {}
}){
    const [resData,setRes] = useState({
        loading: true,
        data: null,
        error: null
    })
    useEffect(()=>{
       Fetch({type,body,query,headers})
           .then(res=>{
                setRes({
                    ...resData,
                    data: res,
                    loading: false,
                });
            })
           .catch(err=>{
               console.log(err)
               setRes({
                   ...resData,
                   loading: false,
                   error: err.message
               });
           })
    },[]);
    return resData
}
export default useFetch;
