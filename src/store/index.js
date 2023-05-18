import React from "react";
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from "redux-saga";
import {composeWithDevTools} from "redux-devtools-extension";
import store from "./state";
import saga from "./saga";

const Store = (state = store, action) => {
    if(action.type){
        const reqState = {...state};
        let stateKey = action.type;
        reqState[stateKey] = action.payload;
        return reqState;
    }
    return state;
};
// create the Saga middleware
const sagaMiddleware = createSagaMiddleware();

const State = createStore(Store, composeWithDevTools(applyMiddleware(sagaMiddleware)));

// then run the Saga
sagaMiddleware.run(saga);
export default State;