import {useNavigate, useParams} from "react-router-dom";
import Container from "../../../components/Container";
import {Alert, Button, message} from "antd";
import {IconCopy} from "../../../components/Icon";
import SurveyView from "../../../components/SurveyView";
import {useGetDynamic} from "../../../hooks/useGet";
import {useEffect, useState} from "react";
import {GET_APPEAL_TEMPLATE, GET_SURVEY_BY_KEY} from "../../../store/types";
import Req from "../../../store/api";
import {useDispatch} from "react-redux";
import StatusBadge from "../../../styleComponents/StatusBadge";

function Title({privatKey}) {
    const onCopy = () => {
        try {
            navigator.clipboard.writeText(privatKey);
            message.success('Nusxalandi!');
        } catch (err) {
            message.error('Hatolik!')
        }

    }
    return (
        <div className="text-center">
            <h3 className="py-3 m-0">
                Iltimos sizga berilgan murojaat kodini eslab qoling!
            </h3>
            <p>
                <strong>
                    <span className="mr-2">
                        Murojaat kodi:
                    </span>
                    <Button title="Nusxalash!" type="primary" size="small" onClick={onCopy}>
                        <IconCopy/> {privatKey}
                    </Button>
                </strong>
            </p>
        </div>
    )
}


function SurveyByKey() {
    const [data, get, loader] = useGetDynamic();
    const [btnLoader, setBtnLoader] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {key} = useParams();
    useEffect(() => {
        get(`${GET_SURVEY_BY_KEY}${key}/`);
    }, [key]);
    const getTemplate = () => {
        if ('id' in data) {
            setBtnLoader(true)
            Req({
                type: GET_APPEAL_TEMPLATE,
                data: {
                    survey_id: data.id,
                    type: 'employment'
                }
            }).then(res => {
                dispatch({
                    type: 'userAppeal',
                    payload: res.data
                });
                navigate(`/survey/appeal/${data.id}/`);
            }).catch(err => {
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Hatolik! Qayta urunib ko'ring!"
                    }
                })
            }).finally(() => {
                setBtnLoader(false)
            })
        }
    }
    return (
        <Container className="py-5">
            <Alert message={<Title privatKey={key}/>} type="success"/>
            <h3 className="my-4">
                <strong>Shaxsiy ma'lumotlar</strong>
            </h3>
            <SurveyView loader={loader} data={data}/>
            {
                !(data.user) && data.status === 'confirmed' ?
                    <div className="text-right">
                        {
                            data.application ?
                                <p className="">
                                    Siz ariza yuborgansiz. Arizangiz holati: <StatusBadge
                                    status={data.application.status}/>
                                </p> :
                                <Button type="primary" onClick={getTemplate}>
                                    Ariza topshirish
                                </Button>
                        }
                    </div> : ""
            }
        </Container>
    )
}

export default SurveyByKey;