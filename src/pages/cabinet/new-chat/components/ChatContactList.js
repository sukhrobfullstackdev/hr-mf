import {Col, Row} from "antd";
import NoData from "../../../../components/NoData";
import {useEffect, useMemo, useRef, useState} from "react";
import ChatUser from "./ChatUser";
import {useDispatch, useSelector} from "react-redux";
import {IconClose, IconSearch} from "../../../../components/Icon";
import {GET_CONTACTS, GET_CONTACTS_BY_SEARCH} from "../saga";
import SpinnerLoader from "../../../../components/Loader/SpinnerLoader";
import ChatUserLoader from "../../../../components/Loader/ChatUserLoader";

function ChatContactList({height = '68%', cb = null,pageSize = 10}){
    const loader = useSelector(s=>{
        return s.advanceLoader.indexOf(GET_CONTACTS_BY_SEARCH) > -1 || s.advanceLoader.indexOf(GET_CONTACTS) > -1
    });
    const dispatch = useDispatch();
    const [search,setSearch] = useState(false);
    const {chatContactList = [], chatContactListTotal = 0,reload} = useSelector(s=>s);
    const contactBlock = useRef();
    const [page,setPage] = useState(0);
    useEffect(()=>{
        if(!search){
            dispatch({
                type: GET_CONTACTS,
                payload: {
                    size: pageSize,
                    page: page,
                }
            });
        }
    },[page,reload]);
    const onClick = (contact)=>{
        if(cb && typeof cb === 'function'){
            cb(contact);
        }
    }
    const onScroll = ()=>{
        if((contactBlock.current.offsetHeight + contactBlock.current.scrollTop + 50 >= contactBlock.current.scrollHeight)){
            if(chatContactListTotal >= page * pageSize){
                setPage(page + 1);
            }
        }
    }
    const contactList = useMemo(()=>{
        return(
            <>
                {
                    loader && search ?
                        <ChatUserLoader animation={loader}/>:''
                }
                {
                    chatContactList.map((contact,i)=>{
                        return(
                            <button onClick={()=>onClick(contact)} key={`contact${contact.id}`} type="button" className="app-chat-simple-btn">
                                <ChatUser imageSize={'SMALL'} user={contact}/>
                            </button>
                        )
                    })
                }
                {
                    loader && !search ?
                        <ChatUserLoader animation={loader}/>:''
                }
            </>

        )
    },[chatContactList,loader]);
    const onSearchToggle = ()=>{
        setSearch(!search);
        setPage(0);
    }
    return(
        <div style={{height: height}} className="app-chat-contacts-block" onScroll={onScroll} ref={contactBlock}>
            <Row justify="space-between" style={{position: 'sticky',top: 0, backgroundColor: '#fff',zIndex: 99}} className="px-3 pb-2">
                {
                    search ?
                        <Col span={24}>
                            <Search page={page} onToggle={onSearchToggle}/>
                        </Col> :
                        <>
                            <Col>
                                <strong className="text-muted small">{chatContactListTotal} kontaktlar</strong>
                            </Col>
                            <Col>
                                <button type="button" className="text-muted small app-chat-more-btn mr-1" onClick={onSearchToggle}>
                                    <IconSearch/>
                                </button>
                            </Col>
                        </>
                }
            </Row>
            <Row justify="space-between" className={`px-3`}>
                <Col span={24} className="mt-2">
                    {
                        chatContactList && chatContactList.length ?
                            contactList :
                            <div className="mt-3">
                                <NoData size="sm" message="Kontaklar mavjud emas!"/>
                            </div>
                    }
                </Col>
            </Row>
        </div>
    )
}
const Search = ({onToggle,page})=>{
    const searchLoader = useSelector(s=>s.advanceLoader.indexOf(GET_CONTACTS_BY_SEARCH) > -1);
    const dispatch = useDispatch();
    const searchInput = useRef();
    const timeOut = useRef();
    useEffect(()=>{
        if(page > 0){
            onSearch()
        }
    },[page]);
    const onSearch = ()=>{
        dispatch({
            type: GET_CONTACTS_BY_SEARCH,
            payload: {
                page: page,
                size: 10,
                search: searchInput.current.value
            }
        })
    }
    const onKeyUp = ()=>{
        const val = searchInput.current.value;
        if(val.trim().length){
            timeOut.current = setTimeout(()=>{
                onSearch();
                clearTimeout(timeOut.current);
            },1000);
            return null;
        }
        if(val === ''){
            onSearch();
        }
    }
    const onClose = ()=>{
        dispatch({
            type: 'reload',
            payload: Math.random()
        })
        onToggle();
        searchInput.current.value = '';
    }
    return (
        <Row>
           <Col span={22}>
               <input onKeyUp={onKeyUp} placeholder="Kimni qidiramiz ?" ref={searchInput} type="text" className="ant-input ant-input-sm"/>
           </Col>
            <Col span={2} className="text-center">
                <button type="button" className="text-muted small app-chat-more-btn" onClick={onClose}>
                    {
                        searchLoader ?
                            <SpinnerLoader/> : <IconClose/>
                    }
                </button>
            </Col>
        </Row>
    )
}
export default ChatContactList