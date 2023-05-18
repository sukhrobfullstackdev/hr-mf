import {Card, Skeleton, Steps} from "antd";
import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import StepOne from "../../../survey/components/StepOne";
import StepTwo from "../../../survey/components/StepTwo";
import StepThree from "../../../survey/components/StepThree";
import Req from "../../../../store/api";
import {GET_USER_ADD_SURVEY, GET_USER_SURVEY, UPDATE_USER_ADD_SURVEY} from "../../../../store/types";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useGetDynamic} from "../../../../hooks/useGet";
import moment from "moment";

const {Step} = Steps;
function UserSurveyPage(){
    const [loader,setLoader] = useState(false);
    const [survey,get,surveyLoader] = useGetDynamic();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const current = useSelector(s => s.surveyCurrent || 0);
    const onFinish=(formData)=>{
        setLoader(true);
        Req({
            type: id ? `${UPDATE_USER_ADD_SURVEY}${id}/` : GET_USER_ADD_SURVEY,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(res => {
            dispatch({
                type: 'survey',
                payload: {}
            });
            dispatch({
                type: 'surveyCurrent',
                payload: 0
            })
            dispatch({
                type: 'toast',
                payload: {
                    type: 'success',
                    message: "So'rovnoma saqlandi!"
                }
            })
            navigate(`/cabinet/info/`);
        }).catch(err => {
            dispatch({
                type: 'toast',
                payload: {
                    type: 'error',
                    message: "Hatolik! Qayta urunib ko'ring!"
                }
            })
        }).finally(() => {
            setLoader(false);
        })
    }
    useEffect(()=>{
        if(!Object.keys(survey).length){
            get(GET_USER_SURVEY)
        }
    },[]);
    useEffect(()=>{
        if(survey && Object.keys(survey).length){
            survey.organization = survey?.organization?.id;
            survey.citizenship = survey?.citizenship?.id;
            survey.birth_city = survey?.birth_city?.id;
            survey.birth_district = survey?.birth_district?.id;
            survey.live_district = survey?.live_district?.id;
            survey.live_region = survey?.live_region?.id;
            survey.nationality = survey?.nationality?.id;
            survey.mob_phone_no = survey?.mob_phone_no.replaceAll('+','');
            survey.family_info = survey.family_infos.map((item)=>{
                return {
                    ...item,
                    birth_city: item?.birth_city?.id,
                    birth_district: item?.birth_district?.id,
                    live_district: item?.live_district?.id,
                    live_region: item?.live_region?.id,
                }
            });
            survey.activity = survey.activities.map((item)=>{
                return{
                    ...item,
                    region: item?.region?.id,
                    district: item?.district?.id,
                    entered_at: item?.entered_at ? moment(item.entered_at): '',
                    completed_at: item?.completed_at ? moment(item.entered_at): ''
                }
            })
            delete survey['family_infos']
            delete survey['activities']
            dispatch({
                type: 'survey',
                payload: survey
            });
        }
    },[survey]);
    return(
        loader ?
            <Skeleton active/>:
            <Card>
                {
                    surveyLoader ?
                        <Skeleton active/> :
                        <>
                            <Steps current={current}>
                                <Step title={`Shaxsiy ma'lumotlar`}/>
                                <Step title={`Yaqin qarindoshlik`}/>
                                <Step title={`Faoliyat`}/>
                            </Steps>
                            <div className="steps-content py-5">
                                {
                                    current === 0 ?
                                        <StepOne/> :
                                        current === 1 ?
                                            <StepTwo/> :
                                            <StepThree userOnFinish={onFinish}/>
                                }
                            </div>
                            <div className="text-center">
                                <Link to={"/cabinet/info"}>
                                    Bekor qilish
                                </Link>
                            </div>
                        </>
                }
            </Card>
    )
}
export default UserSurveyPage;