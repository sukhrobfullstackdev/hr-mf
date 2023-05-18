import {Button, Card, Col, Form, Input, Radio, Row, Upload} from "antd";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {IconPlus, IconTrash} from "../../../../../components/Icon";
import Style from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {useForm} from "antd/es/form/Form";

const uploadButton = (
    <div style={{fontSize: "14px"}}>
        <IconPlus />
        <div
            style={{
                marginTop: 8,
            }}
        >
            Yuklash
        </div>
    </div>
);
const ButtonRemove = Style.button`
    position: absolute;
    right:6px;
    top:0;
    background-color: #fff;
    border: 1px dashed #f1f1f1;
    cursor:pointer;
`
function QuestionFormItem({value = []}){
    const [fileList,setFileList] = useState([]);
    const [props,setProps] = useState({
        onChange({file: f, fileList: fL}) {
           if(f.status !== 'uploading'){
               const st = fileList;
               let name = f.response.image.split('/');
               name = name[name.length-1];
               st.push({
                   ...f,
                   url: f.response.image,
                   name: name
               });
               setFileList(st);
           }
        },
        defaultFileList: 'images' in value ? value.images.map(v=>{
            const name = v.file.split('/');
            return{
                name: name[name.length - 1],
                url: v.file,
                response: {
                    ...v,
                    id: v.file_id
                }
            }
        }) : []
    })
    return(
        <Row gutter={16}>
            <Col span={24}>
                <Form.Item
                    label="Savol kiriting"
                    name="text"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos to'ldiring"
                        }
                    ]}
                >
                    <Input placeholder="Savol kiriting!"/>
                </Form.Item>
                <Form.Item
                    initialValue={props.defaultFileList}
                    name="files"
                    label="Savol uchun rasm yuklang"
                >
                    <Upload
                        {...props}
                        listType='picture-card'
                        accept={'image/*'}
                        headers={{Authorization: `Bearer ${localStorage.getItem('token')}`}}
                        action={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/v1/simple_test/upload/file/`}
                    >
                        {uploadButton}
                    </Upload>
                </Form.Item>
            </Col>
            <Col span={24}>
                <h1>Javob variantlar</h1>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="A"
                    name="aKey"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos to'ldiring"
                        }
                    ]}
                >
                    <Input placeholder="Javob variant A"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="B"
                    name="bKey"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos to'ldiring"
                        }
                    ]}
                >
                    <Input placeholder="Javob variant B"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="C"
                    name="cKey"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos to'ldiring"
                        }
                    ]}
                >
                    <Input placeholder="Javob variant C"/>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item
                    label="D"
                    name="dKey"
                    rules={[
                        {
                            required: true,
                            message: "Iltimos to'ldiring"
                        }
                    ]}
                >
                    <Input placeholder="Javob variant D"/>
                </Form.Item>
            </Col>
            <Col span={24}>
               <Form.Item
                label="To'g'ri javobni belgilang"
                name='isAnswer'
               >
                   <Radio.Group>
                       <Radio value={'A'}>A</Radio>
                       <Radio value={'B'}>B</Radio>
                       <Radio value={'C'}>C</Radio>
                       <Radio value={'D'}>D</Radio>
                   </Radio.Group>
               </Form.Item>
            </Col>
        </Row>
    )
}
export default QuestionFormItem;