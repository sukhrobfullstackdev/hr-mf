import {Card, Col, Row} from "antd";
import {Link, useParams} from "react-router-dom";
import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useState} from "react";
import Small from "../../../../styleComponents/Small";
import BlockLoader from "../../../../components/Loader/BlockLoader";
import {IconChevronLeft} from "../../../../components/Icon";
import UserAvatar from "../../../cabinet/component/UserAvatar";
import UserJobList from "../../../../components/UserJobList";
import NoData from "../../../../components/NoData";

function ViewStaff(){
    const {id} = useParams();
    const [user,get,loader] = useGetDynamic();
    useEffect(()=>{
        get(`get user/passport_citizen/${id}/`);
    },[]);
    return (
        <Card>
            {
                loader ?
                    <ViewLoader/> :
                    Object.keys(user).length?
                        <>
                            <Row gutter={24}>
                                <Col span={4}>
                                    <UserAvatar className="mx-auto" updated={false} file={user.image} gender={user.gender}/>
                                </Col>
                                <Col span={20}>
                                    <Row gutter={24}>
                                        <Col span={8}>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Ism</Small>
                                                <Small className="pt-1">
                                                    <strong>{user.full_name.split(' ')[1]}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Familiya</Small>
                                                <Small className="pt-1">
                                                    <strong>{user.full_name.split(' ')[0]}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Sharif</Small>
                                                <Small className="pt-1">
                                                    <strong>{user.full_name.split(' ')[2]}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Jinsi</Small>
                                                <Small className="pt-1">
                                                    <strong>{user.gender === '1' ? 'Erkak' : 'Ayol'}</strong>
                                                </Small>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Tug'ilgan san</Small>
                                                <Small className="pt-1">
                                                    <strong>{new Date(user.date_of_birth).toLocaleDateString()}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Tug'ilgan joyi</Small>
                                                <Small className="pt-1">
                                                    <strong>{user.birth_place}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Yashash manzili</Small>
                                                <Small className="pt-1">
                                                    <strong>{user.living_place}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Passport ma'lumoti</Small>
                                                <Small className="pt-1">
                                                    <strong>
                                                        {user?.passport_seria || 'Mavjud emas!'}
                                                    </strong>
                                                </Small>
                                            </div>
                                        </Col>
                                        <Col span={8}>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Kim tomonidan berilgan</Small>
                                                <Small className="pt-1">
                                                    <strong>{user?.doc_give_place || 'Mavjud emas!'}</strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Telefon raqami</Small>
                                                <Small className="pt-1">
                                                    <strong>
                                                        {
                                                            user?.mob_phone_no || ` Ma'lumot mavjud emas!`
                                                        }
                                                    </strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Ichki raqami</Small>
                                                <Small className="pt-1">
                                                    <strong>
                                                        {
                                                            user?.home_phone || ` Ma'lumot mavjud emas!`
                                                        }
                                                    </strong>
                                                </Small>
                                            </div>
                                            <div className="border-bottom mb-3">
                                                <Small className="text-muted">Elektron pochta manzili</Small>
                                                <Small className="pt-1">
                                                    <strong>
                                                        {
                                                            user?.email || ` Ma'lumot mavjud emas!`
                                                        }
                                                    </strong>
                                                </Small>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <UserJobList position = {user.position}/>
                            <Row>
                                <Col span={24}>
                                    <h3 className="mb-4">
                                        <strong>
                                            Hodim diplom ma'lumotlari
                                        </strong>
                                    </h3>
                                </Col>
                            </Row>
                            {
                                user.diploma.length ?
                                    user.diploma.map(dip=>{
                                        return(
                                            <Row gutter={16} key={`diplomNumber${dip.diploma_number}`} className="border-bottom mb-3">
                                                <Col span={8}>
                                                    <Small className="text-muted">
                                                        <strong>Musassasa nomi</strong>
                                                    </Small>
                                                    {dip.institution_name}
                                                </Col>
                                                <Col span={3}>
                                                    <Small className="text-muted">
                                                        <strong>Musassasa turi va turkumi</strong>
                                                    </Small>
                                                    {dip.edu_type_name}, {dip.institution_type_name}
                                                </Col>
                                                <Col span={3}>
                                                    <Small className="text-muted">
                                                        <strong>Ta'lim yo'nalishi</strong>
                                                    </Small>
                                                    {dip.speciality_name}
                                                </Col>
                                                <Col span={3}>
                                                    <Small className="text-muted">
                                                        <strong>Ilmiy daraja</strong>
                                                    </Small>
                                                    {dip.degree_name}
                                                </Col>
                                                <Col span={3}>
                                                    <Small className="text-muted">
                                                        <strong>Holati</strong>
                                                    </Small>
                                                    {dip.status_name}
                                                </Col>
                                                <Col span={3}>
                                                    <Small className="text-muted">
                                                        <strong>Sana (boshlash/tugallash)</strong>
                                                    </Small>
                                                    {dip.edu_starting_date} - {dip.edu_finishing_date}
                                                </Col>
                                            </Row>
                                        )
                                    }):
                                    <NoData size="sm"/>
                            }
                            <Row>
                                <Col span={24} className="text-right">
                                    <Link to='/dashboard/staff'>
                                        <IconChevronLeft/> Ortga qaytish
                                    </Link>
                                </Col>
                            </Row>
                        </>:''
            }
        </Card>
    )
}
const ViewLoader = ()=>{
    return(
        <Row gutter={16}>
            <Col className="mb-3" span={12}>
                <BlockLoader type='title' className="mb-1"/>
                <BlockLoader/>
            </Col>
            <Col className="mb-3" span={12}>
                <BlockLoader type='title' className="mb-1"/>
                <BlockLoader/>
            </Col>
            <Col className="mb-3" span={12}>
                <BlockLoader type='title' className="mb-1"/>
                <BlockLoader/>
            </Col>
            <Col className="mb-3" span={12}>
                <BlockLoader type='title' className="mb-1"/>
                <BlockLoader/>
            </Col>
            <Col className="mb-3" span={12}>
                <BlockLoader type='title' className="mb-1"/>
                <BlockLoader/>
            </Col>
            <Col className="mb-3" span={12}>
                <BlockLoader type='title' className="mb-1"/>
                <BlockLoader/>
            </Col>
        </Row>
    )
}
export default ViewStaff