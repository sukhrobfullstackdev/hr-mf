import './styles/index.scss';
import {useEffect, useMemo, useState} from "react";
import {DownOutlined, RightOutlined} from "@ant-design/icons";
import {Link, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";

function Menu({children,sm}){
    return  <div className={`app-menu ${sm ? 'px-2 hide' :'pl-4 show'} pt-3 pb-5`}>
                {children}
            </div>
}
function SubMenu({title, icon = '', children, siderHide = false}){
    const user = useSelector(s=>s.isUser || {});
    const [isShow,setShow] = useState(false);
    const [isActive , setIsActive] = useState(false);
    const location = useLocation();
    useEffect(()=>{
        for (const e of children) {
            let parentActive = location.pathname.replaceAll('/dashboard','');
            let path = e.path.replaceAll('/dashboard','')
            parentActive = parentActive.indexOf(path) >= 0;
            setIsActive(parentActive);
            if(parentActive){
                break;
            }
        }
    },[location.pathname]);
    const show=()=>{
        setShow(!isShow);
    }
    return  <div className={`app-sub-menu ${isShow && !siderHide ? 'show' : ''}`} onClick={ siderHide ? null : show}>
                <div className={`app-sub-menu-title ${isActive ? 'active' : ''}`}>
                    {
                         icon ? <span className="pr-1 app-menu-icon-box">{icon}</span> : ''
                    }
                    {
                         title ? <span className="app-menu-title">{title}</span> :''
                    }
                    <div className="ml-auto app-menu-chevron-icon">
                        {
                            isShow ? <DownOutlined /> : <RightOutlined />
                        }
                    </div>
                </div>
               <div className="app-sub-menu-items">
                   {
                       children.map(m=>{
                           return m.role.indexOf(user.current_role) > -1 ?
                                       <Item isActive={location.pathname === `/dashboard/${m.path}`} title={m.title} path={`/dashboard/${m.path}`} key={m.path} icon={m.icon || null}/> : ""
                       })
                   }
               </div>
            </div>
}
function Item({title,icon,path,isActive}){
    const location = useLocation();
    return useMemo(()=>{
        let parentActive = location.pathname.replaceAll('/dashboard','');
        const activePath = path.replaceAll('/dashboard','')
        parentActive = parentActive.indexOf(activePath);
        return (
            <Link to={`${path}`} className={`app-menu-item ${parentActive} ${parentActive >= 0 ? 'active' : ''} ${isActive ? 'child-active' : ''}`}>
                {
                    icon ? <span className="pr-1">{icon}</span> : ''
                }
                {
                    title ? <span className="app-menu-title">
                            {title}
                        </span> :''
                }
            </Link>
        )
    },[location.pathname]);
}

export {Menu,SubMenu,Item};