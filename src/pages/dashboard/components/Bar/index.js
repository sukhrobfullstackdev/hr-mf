import Style from "styled-components";
import useBar from "../../../../hooks/useBar";
import {Link} from "react-router-dom";
import {Item, Menu, SubMenu} from "../../../../styleComponents/Menu";

const LogoWrapper = Style.div`
    width: ${p=>p.sm ? '100%' :'90%'};
    padding: 36px 0;
`
const Logo = Style.img`
    width: 100%;
`
function Bar({siderHide = false}){
    const menu = useBar();
    return(
        <div className={`app-dashboard-sider ${siderHide ? 'hide' : 'show'}`}>
            <div className={`${siderHide ? 'px-2' : 'pl-4'} position-sticky`} style={{zIndex: 9, backgroundColor: '#fff'}}>
                <Link to='/dashboard/main' >
                    <LogoWrapper sm={siderHide}>
                        <Logo src={`/images/${siderHide ? 'logo_sm.svg' : 'logo.svg'}`}/>
                    </LogoWrapper>
                </Link>
            </div>
            <Menu sm={siderHide}>
                {
                    menu.length ?
                        menu.map(item=>{
                            return item.children && item.children.length ?
                                <SubMenu
                                    siderHide={siderHide}
                                    children={item.children}
                                    path={item.path}
                                    key={item.path}
                                    icon={item.icon || null}
                                    title={item.title}/> :
                                    <Item title={item.title} path={item.path} key={item.path} icon={item.icon || null}/>
                        })
                        :""
                }
            </Menu>
        </div>
    )
}
export default Bar