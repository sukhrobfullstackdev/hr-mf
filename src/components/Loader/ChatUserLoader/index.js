import {useMemo} from "react";

function ChatUserLoader({row = 1,size = 'md', reverse = false, animation=true}){
    const content = useMemo(()=>{
        return (
            <ul className={`app-chat-user-loader ${size} ${animation ? 'animation':''}`}>
                {
                    Array.from(Array(row),
                        (e, i) => {
                            return (
                                <li key={i} className={`${size} ${reverse ? 'reverse' : ''}`}>
                                    <span className="app-chat-user-loader-avatar"/>
                                    <span className="app-chat-user-loader-user-name"/>
                                </li>
                            )
                })}
            </ul>
        )
    },[row,animation]);
    return(
        content
    )
}
export default ChatUserLoader