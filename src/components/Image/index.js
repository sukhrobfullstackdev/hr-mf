import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {Skeleton} from "antd";

function Image({src, alt, className = ''}) {
    const [isShow, setIsShow] = useState(false);
    const img = useRef();
    const cb = useCallback((entries, observer) => {
        let isSh = false;
        for (const entry of entries) {
            isSh = entry.isIntersecting
        }
        setIsShow(isSh);
    }, [src])
    useLayoutEffect(() => {
        const image = new IntersectionObserver(cb, {
            target: img.current, threshold: 1.0
        })
        image.observe(img.current);
    }, [])
    const imgLoad = useMemo(()=>{
        return  <div className={`lazy-img-loader ${isShow ? '' : 'none'}`}>
                    <img src="/images/image.png" alt="Image load"/>
                </div>
    },[isShow])
    return  <div className={`lazy-img`}>
                <img className={`${className} ${isShow ? 'lazy-img-show' : ''}`} src={src} alt={alt} ref={img}/>
                {
                    imgLoad
                }
            </div>
}

export default Image