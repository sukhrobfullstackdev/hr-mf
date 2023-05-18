import {useEffect} from "react";
import {useDispatch} from "react-redux";

function Home(props){
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch({
            type: 'redirect',
            payload: '/login',
        })
    },[]);
    return  <div>
                Home
            </div>
}
export default Home;