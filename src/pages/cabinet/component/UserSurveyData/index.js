import {Col, Row} from "antd";
import UserAvatar from "../../../../styleComponents/UserAvatar";
import {useEffect, useState} from "react";
import {IconDownload, IconEdit} from "../../../../components/Icon";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";

function UserSurveyData({data}) {
    const user = useSelector(s=>s.isUser || {});
    return (
        <div className="px-5">
            <h3 className="mb-4 mt-5">
                <strong>
                    Ma'lumot noma
                </strong>
            </h3>
            <Row className="mb-4" align="middle">
                <Col sm={12} md={6} lg={4}>
                    <UserAvatar user={data} size={'xl'}/>
                </Col>
                <Col sm={12} md={18} lg={20}>
                    <h3>
                        <strong>
                            {data.full_name}
                        </strong>
                    </h3>
                    <p className="m-0 text-muted">
                        {data.specialty}
                    </p>
                </Col>
            </Row>
            <Row className="mb-4 border-bottom">
                <Col span={24}>
                    <strong>
                        Umumiy ma'lumot
                    </strong>
                </Col>
                <Col span={12}>
                    <div className="text-muted py-1">
                        Jinsi: {data.gender === 1 ? "Erkak" : 'Ayol'}
                    </div>
                    <div className="text-muted py-1">
                        Tug'ilgan sana: {new Date(data.birth_date).toLocaleDateString()}
                    </div>
                    <div className="text-muted py-1">
                        Tug'ilgan joyi: {data?.birth_city?.name_uz_lat}, {data?.birth_district?.name_uz_lat}
                    </div>
                    <div className="text-muted py-1">
                        Yashash manzili: {data?.live_region?.name_uz_lat}, {data?.live_district?.name_uz_lat}, {data.live_place}
                    </div>
                    <div className="text-muted py-1">
                        Kontakt ma'lumotlari: tel: {data.mob_phone_no}, email: {data.email}
                    </div>
                </Col>
                <Col span={12}>
                    <div className="text-muted py-1">
                        Fuqaroligi: {data?.citizenship?.name_uz}
                    </div>
                    <div className="text-muted py-1">
                        Millati: {data?.nationality?.name}
                    </div>
                    <div className="text-muted py-1">
                        JSHSHIR:: {data.pinfl}
                    </div>
                    <div className="text-muted py-1">
                        Passport seriyasi va raqami: {data.passport_seria}
                    </div>
                    <div className="text-muted py-1">
                        Ma'lumoti: {data.education}, ilmiy daraja - {data.academic_degree}, xujjat raqami
                        - {data.dimploma_number}
                    </div>
                </Col>
            </Row>
            <Row className="mb-4 border-bottom">
                <Col span={24}>
                    <strong>
                        Ish va o'qish faoliyati
                    </strong>
                </Col>
                {
                    data.activities.map(item => {
                        return (
                            <Col span={24} key={`activites${item.id}`} className="py-2">
                                <Row gutter={16}>
                                    <Col span={8}>
                                        <p className="text-muted mb-0">
                                            Tashkilot nomi va egallagan mansabi
                                        </p>
                                        {item.position}
                                    </Col>
                                    <Col span={8}>
                                        <p className="text-muted mb-0">
                                            O'qish yoki ishlash vaqti
                                        </p>
                                        <span className="px-1">
                                            {item.entered_at.substring(0,7)}
                                        </span>-
                                        <span className="px-1">
                                            {item.completed_at ? item.completed_at.substring(0,7) : "Hozirgacha ish joyi"}
                                        </span>
                                    </Col>
                                    <Col span={8}>
                                        <p className="text-muted mb-0">
                                            Tashkilot manzili
                                        </p>
                                        {item?.region?.name_uz_lat}, {item?.district?.name_uz_lat}, {item.place}
                                    </Col>
                                </Row>
                            </Col>
                        )
                    })
                }
            </Row>
            <Row className="mb-4 border-bottom">
                <Col span={24}>
                    <strong>
                        Oila a'zoari va yaqin qarindoshlari
                    </strong>
                </Col>
                {
                    data.family_infos.map(item => {
                        return (
                            <FamilyInfo key={`activites${item.id}`} item={item}/>
                        )
                    })
                }
            </Row>
            <Row>
                <Col span={24} className="text-right">
                    <Link to={`/cabinet/info/survey/${data.id}`} className="mr-3">
                        <IconEdit/> Taxrirlash
                    </Link>
                    <a className="mr-3" target={"_blank"} href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/user/reference/download/?user_id=${user.id}`}>
                        <IconDownload/>Ma'lumotnoma yuklab olish
                    </a>
                    <a target={"_blank"} href={`${process.env.REACT_APP_SERVER_URL_BY_FILE}/api/v1/survey/download/?key=${data.generated_key}`}>
                        <IconDownload/> So'rovnomani yuklab olish
                    </a>
                </Col>
            </Row>
        </div>
    )
}

function FamilyInfo({item, user}) {
    const [type, setType] = useState('Ota');
    useEffect(() => {
        console.log(item)
        switch (item.type) {
            case "F":
                setType("Ota");
                break;
            case "M":
                setType("Ona");
                break;
            case "CH":
                //Farzandga tekshiruv
                setType(item.gender_code === 1 ? "O'g'il" : 'Qizi');
                break;
            case "SP":
                setType("Turmush o'rtoq");
                break;
            case "D":
                setType("Qizi");
                break;
            case "OB":
                setType("Aka");
                break;
            case "LB":
                setType("Uka");
                break;
            case "OS":
                setType("Opa");
                break;
            case "LS":
                setType("Singil");
                break;
            case "S":
                setType("O'g'li");
                break;
            case "FL":
                setType("Qaynota");
                break;
            case "ML":
                setType("Qaynona");
                break;
        }
    }, []);
    return (
        <Row gutter={16} className="py-2">
            <Col xxl={4}>
                     <span className="text-muted">
                        Qarindoshlik darajasi
                    </span>
                <p className="m-0">
                    {type}
                </p>
            </Col>
            <Col xxl={6}>
                    <span className="text-muted">
                         F.I.Sh.
                    </span>
                <p className="m-0">
                    {item.full_name}
                </p>
            </Col>
            <Col xxl={6}>
                    <span className="text-muted">
                         Ish joyi va lavozimi
                    </span>
                <p className="m-0">
                    {item.job_place}
                </p>
            </Col>
            <Col xxl={8}>
                    <span className="text-muted">
                        Yashash manzili
                    </span>
                <p className="m-0">
                    {item?.live_region?.name_uz_lat}, {item?.live_district?.name_uz_lat}, {item.live_place}
                </p>
            </Col>
        </Row>
    )
}
export const FamilyInfoBlock = FamilyInfo;

export default UserSurveyData;