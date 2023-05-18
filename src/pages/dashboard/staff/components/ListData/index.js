import {Card, Col, Row} from "antd";
import {Link} from "react-router-dom";
import {IconPlus} from "../../../../../components/Icon";
import {useMemo, useState} from "react";
import UnderDevelopment from "../../../../../components/UnderDevelopment";
import AllUserList from "../AllUserList";
import IsArchiveUsers from "../IsArchiveUsers";

function StaffList({activeTab = 1}) {

    return (
        <div>
            {
                activeTab === 'allUsers' ? <AllUserList/> : null
            }
            {
                activeTab === 'isArchive' ? <IsArchiveUsers/> : null
            }
            {
                activeTab === 'patient' ? <Card className="my-4"><UnderDevelopment/></Card> : null
            }
            {
                activeTab === 'businessTrip' ? <Card className="my-4"><UnderDevelopment/></Card> : null
            }
        </div>
    )
}

const Staffs = StaffList;

function ListData() {
    const [activeTab, setActiveTab] = useState('allUsers');
    const userList = useMemo(() => {
        return <Staffs activeTab={activeTab}/>
    }, [activeTab]);
    return (
        <Row justify='end' align='middle'>
            <Col span={20}>
                <h3>
                    <strong>Hodimlar</strong>
                </h3>
            </Col>
            <Col span={4} className="text-right">
                <Link className="ant-btn ant-btn-primary" to={`/dashboard/staff/add`}>
                    <IconPlus color={"#fff"}/> Qo'shish
                </Link>
            </Col>
            <Col span={24}>
                <ul className="list-tab mb-0">
                    <li className={`list-tab-item ${activeTab === 'allUsers' && 'active'}`}
                        onClick={() => setActiveTab('allUsers')}>
                        Barchasi
                    </li>
                    <li className={`list-tab-item ${activeTab === 'isArchive' && 'active'}`}
                        onClick={() => setActiveTab('isArchive')}>
                        Ishdan bo'shatilgan
                    </li>
                    <li className={`list-tab-item ${activeTab === 'patient' && 'active'}`}
                        onClick={() => setActiveTab('patient')}>
                        Bemorlar
                    </li>
                    <li className={`list-tab-item ${activeTab === 'businessTrip' && 'active'}`}
                        onClick={() => setActiveTab('businessTrip')}>
                        Xizmat safarlari
                    </li>
                </ul>
            </Col>
            <Col span={24}>
                {userList}
            </Col>
        </Row>
    )
}

export default ListData