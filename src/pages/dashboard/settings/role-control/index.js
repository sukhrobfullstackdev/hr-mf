import {useGetDynamic} from "../../../../hooks/useGet";
import {useEffect, useState} from "react";
import {
    ADD_USER_ROLE_CONTROL,
    CHANGE_USER_ROLE_CONTROL,
    GET_USER_BY_ROLE,
    GET_USER_ROLE_CONTROL
} from "../../../../store/types";
import {Button, Card, Col, Form, Input, Modal, Row, Select, Skeleton} from "antd";
import {IconClose, IconPlus, IconSearch} from "../../../../components/Icon";
import AppTabel from "../../../../components/AppTabel";
import {useSelector} from "react-redux";
import Search from "antd/es/input/Search";
import usePost from "../../../../hooks/usePost";
import NoData from "../../../../components/NoData";

function DashboardRoleControl(){
    const [data,get,loader] = useGetDynamic();
    const [visible,setVisible] = useState(false);
    const [reload,setReload] = useState(false);
    const [post,postLoader] = usePost();
    useEffect(()=>{
        get(GET_USER_ROLE_CONTROL);
    },[reload]);
    const onClose = ()=>{
        setVisible(false);
        setReload(Math.random());
    }
    const onVisible = ()=>{
        setVisible(true);
    }
    const onClear = (id,role)=>{
        post(CHANGE_USER_ROLE_CONTROL,
            {
                user_id: id,
                role: role
            },
            ()=>{
                setReload(Math.random());
            }
        )
    }
    return(
        <div>
            <Row justify='space-between' align="middle" className="mb-4">
                <Col>
                    <h3 className="mb-0">
                        <strong>
                            Role boshqaruvi
                        </strong>
                    </h3>
                </Col>
                <Col>
                    <Button type="primary" onClick={onVisible}>
                        <IconPlus/> Yangi qo'shish
                    </Button>
                </Col>
            </Row>
            {
                loader ?
                    <Card><Skeleton active/></Card>:
                    <div>
                        {
                            data.length ?
                                data.map((item,i)=>{
                                    return(
                                        <Card className="mb-3" key={`rolesByUser${item.id}`}>
                                            <Row align="middle" gutter={15} >
                                                <Col>
                                                    {i+1}.
                                                </Col>
                                                <Col>
                                                    {
                                                        item.full_name
                                                    }
                                                </Col>
                                                <Col className="ml-auto">
                                                    {
                                                        item.roles.map(role=>{
                                                            return (
                                                                <Button onClick={()=>onClear(item.user_id,role)} size="small" type="primary" className="ml-2">
                                                                    {
                                                                        role === 'CHR' ? 'Hodimlarni tasdiqlash':
                                                                        role === 'AHR' ? `Kadrlar bo'limini tasdqlashv`:
                                                                        role === 'CRHR'? `Hodim qo'shish o'chirish` : null
                                                                    }
                                                                    <IconClose/>
                                                                </Button>
                                                            )
                                                        })
                                                    }
                                                </Col>
                                            </Row>
                                        </Card>
                                    )
                                }) :
                                <NoData/>
                        }
                    </div>
            }
            <Modal footer={null} width={'70%'} title="Hodimga role biriktiring" onCancel={onClose} visible={visible}>
                <UserList/>
            </Modal>
        </div>
    )
}
const {Option} = Select;
const UserList = ()=>{
    const data = useSelector(s=>s.userListByRole || []);
    const [search,setSearch] = useState({});
    const [post,loader,res] = usePost();
    const [columns,setColumns] = useState([
        {
            title: 'Hodim F.I.Sh.',
            dataIndex: 'full_name',
        },{
            title: 'Lavozimi',
            dataIndex: 'position_name',
        },{
            title: 'Rollar',
            dataIndex: 'roles',
            width: '30%',
            render: (_,col)=>{
                return(
                    <div>
                        <Form
                            initialValues={{user_id: col.id}}
                            onFinish={onFinish}
                            name={`form${col.full_name.replaceAll(' ','')}`}
                        >
                            <Row gutter={10} align="middle">
                                <Col span={16}>
                                    <Form.Item
                                        name="user_id"
                                        hidden={true}
                                    >
                                        <Input/>
                                    </Form.Item>
                                    <Form.Item
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Iltimos tanlang!'
                                            }
                                        ]}
                                        name='roles'
                                    >
                                        <Select
                                            size="small"
                                            mode="multiple"
                                            allowClear
                                            style={{
                                                width: '100%',
                                            }}
                                            placeholder="Iltimos tanlang"
                                        >
                                            <Option value='CHR'>Hodimlarni tasdiqlash</Option>
                                            <Option value='AHR'>Kadrlar bo'limini tasdqlash</Option>
                                            <Option value='CRHR'>Hodim qo'shish o'chirish</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item>
                                        <Button size="small" type="primary" htmlType="submit">
                                            Saqlash
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                )
            }
        }
    ]);
    const onFinish = (v)=>{
        post(ADD_USER_ROLE_CONTROL,v);
    }
    const onSearch = (v)=>{
        setSearch({
            search: v
        })
    }
    return(
        <div>
            <div className="mb-3">
                <Search enterButton={<Button type="primary"><IconSearch/></Button>} placeholder="Hodim F.I.Sh." onSearch={onSearch}/>
            </div>
            <AppTabel search={search} type={GET_USER_BY_ROLE} data={data} columns={columns}/>
        </div>
    )
}
export default DashboardRoleControl;