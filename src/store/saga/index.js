import {all} from 'redux-saga/effects'
import universalSaga from "./universalSaga";
import userSaga from "./userSaga";
import chatSaga from "./chatSaga";
import newChatSaga from "../../pages/cabinet/new-chat/saga";


export default function* rootSaga() {
    yield all([
        universalSaga(),
        userSaga(),
        chatSaga(),
        newChatSaga()
    ])
}