import Style from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {CameraOutlined, LoadingOutlined} from "@ant-design/icons";
import {useEffect, useMemo, useState} from "react";
import {Upload} from "antd";
import LightGallery from 'lightgallery/react';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';


// Plugins
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'

const Wrapper = Style.div`
    width: ${p=>p.size === 'sm' ? '66px' : '168px'};
    height: ${p=>p.size === 'sm' ? '66px' : '168px'};
    border-radius: 50%;
    margin: 1.5rem 0;
    box-shadow: 0px 16px 24px rgba(8, 35, 48, 0.16);
    position: relative;
`
const Avatar = Style.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
`
const AvatarUpload = Style.label`
    width: ${p=>p.size === 'sm' ? '24px' : '52px'};
    height: ${p=>p.size === 'sm' ? '24px' : '52px'};
    border-radius: 50%;
    background-color:  ${p=>p.disabled ? '#5e6fc7' : '#2943C9'};
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: #fff;
    font-size: ${p=>p.size === 'sm' ? '14px' : '24px'};
    cursor: pointer;
    position: absolute;
    right: 0;
    bottom:0;
    pointer-event: ${p=>p.disabled ? 'none' : 'unset'}
    @media (min-width: 860px) and (max-width: 960px){
        width: ${p=>p.size === 'sm' ? '40px' : '52px'};
        height: ${p=>p.size === 'sm' ? '40px' : '52px'};
    }
`
const LinkView = Style.a`
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
`
function UserAvatar({file, gender = 1, size= 'lg', className='',updated= true}){
    const user = useSelector(s=>s.isUser ? s.isUser : {});
    const [loader, setLoader] = useState(false);
    const dispatch = useDispatch();
    const changeFile = (info)=>{
        if (info.file.status === 'uploading') {
           setLoader(true);
           return;
        }
        if (info.file.status === 'done') {
            setLoader(false);
            // Get this url from response in real world.
            const image = info.fileList[info.fileList.length - 1]?.response?.data;
            user.images.splice(0,1,{
                image_url: image.image,
                image_id: image.id
            });
            if(image){
                dispatch({
                    type: 'isUser',
                    payload:{
                        ...user
                    }
                })
            }
        }
        if(info.file.status === 'error'){
            setLoader(false);
        }
    }
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg'|| file.type === 'image/jpg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJpgOrPng) {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Iltimos PNG,JPEG yoki JPG kengaytmali rasm tanlang!"
                }
            });
        }
        if (!isLt2M) {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Rasm uchun max. hajim 2Mb!"
                }
            });
        }
        return isJpgOrPng && isLt2M;
    }
    return  (
        <Wrapper size={size} className={className}>
            {
                file && file.length ?
                    <LightGallery
                        speed={500}
                        plugins={[lgThumbnail]}>
                        {
                            file.map(item=> (
                                    <LinkView key={`image${item.image_url}`} href={`${process.env.REACT_APP_SERVER_URL}${item.image_url}`}>
                                        <Avatar size={size} src={`${process.env.REACT_APP_SERVER_URL}${item.image_url}`} alt=""/>
                                    </LinkView>
                                )
                            )
                        }
                    </LightGallery>
                    :
                    <Avatar src={`/images/${gender == 1 ? 'man.png':'woman.png'}`} alt=""/>
            }
            {
                updated ?
                    <Upload
                        action={`${process.env.REACT_APP_SERVER_URL}/api/user/employee-image-upload/`}
                        name="image"
                        beforeUpload={beforeUpload}
                        onChange={changeFile}
                        showUploadList={false}
                        headers={{
                            Authorization:`Bearer ${ localStorage.getItem('token')}`
                        }}
                        accept='image/png,image/jpg,image/jpeg'
                    >
                        <AvatarUpload size={size} disabled={loader}>
                            {
                                loader ? <LoadingOutlined /> : <CameraOutlined />
                            }
                        </AvatarUpload>
                    </Upload>:''
            }
        </Wrapper>
    )
}
// Image full view wrapper
const ImageViewWrapper = Style.div`
    position: fixed;
    left:0;
    bottom:0;
    right: 0;
    top:0;
    z-index: 99999;
    background-color: rgba(0,0,0, .4);
    `
function ImageView({images}){
    return  <ImageViewWrapper>
                awdawd awd awd
            </ImageViewWrapper>
}
export default UserAvatar;