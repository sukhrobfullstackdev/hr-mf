import {Button} from "antd";
import {IconChevronLeft, IconChevronRight} from "../Icon";
import './index.scss'
import {useEffect, useRef, useState} from "react";

function AppTab({children,className = ''}){
    const scrollBar = useRef();
    const [scrollWidth, setScrollWidth]=useState(0);
    const [clientWidth, setClientWidth]=useState(0);
    const [scrollTo,setScrollTo] = useState(0);
    useEffect(()=>{
        setScrollWidth(scrollBar.current.scrollWidth);
        setClientWidth(scrollBar.current.clientWidth);
    },[]);
    useEffect(()=>{
        scrollBar.current.scrollLeft = scrollTo;
        console.log(scrollTo);
    },[scrollTo]);
    const onNext = ()=>{
        const cW = scrollBar.current.clientWidt;
        const sW = scrollBar.current.scrollWidth;
        if(sW / cW >= 2){
            setScrollTo(clientWidth + cW);
        }else{
            setScrollTo(clientWidth + (scrollWidth - clientWidth));
        }
    };
    const onPrev = ()=>{
        const cW = scrollBar.current.clientWidt;
        const sW = scrollBar.current.scrollWidth;
        if(sW / cW >= 2){
            setScrollTo(clientWidth - cW);
        }else{
            setScrollTo(0);
        }
    };
    return(
        <div className={`app-tab ${className}`}>
            <Button size="small" onClick={onPrev}>
                <IconChevronLeft/>
            </Button>
            <div ref={scrollBar} className="app-tab-items">
                {children}
            </div>
            <Button size="small" onClick={onNext}>
                <IconChevronRight/>
            </Button>
        </div>
    )
}
export const AppTabButton = ({children,onClick, isActive =false})=>{
    return (
        <button className={`app-tab-button ${isActive ? 'active' : ''}`} onClick={onClick} type="button">
            {children}
        </button>
    )
}
export default AppTab