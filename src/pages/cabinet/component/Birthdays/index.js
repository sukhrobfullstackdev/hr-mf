import {useEffect, useLayoutEffect, useState} from "react";
import Req from "../../../../store/api";
import {GET_BIRTHDAYS} from "../../../../store/types";
import './index.scss'
import {Card, Col, Row, Skeleton} from "antd";
import NoData from "../../../../components/NoData";
import Style from "styled-components";
import ButtonDefault from "../../../../styleComponents/ButtonDefault";
import {useGetDynamic} from "../../../../hooks/useGet";
import {act} from "react-dom/test-utils";

const CardBirthDay= Style.div`
    background-image: url("/images/birthday-bg.svg");
    background-repeat: no-repeat;
    background-position: center center;
`

function User({user}){
    return  <div className="user-list">
                {
                    user.image ?
                        <img className="img-fluid" src={`${process.env.REACT_APP_SERVER_URL}${user.image}`} alt={user?.full_name}/>
                        :
                        <div className="user-name img-fluid">{user?.full_name[0]}</div>
                }
            </div>
}
function ListUsers({date}){
    return  <Row gutter={22} className="mt-4">
                {
                    date.length ?
                        date.map((item,i)=>{
                            return  <Col xs={24} sm={24} md={12} lg={8} className="mb-3">
                                        {
                                           item.map(user=>{
                                               return <Card className={`mb-3 block-birthdays ${i % 2 ? 'even' : 'odd'}`}>
                                                           <Row align="middle" key={`user${user.id}`} className="w-100">
                                                               <Col xs={12} sm={12} md={16} lg={22} className="text-capitalize">
                                                                   <strong className='fio'>{user?.full_name.toLowerCase()}</strong>
                                                               </Col>
                                                               <Col xs={12} sm={12} md={8} lg={2} className="text-center">
                                                                   <ButtonDefault>
                                                                       <img src="/images/gift.svg" alt="gift"/>
                                                                   </ButtonDefault>
                                                               </Col>
                                                               <Col xs={12} sm={12} md={8} lg={4} className="text-muted">
                                                                   {
                                                                       new Date(user.birth_date).toLocaleDateString()
                                                                   }
                                                               </Col>
                                                               <Col xs={12} sm={12} md={8} lg={4} className="text-muted">
                                                                   {
                                                                       user.age
                                                                   } yosh
                                                               </Col>
                                                           </Row>
                                                           <CardBirthDay className="block-birthdays-user">
                                                               <User user={user}/>
                                                           </CardBirthDay>
                                                       </Card>
                                           })
                                        }
                                    </Col>
                        }) :
                        <NoData message={"Ma'lumot mavjud emas!"}/>
                }
            </Row>
}

function Birthdays({active = 1}){
    const [users, setUsers] = useState([]);
    const [birthdays, setBirthdays] = useState([]);
    const [userBirthdays,get,loader] = useGetDynamic();
    useLayoutEffect(()=>{
        get(GET_BIRTHDAYS);
    },[]);
    useEffect(()=>{
        setUsers(userBirthdays);
    },[userBirthdays]);
    useEffect(()=>{
        if(users.length){
            const a = [];
            const b = [];
            const c = [];
            let index = 1;
            const sortedUser = users.filter(v=>{
                const date = new Date(v.birth_date).getDate();
                switch(active){
                    case 3: return date >= new Date(Date.now()).getDate() + active;
                    default:
                        return date == new Date(Date.now()).getDate() + active;
                }
            });
            for(const u of sortedUser){
                switch (index){
                    case 1:
                         a.push(u);
                         index = 2;
                         break;
                    case 2:
                        b.push(u);
                        index = 3;
                        break;
                    case 3:
                        c.push(u);
                        index = 1;
                        break;
                }
            }
            setBirthdays([a,b,c]);
        }
    },[users,active])
    return loader ?
            <div className="my-3">
                <Row>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        <Card>
                            <Skeleton active/>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        <Card>
                            <Skeleton active/>
                        </Card>
                    </Col>
                    <Col xs={12} sm={12} md={8} lg={8}>
                        <Card>
                            <Skeleton active/>
                        </Card>
                    </Col>
                </Row>
            </div>
        : <ListUsers date={birthdays.length ? birthdays : []}/>
}
export default Birthdays;