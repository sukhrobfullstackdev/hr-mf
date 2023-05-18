import {put, takeEvery} from "redux-saga/effects";
import store from "../../index";


function* ChangeChatList(action){
    if(action.payload){
        const test = store.getState().list;
        const a = test.filter(v=> v.id === action.payload.id);
        if(!a.length){
            test.push(action.payload);
            yield put({
                type: 'list',
                payload: test
            });
        }

    } else {
        yield put({
            type: 'list',
            payload: []
        });
    }
    yield put({
        type: 'chatReload',
        payload: Math.random()
    })
}
function* RemoveMessage(action){
    if(action.payload){
        const list = store.getState().list;
        const chatList = store.getState().chatList;
        const newList = list.filter(v=> v.id !== action.payload);
        const newMessage = chatList.messages.filter(v=> v.id !== action.payload);
        if(newList.length){
            yield put({
                type: 'list',
                payload: newList
            });
        }
        if(newMessage.length){
            chatList.messages = newMessage;
            yield put({
                type: 'chatList',
                payload: chatList
            });
        }
    }
    yield put({
        type: 'chatReload',
        payload: Math.random()
    })
}
function* EditMessage(action){
    if(action.payload){
        const chatList = store.getState().chatList;
        let isMessage = false;
        const messages = chatList.messages.map(item=>{
            if(item.id === action.payload.id){
                isMessage = true
                return {
                    ...item,
                    text: action.payload.text
                }
            }
            return item
        });
        if(!isMessage){
            const list = store.getState().list;
            const lists = list.map(item=>{
                if(item.id === action.payload.id){
                    isMessage = true
                    return {
                        ...item,
                        text: action.payload.text
                    }
                }
                return item
            })
            if(lists.length){
                yield put({
                    type: 'list',
                    payload: lists
                });
            }
        }else{
            if(messages.length){
                chatList.messages = messages;
                yield put({
                    type: 'chatList',
                    payload: chatList
                });
            }
        }
        yield put({
            type: 'chatReload',
            payload: Math.random()
        })
    }
}
export default function* rootSaga() {
    yield takeEvery('chat_data_list', ChangeChatList);
    yield takeEvery('remove_chat_message', RemoveMessage);
    yield takeEvery('edit_message', EditMessage);
}