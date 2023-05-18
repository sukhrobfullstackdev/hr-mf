import {useState} from "react";

function useRandomSort(){
    const [sorted,setSorted] = useState([]);
    const sort = (array)=>{
        var tmp, current, top = array.length;
        if(top) while(--top) {
            current = Math.floor(Math.random() * (top + 1));
            tmp = array[current];
            array[current] = array[top];
            array[top] = tmp;
        }
        setSorted(array);
    }
    return [sort,sorted]
}
export default useRandomSort;