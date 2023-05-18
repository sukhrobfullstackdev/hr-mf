import {useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";

function FileLoader(){
    const {chatFileSend = false, fileLoaderProgress = 0, chatFile = {}} = useSelector(s=>s);
    return(
        <div className={`app-chat-file-loader ${chatFileSend ? 'show': ''}`}>
            <div className="file-loader-icon">
                <span className="position-relative">
                    {
                        fileLoaderProgress
                    }
                </span>
            </div>
            <div className="file-loader-info">
                <div>
                    <strong className="text-muted text-no-wrap">
                        {
                            chatFile.name
                        }
                    </strong>
                </div>
                <div className="ml-2">
                    <SizeLoader size={chatFile.size} progress={fileLoaderProgress}/>
                </div>
            </div>
        </div>
    )
}
const SizeLoader = ({size, progress})=>{
    return useMemo(()=>{
        let kb = (size * progress )/ 100;
        let type = 'Kb';
        kb = kb / 1024;
        if (kb > 1024) {
            kb = kb / 1024;
            type = 'Mb'
        } else if (kb > (1024 * 1024)) {
            kb = kb / 1024 / 1024;
            type = 'Gb';
        }
        return(
            <span className="text-no-wrap">{kb.toFixed(2)} {type}</span>
        )
    },[progress])
}
export default FileLoader