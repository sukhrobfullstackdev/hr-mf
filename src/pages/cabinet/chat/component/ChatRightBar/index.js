import {Card, Col, Divider, Input, Row, Skeleton} from "antd";
import useContacts from "../../../../../hooks/useContacts";
import ContactUser from "../ContactUser";
import Title from "antd/es/typography/Title";
import {useEffect, useMemo, useRef, useState} from "react";
import Style from "styled-components";
import {IconSearch} from "../../../../../components/Icon";


const ContactWrapper = Style.div`
    max-height: 55vh;
    overflow: auto;
`

function ChatRightBar() {
    const [data,get,loader] = useContacts();
    const [page,setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [sortUser,setSortUser] = useState([]);
    const [count,setCount] = useState(0);
    const contactBlock = useRef();
    useEffect(()=>{
        get(page);
    },[page]);
    useEffect(()=>{
        let mUser = users.concat(data.results || []);
        setUsers(mUser);
        setSortUser(mUser);
        setCount(data.count);
    },[data]);
    const search = useMemo(()=>{
        const onSearch = (e)=>{
            const sortText = e.target.value;
            if(sortText.length){
                const sortData = users.filter(v => v?.full_name.toLowerCase().indexOf(sortText.toLowerCase()) >= 0);
                setSortUser(sortData);
            }else{
                setSortUser(users);
            }
        }
        return  <Input onKeyUp={onSearch}
                       placeholder="Qidiruv"
                       prefix={<span className="text-muted"><IconSearch /></span>}
                />
    },[data]);
    const onScroll = (e)=>{
        if((contactBlock.current.offsetHeight + contactBlock.current.scrollTop >= contactBlock.current.scrollHeight)){
            if(count > page * 10){
                setPage(page + 1);
            }
        }
    }
    return  <Card>
                <div className="py-4">
                    <Row>
                        <Col span={24}>
                            <Title level={4}>Kontaktlar</Title>
                            <Divider/>
                        </Col>
                        <Col span={24}>
                            <div className="mb-3">
                                {search}
                            </div>
                        </Col>
                        <Col span={24}>
                            <p className="m-0 py-3 text-right">
                                Jami : {count} ta kontakdan {sortUser.length}
                            </p>
                            <ContactWrapper onScroll={onScroll} ref={contactBlock}>
                                {
                                    sortUser.map((item,i)=>{
                                        return <ContactUser key={`chatUserList${i}`} user={item}/>
                                    })
                                }
                                {
                                    loader ?
                                        <div className="pr-4">
                                            <Skeleton active avatar paragraph={{rows: 1}}/>
                                        </div>
                                        : ""
                                }
                            </ContactWrapper>
                        </Col>
                    </Row>
                </div>
            </Card>
}
export default ChatRightBar;

