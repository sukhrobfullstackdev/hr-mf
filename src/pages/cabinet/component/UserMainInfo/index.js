import {connect, useDispatch} from "react-redux";
import Small from "../../../../styleComponents/Small";
import {Card, Col, Row, Skeleton} from "antd";
import {useLayoutEffect} from "react";
import Req from "../../../../store/api";
import {GET_USER_DATE} from "../../../../store/types";
import {useNavigate} from "react-router-dom";

function UserMainInfo({user = {}}){
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useLayoutEffect(()=>{
        Req({
            type: GET_USER_DATE,
        }).then(res=>{
            dispatch({
                type:'isUserInfo',
                payload: {
                    ...res.data,
                    pinfl: user.pinfl,
                }
            });
        }).catch(err=>{
            const {data,status} = err.response;
            if(status < 500){
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: data?.message
                    }
                });
                if(status === 401 || status === '401'){
                    localStorage.removeItem('token');
                    dispatch({
                        type: 'isUser',
                        payload: null
                    });
                    navigate('/login')
                }
            }else{
                dispatch({
                    type: 'toast',
                    payload: {
                        type: 'error',
                        message: "Tizim hatoligi qayta urinib ko'ring!"
                    }
                });
            }
        });
    },[])
    return  <div>
                <h2 className="py-3 m-0">
                    <strong>Umumiy ma'lumot</strong>
                </h2>
                {
                    Object.keys(user).length ?
                        <Row gutter={24}>
                            <Col sm={24} md={24} lg={12} xxl={12}>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Familiya</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {user?.full_name ? user.full_name.split(' ')[0] : "Ma'lumot mavjud emas!"}
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Ism</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {user?.full_name ? user.full_name.split(' ')[1] : "Ma'lumot mavjud emas!"}
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Sharif</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {user?.full_name ?
                                                user.full_name.split(' ').length > 3 ?
                                                    `${user.full_name.split(' ')[2]} ${user.full_name.split(' ')[3]}` : user.full_name.split(' ')[2]
                                                : "Ma'lumot mavjud emas!"}
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Jinsi</Small>
                                    <Small className="pt-1">
                                        <strong>{user.gender === '1' ? 'Erkak' : 'Ayol'}</strong>
                                    </Small>
                                </div>
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
                            </Col>
                            <Col sm={24} md={24} lg={12} xxl={10}>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Telefon raqami</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {
                                                user?.mob_phone_no || "Ma'lumot mavjud emas"
                                            }
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Uy raqami</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {
                                                user?.home_phone || "Ma'lumot mavjud emas"
                                            }
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Elektron pochta manzili</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {
                                                user?.email || "Ma'lumot mavjud emas"
                                            }
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Passport ma'lumoti</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {
                                                user?.passport_seria || "Ma'lumot mavjud emas"
                                            }
                                        </strong>
                                    </Small>
                                </div>
                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Kim tomonidan berilgan</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {
                                                user?.given_by || "Ma'lumot mavjud emas"
                                            }
                                        </strong>
                                    </Small>
                                </div>

                                <div className="border-bottom mb-3">
                                    <Small className="text-muted">Yashash manzili</Small>
                                    <Small className="pt-1">
                                        <strong>
                                            {
                                                user?.living_place ||  "Ma'lumot mavjud emas"
                                            }
                                        </strong>
                                    </Small>
                                </div>
                            </Col>
                        </Row>:
                        <Card>
                            <Skeleton active/>
                        </Card>
                }
            </div>
}
export default connect((s)=>{
    return {
        user: s.isUserInfo || {}
    }
})(UserMainInfo);