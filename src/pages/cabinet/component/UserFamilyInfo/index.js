import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useLayoutEffect, useState} from "react";
import {GET_USER_FAMILY_CHILD_INFO, GET_USER_FAMILY_INFO} from "../../../../store/types";
import {Col, Row, Skeleton} from "antd";
import {useSelector} from "react-redux";
import Req from "../../../../store/api";

function UserFamilyInfo(){
    const [data,get,loader] = useGetDynamic();
    const user = useSelector(s=>s.isUser || null);
    const [family,setFamily] = useState([]);
    // const []
    useLayoutEffect(()=>{
        get(GET_USER_FAMILY_INFO);
    },[])
    useLayoutEffect(()=>{
        if('items' in data){
            let child = data.items.filter(v=>v.pnfl !== user.pinfl);
            const o = child.map(ch=> ({
                type: 'SP',
                firstName: ch.m_first_name,
                lastName: ch.m_family,
                patronName: ch.m_patronym,
                birthDay: ch.m_birth_day,
                pinfl: ch.m_pnfl,
                gender: 2
            }));
            if(o.length && o.length > 1){
                o.shift();
            }
            child = child.map(ch=>{
                return{
                    type: 'CH',
                    firstName: ch.name,
                    lastName: ch.surname,
                    patronName: ch.patronym,
                    birthDay: ch.birth_date,
                    pinfl: ch.pnfl,
                    gender_code: ch.gender_code
                }
            });
            let f = o.concat(child);
            const i = data.items.find(v=>v.pnfl === user.pinfl);
            if(i && Object.keys(i).length){
                const m = {
                    type: 'M',
                    firstName: i.m_first_name,
                    lastName: i.m_family,
                    patronName: i.m_patronym,
                    birthDay: i.m_birth_day,
                    pinfl: i.m_pnfl,
                    gender: 2
                }
                const p = {
                    type: 'P',
                    firstName: i.f_first_name,
                    lastName: i.f_family,
                    patronName: i.f_patronym,
                    birthDay: i.f_birth_day,
                    pinfl: i.f_pnfl,
                    gender: 2
                }
                f = f.concat([p,m]);
            }
            setFamily(f.filter(v=>v.pinfl !== user.pinfl));
            if(f.length){
                if(i && (i.f_pnfl || i.m_pnfl)){
                    Req({
                        type: GET_USER_FAMILY_CHILD_INFO,
                        data: {pinfl: i.f_pnfl || i.m_pnfl}
                    }).then(res=>{
                        let br = res.data.items.filter(v=>v.pnfl !== i.f_pnfl && user.pinfl !== v.pnfl);
                        br = br.map(ch => {
                            return{
                                type: 'BR',
                                firstName: ch.name,
                                lastName: ch.surname,
                                patronName: ch.patronym,
                                birthDay: ch.birth_date,
                                pinfl: ch.pnfl,
                                gender_code: ch.gender_code
                            }
                        })
                        f = f.concat(br);
                        f = f.sort(function(a,b){
                            let aDate = a.birthDay.split('.');
                            let bDate = b.birthDay.split('.');
                            aDate = aDate[aDate.length-1];
                            bDate = bDate[bDate.length-1];
                            return parseInt(aDate) - parseInt(bDate);
                        });
                        setFamily(f);
                    })
                }
            }
        }
    },[data]);
    return(
        <div>
            {
                loader ?
                    <Skeleton active/>:
                    family.map(item => {
                        return (
                            <FamilyInfo key={`activites${item.id}`} item={item} user={user}/>
                        )
                    })
            }
        </div>
    )
}
function FamilyInfo({item, user}) {
    const [type, setType] = useState('Ota');
    useEffect(() => {
        console.log(item.type)
        switch (item.type) {
            case "P":
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
            case "BR":
                // Aka uka, opa-singilga tekshiruv
                let itemBr = item.birthDay.split('.');
                let userBr = user.birth_date.split('-');
                itemBr = parseInt(itemBr[itemBr.length - 1]);
                userBr = parseInt(userBr[0]);
                if(itemBr < userBr){
                    setType(item.gender_code === 1 ? 'Aka': 'Opa')
                }else{
                    setType(item.gender_code === 1 ? 'Uka': 'Singil')
                }
                break;
        }
    }, [item,user])
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
                <p className="m-0 text-capitalize">
                    {item.lastName.toLowerCase()} {item.firstName.toLowerCase()} {item.patronName.toLowerCase()}
                </p>
            </Col>
            <Col xxl={6}>
                    <span className="text-muted">
                         Tug'ilgan sanasi
                    </span>
                <p className="m-0">
                    {item.birthDay}
                </p>
            </Col>
            <Col xxl={8}>
                    <span className="text-muted">
                        PINFL
                    </span>
                <p className="m-0">
                    {item.pinfl}
                </p>
            </Col>
        </Row>
    )
}
export default UserFamilyInfo;