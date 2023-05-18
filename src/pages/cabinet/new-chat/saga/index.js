import {takeEvery,put,call} from "redux-saga/effects";
import Axios from "axios";
import {URLParser} from "../../../../store/api";
import store from "../../../../store";


// New chat api;
export const GET_CHAT = 'get chat'
export const GET_CONTACTS = 'get user/contacts'
export const GET_CONTACTS_BY_SEARCH = 'get user/contacts search'
export const GET_COLLEGES = 'get user/colleges'
export const GET_MESSAGES_BY_CHAT = 'get chat/{id}'
export const CREATE_CHAT = 'post chat';
export const CHAT_SEND_FILE = 'post file/upload';
export const GET_CHAT_HASHID = 'get user/me';
export const ON_MESSAGE = 'ON_MESSAGE';
export const GET_MESSAGES_BY_CHAT_OLD = 'get chat/{id} messageOld';

export function Req ({type, data, headers, query,...config}){
    const [method, url] = URLParser(type);
    const token = localStorage.getItem('token');
    return Axios({
        url: `${process.env.REACT_APP_SERVER_URL}/newchat/api/v1/${url}`,
        method: method ? method : "GET",
        data: data ? data : {},
        params: query  && Object.keys(query).length ? query : {},
        headers: headers ? {
            ...headers,
            Authorization: token ? `Bearer ${token}` : ''
        } : {
            Authorization: token ? `Bearer ${token}` : ''
        },
        ...config
    });
}
function* Loader(type){
    const advanceLoader = store.getState().advanceLoader;
    const index = advanceLoader.indexOf(type);
    if( index > -1){
        advanceLoader.splice(index,1);
    }else{
        advanceLoader.push(type)
    }
    yield put({
        type: 'advanceLoader',
        payload: advanceLoader
    });
}
function* Parser(type,id) {
    return type.replaceAll('{id}',id);
}

// saga functions
export function* getMessageByChat(action){
    try{
        yield Loader(GET_MESSAGES_BY_CHAT);
        const newType = yield Parser(action.type,action.payload);
        const chatList = store.getState().chatList || {data:[]};
        const {data} = yield Req({
            type: newType,
        });
        const selectedChatContact = chatList.data.find(item=>item.chat.id == action.payload);
        if(selectedChatContact){
            const newSelectedContact = {
                ...selectedChatContact,
                ...selectedChatContact.chat,
                chatId: selectedChatContact.chat.id,
                message: data.content.reverse()
            }
            yield put({
                type: 'selectedChatContact',
                payload: newSelectedContact
            });
        }
        yield put({
            type: 'chatDontScroll',
            payload: false
        })
        yield Loader(GET_MESSAGES_BY_CHAT);
    }catch (err){
        yield Loader(GET_MESSAGES_BY_CHAT);
        console.log(err)
        yield put({
            type: 'toast',
            payload:{
                type :'error',
                message: `Chat yaratish bilan bog'liq muamo! Qayta urinib ko'ring.`
            }
        });
    }
}
export function* getMessageByChatOld(action){
    try{
        const selectedChatContact = store.getState().selectedChatContact;
        yield Loader(GET_MESSAGES_BY_CHAT_OLD);
        if(selectedChatContact && selectedChatContact.message && selectedChatContact.message.length){
            const message = selectedChatContact.message || [];
            const newType = yield Parser(action.type,action.payload);
            const {data} = yield Req({
                type: newType,
                query: {
                    size: 20,
                    lastMessageId: message[0].id
                }
            });
            if( 0 < data.totalElements){
                const reqMessage = data.content.reverse();
                const newSelectedContact = {
                    ...selectedChatContact,
                    ...selectedChatContact.chat,
                    chatId: selectedChatContact.chat.id,
                    message: reqMessage.concat(message)
                }
                yield put({
                    type: 'selectedChatContact',
                    payload: newSelectedContact
                });
            }else{
                yield put({
                    type: 'chatDontScroll',
                    payload: true
                })
            }
        }
        yield Loader(GET_MESSAGES_BY_CHAT_OLD);
    }catch (err){
        yield Loader(GET_MESSAGES_BY_CHAT_OLD);
        console.log(err)
        yield put({
            type: 'toast',
            payload:{
                type :'error',
                message: `Chat yaratish bilan bog'liq muamo! Qayta urinib ko'ring.`
            }
        });
    }
}
export function* getChatHashId(action){
    try{
        let userChat = null // localStorage.getItem('userChat');
        // userChat = userChat ? JSON.parse(userChat) : null;
        yield Loader(GET_CHAT_HASHID);
        if(userChat && Object.keys(userChat).length){
            yield put({
                type: 'userChat',
                payload: userChat
            });
        }
        else{
            const {data} = yield Req({
                type: GET_CHAT_HASHID,
            });
            localStorage.setItem('userChat', JSON.stringify(data));
            yield put({
                type: 'userChat',
                payload: data
            });
        }
        yield Loader(GET_CHAT_HASHID);
    }catch (err){
        console.log(err)
        yield put({
            type: 'toast',
            payload:{
                type :'error',
                message: `Chat yaratish bilan bog'liq muamo! Qayta urinib ko'ring.`
            }
        });
    }
}
export function* getContacts(action){
    try{
        const chatContactList = store.getState().chatContactList || []
        yield Loader(GET_CONTACTS);
        const {data} = yield Req({
            type: action.type,
            query: action.payload
        });
        const newArray = action.payload.page > 0 ? chatContactList.concat(data.content) : data.content;
        yield put({
            type: 'chatContactList',
            payload: newArray
        })
        yield put({
            type: 'chatContactListTotal',
            payload: data.totalElements,
        })
        yield Loader(GET_CONTACTS);
    }catch (err){
        yield Loader(GET_CONTACTS);
    }
}
export function* onSearch(action){
    try{
        yield Loader(GET_CONTACTS_BY_SEARCH);
        const {data} = yield Req({
            type: GET_CONTACTS,
            query: action.payload
        });
        const chatContactList = store.getState().chatContactList || [];
        const newList = action.payload.page > 0 ? chatContactList.concat(data.content) : data.content;
        yield put({
            type: 'chatContactList',
            payload: newList
        })
        yield put({
            type: 'chatContactListTotal',
            payload: data.totalElements,
        })
        yield Loader(GET_CONTACTS_BY_SEARCH);
    }catch (err){
        yield Loader(GET_CONTACTS_BY_SEARCH);
    }
}
export function* getChatList(action){
    try{
        const {page = 0, size = 10} = action.payload;
        const chatList = store.getState().chatList;
        yield Loader(action.type);
        const {data} = yield Req({
            type: action.type,
            query: {
                page: page,
                size: size
            }
        });
        yield put({
            type: 'chatList',
            payload: {
                data: page > 0 ? chatList.data.concat(data.content) : data.content,
                pageSize: data.size,
                total: data.totalElements,
                pages: data.totalPages,
                offset: data.offset
            }
        });
        yield Loader(action.type);
    }catch (err){
        yield Loader(action.type);
    }
}
export function* onMessage(action){
    const message = action.payload;
    if(message.type === 'SUCCESS_SEND_MESSAGE'){
        yield call(on_success_message, message);
    }
    if(message.type === 'SEND_MESSAGE'){
        yield call(on_message,message);
    }
    if(message.type === 'USER_STATE'){
        yield call(on_online,message);
    }
    if(message.type === 'SEND_USER_READ_MESSAGE'){
        yield call(on_read_message,message);
    }
    if(message.type === 'SUCCESS_READ_MESSAGE'){
        yield call(on_read, message);
    }
    if(message.type === 'USER_ACTION'){
        yield call(on_user_action, message);
        const timeOut = setTimeout(function* (){
            yield call(on_user_action, {
                ...message,
                typing: false
            })
            clearTimeout(timeOut);
        },2000)
    }
}
export function* onSendFile(action){
    const selectedChatContact = store.getState().selectedChatContact;
    const message = selectedChatContact.message || [];
    if(selectedChatContact){
        message.push(action.payload);
        yield put({
            type: 'selectedChatContact',
            payload: {
                ...selectedChatContact,
                message: message
            }
        });
    }
}
// Service
function* on_read_message(message){
    const selectedChatContact = store.getState().selectedChatContact;
    if(message.chatId === selectedChatContact.chatId){
        const newMessages = selectedChatContact.message.map(m=>{
            return{
                ...m,
                isSeen: true
            }
        });
        yield put({
            type: 'selectedChatContact',
            payload:{
                ...selectedChatContact,
                message: newMessages
            }
        });
        yield call(on_read, message);
    }
}
function* on_read(message){
    const chatList = store.getState().chatList;
    const newChatList = chatList.data.map(item=> {
        if(item.chat.id === message.body.chatId){
            return{
                ...item,
                chat: {
                    ...item.chat,
                    unreadMessageCount: 0
                }
            }
        }
        return item;
    });
    yield call(addChatToChatList, {
        ...chatList,
        data:newChatList
    })
}
function* on_online(message){
    const chatList = store.getState().chatList;
    const {data = []} = chatList;
    if(data.length){
        const changedChatListData = data.map(item=>{
            if(item.chat.id === message.body.chatId){
                return{
                    ...item,
                    chat: {
                        ...item.chat,
                        isOnline: message.body.isOnline
                    }
                }
            }
            return item;
        });
        yield addChatToChatList({
            ...chatList,
            data: changedChatListData
        });
    }

    // change is online selectedChatContact
    const selectedChatContact = store.getState().selectedChatContact;
    if(selectedChatContact && selectedChatContact.chatId === message.body.chatId){
        yield put({
            type: 'selectedChatContact',
            payload: {
                ...selectedChatContact,
                isOnline: message.body.isOnline
            }
        })
    }

}
function* on_success_message(message){
    const selectedChatContact = store.getState().selectedChatContact || {};
    let newMessages = selectedChatContact.message.map(item=>{
        if(item.tempId === message.body.tempId){
            return{
                ...item,
                isSend: null
            }
        }
        return item
    });
    yield put({
        type: 'selectedChatContact',
        payload: {
            ...selectedChatContact,
            message: newMessages
        }
    });
}
function* on_message(message){
    const chatContact = store.getState().selectedChatContact || [];
    const newMessages = chatContact.message;
    if(message.body.chatId === chatContact.chatId){
        newMessages.push(message.body);
        yield put({
            type: 'selectedChatContact',
            payload: {
                ...chatContact,
                message: newMessages
            }
        });
    }
    else{
        const chatList = store.getState().chatList;
        const {data = []} = chatList;
        if(data.length){
            const candidateChat = data.find(item=>item.chat.id === message.body.chat.id);
            if(candidateChat){
                yield changeChatListOrder(candidateChat,chatList);
            }else{
                data.unshift({
                    ...message.body.chat,
                    chat: {
                        ...message.body.from,
                        isOnline:true,
                        lastOnlineDate:Date.now(),
                        unreadMessageCount: 1
                    }
                });
                yield addChatToChatList({
                    ...chatList,
                    data: data
                })
            }
        }else{
            data.unshift({
                ...message.body.chat,
                chat: {
                    ...message.body.from,
                    isOnline:true,
                    lastOnlineDate:Date.now(),
                    unreadMessageCount: 1
                }
            });
            yield addChatToChatList({
                ...chatList,
                data: data
            })
        }

    }
}
function* addChatToChatList(chatList){
    yield put({
        type: 'chatList',
        payload: chatList
    })
}
function* changeChatListOrder(candidate,chatList){
    const chatRemoveList = chatList.data.filter(item=> candidate.chat.id !== item.chat.id);
    chatRemoveList.unshift({
        ...candidate,
        chat:{
            ...candidate.chat,
            unreadMessageCount: candidate.chat.unreadMessageCount + 1
        }
    });

    yield addChatToChatList({
        ...chatList,
        data:chatRemoveList
    });
}
function* on_user_action(message){
    const chatList = store.getState().chatList;
    const chatListData = chatList.data.map(item=>{
        if(item.chat.id === message.body.chatId){
            return{
                ...item,
                lastMessage: {
                    ...item.lastMessage,
                    typing: true
                }
            }
        }
        return item;
    });
    yield put({
        type: 'chatList',
        payload:{
            ...chatList,
            data: chatListData
        }
    });
    const selectedChatContact = store.getState().selectedChatContact;
    if(selectedChatContact && selectedChatContact.chatId === message.body.chatId){
        yield put({
            type: 'selectedChatContact',
            payload:{
                ...selectedChatContact,
                lastMessage: {
                    ...selectedChatContact.lastMessage,
                    typing: true
                }
            }
        })
    }
}

export default function* newChatSaga() {
    yield takeEvery(GET_CHAT, getChatList);
    yield takeEvery(GET_CONTACTS, getContacts);
    yield takeEvery(GET_MESSAGES_BY_CHAT, getMessageByChat);
    yield takeEvery(GET_CHAT_HASHID, getChatHashId);
    yield takeEvery(ON_MESSAGE, onMessage);
    yield takeEvery(GET_MESSAGES_BY_CHAT_OLD, getMessageByChatOld);
    yield takeEvery(GET_CONTACTS_BY_SEARCH, onSearch);
    // yield takeEvery(CHAT_SEND_FILE, onSendFile);
}