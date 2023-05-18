import {useGetDynamic} from "../../../../../hooks/useGet";
import {useEffect, useLayoutEffect, useState} from "react";
import {GET_STRUCTURE} from "../../../../../store/types";
import {Button, Card, Col, Collapse, Modal, Row, Skeleton} from "antd";
import NoData from "../../../../../components/NoData";
import {FolderOutlined} from "@ant-design/icons";
import {IconEye, IconFolder, IconFolderAdd, IconFolderRemove} from "../../../../../components/Icon";
import {useSelector} from "react-redux";
import Regions from "../Regions";
import ChildOrgans from "../index";
import {Link} from "react-router-dom";
import UserTableAvatar from "../../../../../components/UserTableAvatar";


function Item({item, index = false}){
    const [isModalVisible,setIsModalVisible] = useState(false);
    const onClose = ()=>{
        setIsModalVisible(false)
    }
    const onView = ()=>{
        setIsModalVisible(true)
    }
    return  <>
                <Row className={`w-100 ${index ? '' : 'mb-3'}`} align="middle">
                    {
                        index ? "" :
                            <Col className="pr-2 ml-auto">
                                <FolderOutlined style={{fontSize: "24px"}}/>
                            </Col>
                    }
                    <Col span={index ? 20 : 19}>
                        <strong>{item.label}</strong>
                    </Col>
                    <Col span={4} className="text-right">
                        <span className="mr-2">Jami shtatlar: {item.positions.length}</span>
                        <Button type="primary" size='small' onClick={onView}>
                            <IconEye/> Ko'rish
                        </Button>
                    </Col>
                </Row>
                <Modal width={'80%'}
                       onCancel={onClose}
                       title={item.label}
                       visible={isModalVisible}
                       footer={
                            <Row>
                                <Col span={24} className="text-right">
                                    <Button type="primary" onClick={onClose}>
                                        Yopish
                                    </Button>
                                </Col>
                            </Row>
                       }>
                    {
                        item.positions.length ?
                            <Row>
                                {
                                    item.positions.map(item=>{
                                        return  <Col span={24} key={`positions${item.id}`} className="mb-4">
                                                    <p className="m-0 py-2 border-bottom">
                                                        <strong>{item.position_name_uz}</strong>
                                                        <p className="small text-muted m-0">
                                                            Jami shtatlar: {parseInt(item.count)} ta. Vakant: {parseInt(item.count) - item.user.length} ta
                                                        </p>
                                                    </p>
                                                    {
                                                        item.user.length ?
                                                            item.user.map((user,i)=>{
                                                                return  <Row align="middle" gutter={8} className="py-2 border-bottom" key={`userList${user.id}`}>
                                                                            <Col span={1} className="text-center">
                                                                                {i+1}.
                                                                            </Col>
                                                                            <Col span={1}>
                                                                                <UserTableAvatar file={user.image} name={user.full_name.join()}/>
                                                                            </Col>
                                                                            <Col span={11}>
                                                                                <Link to={`/dashboard/staff/view/${user.id}`}>
                                                                                    {user.full_name}
                                                                                </Link>
                                                                                <p className="m-0 text-muted small">
                                                                                    Hodim
                                                                                </p>
                                                                            </Col>
                                                                            <Col span={3}>
                                                                                {user.classificator_code}
                                                                                <p className="m-0 text-muted small">
                                                                                    Klassifikator kodi
                                                                                </p>
                                                                            </Col>
                                                                            <Col span={3}>
                                                                                {item.rate}
                                                                                <p className="m-0 text-muted small">
                                                                                    Stavka
                                                                                </p>
                                                                            </Col>
                                                                            <Col span={3}>
                                                                                {item.razryad}
                                                                                <p className="m-0 text-muted small">
                                                                                    Razryad
                                                                                </p>
                                                                            </Col>
                                                                        </Row>
                                                            }):
                                                            <div className="py-2 text-muted small border-bottom pl-2" style={{backgroundColor: '#e1e1e1;'}}>
                                                                Hodim (lar) mavjud emas!
                                                            </div>
                                                    }
                                                </Col>
                                    })
                                }
                            </Row>:
                            <NoData/>
                    }
                </Modal>
            </>
}
function ItemWrapper({list}){
    return <div className="px-3 py-2">
                <div className="d-flex align-items-center w-100">
                    <div style={{fontSize: "24px"}}>
                        <IconFolder style={{marginRight: "12px"}}/>
                    </div>
                    <div className="w-100">
                        <Item index item={list}/>
                    </div>
                </div>
            </div>
}
const {Panel} = Collapse;
function Content({data = []}){
    return  data.length ?
        <Collapse
            accordion
            expandIcon={ panel =>
                <span style={{fontSize: "24px"}}>{panel.isActive ? <IconFolderRemove /> : <IconFolderAdd /> }</span>}>
            {
                data.map(list=>{
                    return list.children.length ?
                        <Panel key={`panel${list.id}`} header={<Item index item={list}/>}>
                            <Content data={list.children}/>
                        </Panel>
                        :
                        <ItemWrapper list={list}/>
                })
            }
        </Collapse>:
        <NoData size='sm' message={<span className="text-muted small">Bo'limlar mavjud emas!</span>}/>
}
function StructureComponent(){
    const activeOrganisation = useSelector(s=>s.activeOrganisation || null)
    const [data,get,loader] =useGetDynamic();
    useEffect(()=>{
        get(GET_STRUCTURE);
    },[])
    return  (
            loader ?
                <Loader/>:
                <>
                    <Content data={data}/>
                    {
                        activeOrganisation && !activeOrganisation.parent?
                            <>
                                <Regions/>
                                <ChildOrgans/>
                            </> : ""
                    }
                </>
    )
}
const Loader = ()=>{
    return(
        <Row>
            <Col span={24} className="mb-3">
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
            <Col span={24} className="mb-3">
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
            <Col span={24} className="mb-3">
                <Card>
                    <Skeleton active/>
                </Card>
            </Col>
        </Row>
    )
}
export const StructureContent = Content;
export default StructureComponent;