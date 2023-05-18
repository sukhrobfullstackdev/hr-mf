import {Col, Row} from "antd";
import Birthdays from "../component/Birthdays";
import {useState} from "react";

function Birthday(){
    const [activeList,setActiveList] = useState(0);
    return(
        <div className="mt-5">
            <Row align="middle">
                <Col>
                    <img src="/images/image_birthday.svg" alt=""/>
                </Col>
                <Col>
                    <h1 className="m-0 pt-3">
                        <strong>Tug'ilgan kunlar</strong>
                    </h1>
                </Col>
                <Col span={19}>
                    <ul className="list-tab mb-0 justify-content-end">
                        <li className={`list-tab-item ${activeList === 0 && 'active'}`} onClick={()=>setActiveList(0)}>
                            Bugun
                        </li>
                        <li className={`list-tab-item ${activeList === 1 && 'active'}`} onClick={()=>setActiveList(1)}>
                            Ertaga
                        </li>
                        <li className={`list-tab-item ${activeList === 2 && 'active'}`} onClick={()=>setActiveList(2)}>
                            Indinga
                        </li>
                        <li className={`list-tab-item ${activeList === 3 && 'active'}`} onClick={()=>setActiveList(3)}>
                            Oy davomida
                        </li>
                    </ul>
                </Col>
            </Row>
            <Birthdays active={activeList}/>
        </div>
    )
}
export default Birthday;