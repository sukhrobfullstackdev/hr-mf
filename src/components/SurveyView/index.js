import {Card, Col, Row, Skeleton} from "antd";
import AppTabel from "../AppTabel";
import {useEffect, useState} from "react";
import UserAvatar from "../../styleComponents/UserAvatar";


function SurveyLoader(){
    return(
        <Row gutter={16}>
            <Col span={6}>
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
            <Col className="mt-3" span={24}>
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
        </Row>
    )
}

function SurveyView({data = {},loader = true}){
    const [familyColumn, setFamilyColumn] = useState([
        {
            title: 'Qarindoshlik turi',
            dataIndex: 'type',
            render: (_,col)=>{
                switch (col.type){
                    case "F":
                        return <span>Ota</span>;
                    case "M":
                        return <span>Ona</span>;
                    case "S":
                        return <span>O'g'il</span>;
                    case "SP":
                        return <span>Turmush o'rtoq</span>;
                    case "D":
                        return <span>Qiz</span>;
                    case "OB":
                        return <span>Aka</span>;
                    case "LB":
                        return <span>Uka</span>;
                    case "OS":
                        return <span>Opa</span>;
                    case "LS":
                        return <span>Singil</span>;
                }
            }
        },{
            title: 'F.I.Sh.',
            dataIndex: 'full_name'
        },{
            title: 'Ish joyi',
            dataIndex: 'job_place'
        },{
            title: `Tug'ilgan joyi`,
            dataIndex: 'birth_city',
            render:(_,col)=>{
                return (
                    <>
                        <div>{col?.birth_city?.name_uz_lat},</div>
                        <div>{col?.birth_district?.name_uz_lat}</div>
                    </>
                )
            }
        },{
            title: `Tug'ilgan sana`,
            dataIndex: 'birth_date'
        },{
            title: 'Yashash manzili',
            dataIndex: 'live_place',
            render: (_,col)=>{
                return (
                    <div>
                        <p className="mb-0">
                            {col?.live_region?.name_uz_lat}
                        </p>
                        <p className="mb-0">
                            {col?.live_district?.name_uz_lat}
                        </p>
                        <p className="mb-0">
                            {col.live_place}
                        </p>
                    </div>
                )
            }
        }
    ]);
    const [activitiesColumn, setActivitiesColumn] = useState([
        {
            title: `O'quv yurti, muassasa, korxona, tashkilot nomi va xarbiy qisim raqami ko'rsatilgan holatda egallagan mansabi`,
            dataIndex: 'position',
            width: '40%'
        },{
            title: 'Ish boshlagan sana',
            dataIndex: 'completed_at',
            width: '10%',
            render: (_,col)=>{
                return new Date(col.completed_at).toLocaleDateString()
            }
        },{
            title: `Bo'shagan sana`,
            dataIndex: 'entered_at',
            width: '10%',
            render: (_,col)=>{
                return new Date(col.entered_at).toLocaleDateString()
            }
        },{
            title: 'Manzili',
            dataIndex: 'place',
            render: (_,col)=>{
                return (
                    <div>
                        <p className="mb-0">
                            {col.region?.name_uz_lat}
                        </p>
                        <p className="mb-0">
                            {col.district?.name_uz_lat}
                        </p>
                        <p className="mb-0">
                            {col.place}
                        </p>
                    </div>
                )
            }
        }
    ]);
    return(
        loader ?
            <SurveyLoader/>:
            <>
                <Row className="mb-4">
                    <Col span={3}>
                        <UserAvatar className="mx-auto" size={"xl"} user={data}/>
                    </Col>
                    <Col span={21}>
                        <Row>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    F.I.Sh.
                                </div>
                                <div>
                                    {data.full_name}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    O'zgartirilgan F.I.Sh.
                                </div>
                                <div>
                                    {data.has_name_changed}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Tug'ilgan san
                                </div>
                                <div>
                                    {data.birth_date}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Tug'ilgan regioni
                                </div>
                                <div>
                                    {data?.birth_city?.name_uz_lat}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Tug'ilgan tuman / shaxar
                                </div>
                                <div>
                                    {data?.birth_district?.name_uz_lat}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Tug'ilgan qishloq
                                </div>
                                <div>
                                    {data.birth_village}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Fuqaroligi
                                </div>
                                <div>
                                    {data?.citizenship?.name_uz}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Millati
                                </div>
                                <div>
                                    {data?.nationality?.name}
                                </div>
                            </Col>
                            <Col className="mb-3" span={4}>
                                <div className="small text-muted">
                                    Jinsi
                                </div>
                                <div>
                                    {data.gender === 1 ? "Erkak" : "Ayol"}
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col className="mb-3" span="4">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Ma'lumoti
                            </div>
                            <div>
                                {data.education}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="4">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Qachon va qaysi bilim yurtini tugallagan
                            </div>
                            <div>
                                {data.education_completed}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="4">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Mutaxassislik
                            </div>
                            <div>
                                {data.specialty}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="4">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Ilmiy darajangiz
                            </div>
                            <div>
                                {data.academic_degree}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="4">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Xujjat raqami
                            </div>
                            <div>
                                {data.dimploma_number}
                            </div>
                        </Card>
                    </Col>

                    <Col className="mb-3" span={8}>
                        <Card className="h-100">
                            <div className="small text-muted">
                                Tergov ostida bo'lganmisiz yoki sud javobgarligiga tortilganmisiz
                            </div>
                            <div>
                                {data.family_conviction}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span={8}>
                        <Card className="h-100">
                            <div className="small text-muted">
                                Chet elda bo'lganmisiz
                            </div>
                            <div>
                                {data.abroad}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span={8}>
                        <Card className="h-100">
                            <div className="small text-muted">
                                Qarindoshlar chet elda yashaydilarmi
                            </div>
                            <div>
                                {data.family_living_abroad}
                            </div>
                        </Card>
                    </Col>

                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Yashash viloyat
                            </div>
                            <div>
                                {data?.live_region?.name_uz_lat}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Yashash shahar / tuman
                            </div>
                            <div>
                                {data?.live_district?.name_uz_lat}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Yashash ko'cha, uy raqami
                            </div>
                            <div>
                                {data.live_place}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Telefon raqami
                            </div>
                            <div>
                                {data.mob_phone_no}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Passport seriyasi va raqami
                            </div>
                            <div>
                                {data.passport_seria}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Kim tomonidan berilgan
                            </div>
                            <div>
                                {data.passport_giver}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                Amal qilish sanasi
                            </div>
                            <div>
                                {data.passport_expire_date}
                            </div>
                        </Card>
                    </Col>
                    <Col className="mb-3" span="6">
                        <Card className="h-100">
                            <div className="small text-muted">
                                JSHSHIR (PINFL) raqami
                            </div>
                            <div>
                                {data.pinfl}
                            </div>
                        </Card>
                    </Col>
                </Row>
                <h3 className="my-4">
                    <strong>Qarindoshlik</strong>
                </h3>
                <AppTabel data={data.family_infos} columns={familyColumn}/>

                <h3 className="my-4">
                    <strong>O'quv va mexnat faoliyati</strong>
                </h3>
                <AppTabel data={data.activities} columns={activitiesColumn}/>
                <div className="pb-3">
                    Holati: {data.status === 'new' ? 'Yangi' : data.status === 'confirmed' ? 'Tasdiqlangan' : 'Qaytarilgan'}
                </div>
            </>
    )
}
export default SurveyView;