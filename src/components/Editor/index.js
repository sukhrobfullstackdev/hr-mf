import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import './index.scss';
import SunEditor from "suneditor-react";
import 'suneditor/dist/css/suneditor.min.css';


const Editor =(props)=>{
    const {onChange, value = null, placeholder = 'Hujjat mazmunini kiriting!'} = props;
    const [middleValue, setValue] = useState(value);
    useEffect(()=>{
        onChange(middleValue);
    },[middleValue]);
    return(
        <SunEditor
            setOptions={{
                font : [
                    'Arial',
                    'tohoma',
                    'Courier New,Courier'
                ],
                fontSize : [
                    8, 10,12,14,16,18, 24, 36
                ],
                buttonList: [
                    ['font'],['fontSize'],
                    ['undo', 'redo'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat',
                        'fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list',],
                    ['table','link'],
                ]
            }}
            name={`editor`}
            setContents={value}
            width="100%"
            placeholder={placeholder}
            onChange={(value)=>setValue(value)}/>
    )
}

export default Editor;