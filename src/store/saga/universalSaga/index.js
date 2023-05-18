import {put, takeEvery} from "redux-saga/effects";
import Req from "../../api";
import {setToast} from "../../actions";
import {
    ADD_COMMANDS,
    ADD_EMPLOYEE_FOR_ADMIN,
    ADD_ORGAN,
    ADD_POSITIONS,
    ADD_SECTION,
    ADD_STAFF,
    ADD_USERS,
    CHAT_CREATE,
    CREATE_SALARY,
    GET_CHAT_BY_ID,
    GET_COMMANDS,
    GET_DISMISS_SHEET,
    GET_EMPLOYEE_FOR_ADMIN,
    GET_IQ_TESTS,
    GET_NOTICE,
    GET_ONE_COMMANDS,
    GET_ONE_ORGAN,
    GET_ONE_POSITIONS,
    GET_ONE_SECTION,
    GET_ORGAN,
    GET_POSITIONS,
    GET_SALARY,
    GET_SECTION,
    GET_STAFF,
    GET_STAFF_IS_ARCHIVE,
    GET_TABLE_USER_LIST,
    GET_TIME_TABLE_EVENT,
    GET_TIME_TABLE_EVENT_BY_USER,
    GET_USER_CALENDAR_VIEW,
    GET_USERS,
    REMOVE_COMMAND,
    REMOVE_POSITIONS,
    REMOVE_SALARY,
    REMOVE_SECTION,
    SELECT_ORGANISATION,
    UPDATE_COMMANDS,
    UPDATE_ORGAN,
    UPDATE_POSITIONS,
    UPDATE_SECTION,
    UPDATE_STAFF,
    GET_STATE_ORGS,
    UPDATE_STATE_ORG,
    GET_STATE_DEPARTMENTS,
    GET_ORG_STAFFLIST,
    UPDATE_STATE_DEPARTMENT,
    REMOVE_DEPARTMENT,
    GET_STATE_USERS,
    GET_STAFFLIST_DEPARTMENT_USERS,
    GET_USER_TAX,
    GET_USER_BY_ROLE,
    GET_USER_CALENDAR,
    GET_CALENDAR_BY_STAFF,
    GET_MINFIN_TEST,
    GET_ALL_TIME_TABLE,
    GET_APPEAL_HR,
    GET_VACATION_STAFF,
    GET_ORGAN_CHILDREN,
    GET_SURVEYS,
    GET_BUSINESS_TRIP_PLAN,
    GET_ORDER_TYPES
} from "../../types";

function parser(type){
    return type.split(' ');
}

function* Get(action){
    try{
        const [,,key] = parser(action.type);
        const {payload = new Object()} = action;
        const {current = 1, page_size = 10, dontPage  = false} = payload;
        const {query = {} } = action?.payload;
        yield put({
            type: 'loader',
            payload: true
        })
        let {data} = yield Req({
            type: action.type,
            query: dontPage ? {
                page: current,
                page_size: page_size,
                ...query
            } : {
                ...query
            }
        });
        yield put({
            type: 'loader',
            payload: false
        });
        if(Array.isArray(data)){
            yield put({
                type: key,
                payload: data
            });
            yield put({
                type: 'tableCount',
                payload: data.length
            });
        }
        else{
            yield put({
                type: 'tableCount',
                payload: data.count
            });
            data = 'data' in data ? data.data : 'results' in data ? data.results : data
            yield put({
                type: key,
                payload: data
            });
        }
    }
    catch(err){
        yield put({
            type: 'loader',
            payload: false
        });
        const {data,status} = err.response;
        if(status < 500){
            yield put(setToast({
                type: 'error',
                message: data?.message
            }));
            if(status === 401 || status === '401'){
                localStorage.removeItem('token');
                localStorage.removeItem('isStaffList');
                yield put({
                    type: 'isUser',
                    payload: null
                });
                yield put({
                    type: 'redirect',
                    payload: '/login'
                });
            }
        }else{
            yield put(setToast({
                type: 'error',
                message: "Tizim hatoligi qayta urinib ko'ring!"
            }));
        }
    }
}
function* GetOne(action){
    try{
        const {payload = {}, type = ''} = action;
        const [method,url,key] = type.split(' ');
        const {id = null} = payload;
        if(key && key !== undefined){
            yield put({
                type: key,
                payload: {}
            })
        }
        yield put({
            type: 'loader',
            payload: true
        });
        const {data} = yield Req({
            type: `${method} ${url}${id || ''}`,
        });
        yield put({
            type: 'loader',
            payload: false
        });
        if(key && key !== undefined){
            yield put({
                type: key,
                payload: data.data ? data.data : data
            })
        }
    }
    catch(err){
        yield put({
            type: 'loader',
            payload: false
        });
        const {data,status} = err.response;
        if(status < 500){
            yield put(setToast({
                type: 'error',
                message: data?.message
            }));
            if(status === 401 || status === '401'){
                localStorage.removeItem('token');
                localStorage.removeItem('isStaffList');
                yield put({
                    type: 'isUser',
                    payload: null
                });
                yield put({
                    type: 'redirect',
                    payload: '/login'
                });
            }
        }else{
            yield put(setToast({
                type: 'error',
                message: "Tizim hatoligi qayta urinib ko'ring!"
            }));
        }
    }
}
function* Add(action){
    try{
        const {payload} = action;
        const {redirectUrl,reload} = payload;
        yield put({
            type: 'loader',
            payload: true
        });
        const {data} = yield Req({
            type: action.type,
            data: action.payload,
        });
        yield put({
            type: 'loader',
            payload: false
        });
        yield put(setToast({
            type: 'success',
            message: data?.content
        }));
        if(reload){
            yield put({
                type: 'reload',
                payload: Math.random()
            })
        }
       if(redirectUrl){
           yield put({
               type: 'redirect',
               payload: `/dashboard/${redirectUrl}`
           });
       }
    }
    catch (err){
        yield put({
            type: 'loader',
            payload: false
        });
        const {data,status} = err.response;
        if(status < 500){
            yield put(setToast({
                type: 'error',
                message: data?.message
            }));
            if(status === 401 || status === '401'){
                localStorage.removeItem('token');
                localStorage.removeItem('isStaffList');
                yield put({
                    type: 'isUser',
                    payload: null
                });
                yield put({
                    type: 'redirect',
                    payload: '/login'
                });
            }
        }else{
            yield put(setToast({
                type: 'error',
                message: "Tizim hatoligi qayta urinib ko'ring!"
            }));
        }
    }
}
function* Update(action){
    try{
        const {payload = {},type} = action;
        const {redirectUrl,fullUrl,id,key} = payload;
        const [_,url] = parser(type);
        delete payload.fullUrl;
        yield put({
            type: 'loader',
            payload: true
        });
        const {data} = yield Req({
            type: `${type}${id}/`,
            data: action.payload,
        });
        if(key){
            yield put({
                type: key,
                payload: {}
            })
        }
        yield put({
            type: 'loader',
            payload: false
        });
        yield put(setToast({
            type: 'success',
            message: data?.content
        }));
        if (fullUrl) {
            yield put({
                type: 'redirect',
                payload: fullUrl
            });
        } else {
            const sagaUrl = `/dashboard/${redirectUrl ? redirectUrl : url}`;
            yield put({
                type: 'redirect',
                payload: sagaUrl
            });
        }
    }
    catch (err){
        yield put({
            type: 'loader',
            payload: false
        });
        const {data,status} = err.response;
        if(status < 500){
            yield put(setToast({
                type: 'error',
                message: data?.message
            }));
            if(status === 401 || status === '401'){
                localStorage.removeItem('token');
                localStorage.removeItem('isStaffList');
                yield put({
                    type: 'isUser',
                    payload: null
                });
                yield put({
                    type: 'redirect',
                    payload: '/login'
                });
            }
        }else{
            yield put(setToast({
                type: 'error',
                message: "Tizim hatoligi qayta urinib ko'ring!"
            }));
        }
    }
}
function* Remove(action){
    try{
        yield put({
            type: 'loader',
            payload: true
        });
        yield Req({
            type: `${action.type}${action.payload}/`,
        });
        yield put({
            type: 'loader',
            payload: false
        });
        yield put({
            type: 'reload',
            payload: Math.random()
        })
    }
    catch (err) {
        const {data,status} = err.response;
        yield put({
            type: 'loader',
            payload: false
        });
        if(status < 500){
            yield put(setToast({
                type: 'error',
                message: data?.message
            }));
            if(status === 401 || status === '401'){
                localStorage.removeItem('token');
                localStorage.removeItem('isStaffList');
                yield put({
                    type: 'isUser',
                    payload: null
                });
                yield put({
                    type: 'redirect',
                    payload: '/login'
                });
            }
        }else{
            yield put(setToast({
                type: 'error',
                message: "Tizim hatoligi qayta urinib ko'ring!"
            }));
        }
    }
}

export default function* rootSaga() {
    yield takeEvery(GET_ORGAN, Get);
    yield takeEvery(GET_ONE_ORGAN, GetOne);
    yield takeEvery(UPDATE_ORGAN, Update);
    yield takeEvery(SELECT_ORGANISATION, Add);

    // users saga
    yield takeEvery(GET_USERS, Get);
    yield takeEvery(ADD_USERS, Add);

    //organisation saga
    yield takeEvery(ADD_ORGAN, Add);
    yield takeEvery(GET_ORGAN_CHILDREN, Get);

    //sections saga
    yield takeEvery(GET_ONE_SECTION, GetOne);
    yield takeEvery(ADD_SECTION, Add);
    yield takeEvery(UPDATE_SECTION, Update);
    yield takeEvery(REMOVE_SECTION, Remove);

    //position saga
    yield takeEvery(GET_POSITIONS, Get);
    yield takeEvery(GET_ONE_POSITIONS, GetOne);
    yield takeEvery(ADD_POSITIONS, Add);
    yield takeEvery(UPDATE_POSITIONS, Update);
    yield takeEvery(REMOVE_POSITIONS, Remove);

    //Employee
    yield takeEvery(ADD_STAFF, Add);
    yield takeEvery(GET_USER_CALENDAR, Get);
    yield takeEvery(UPDATE_STAFF, Update);
    yield takeEvery(GET_STAFF, Get);
    yield takeEvery(GET_STAFF_IS_ARCHIVE, Get);
    yield takeEvery(GET_CALENDAR_BY_STAFF, Get);

    //Chat
    yield takeEvery(CHAT_CREATE, Add);
    yield takeEvery(GET_CHAT_BY_ID, GetOne);

    //Admin users
    yield takeEvery(ADD_EMPLOYEE_FOR_ADMIN, Add);

    //Commands || orders
    yield takeEvery(GET_COMMANDS, Get);
    yield takeEvery(GET_ONE_COMMANDS, GetOne);
    yield takeEvery(ADD_COMMANDS, Add);
    yield takeEvery(UPDATE_COMMANDS, Update);
    //Other apis
    yield takeEvery(GET_SECTION,Get);
    yield takeEvery(GET_NOTICE,Get);
    yield takeEvery(GET_DISMISS_SHEET, Get);
    yield takeEvery(GET_TABLE_USER_LIST,Get);
    yield takeEvery(GET_TIME_TABLE_EVENT,Get);
    yield takeEvery(GET_ALL_TIME_TABLE,Get);
    yield takeEvery(GET_IQ_TESTS,Get);
    yield takeEvery(GET_MINFIN_TEST,Get);
    yield takeEvery(GET_USER_CALENDAR_VIEW,Get);
    yield takeEvery(GET_TIME_TABLE_EVENT_BY_USER,Get);
    yield takeEvery(GET_USER_TAX, Get);
    yield takeEvery(GET_USER_BY_ROLE, Get);
    yield takeEvery(GET_APPEAL_HR, Get);
    yield takeEvery(GET_VACATION_STAFF, Get);
    yield takeEvery(GET_SURVEYS, Get);
    //Commands
    yield takeEvery(GET_COMMANDS,Get);
    yield takeEvery(REMOVE_COMMAND,Remove);
    //Salary
    yield takeEvery(GET_SALARY,Get);
    yield takeEvery(CREATE_SALARY, Add);
    yield takeEvery(REMOVE_SALARY, Remove);
    //Admin users
    yield takeEvery(GET_EMPLOYEE_FOR_ADMIN,Get);
    // States
    yield takeEvery(GET_STATE_ORGS, Get);
    yield takeEvery(UPDATE_STATE_ORG, Update);
    yield takeEvery(GET_STATE_DEPARTMENTS, Get);
    yield takeEvery(UPDATE_STATE_DEPARTMENT, Update);
    yield takeEvery(REMOVE_DEPARTMENT, Remove);
    yield takeEvery(GET_STATE_USERS, Get);
    yield takeEvery(GET_STAFFLIST_DEPARTMENT_USERS, Get);
    yield takeEvery(GET_ORG_STAFFLIST, Get);
    // Business trips
    yield takeEvery(GET_BUSINESS_TRIP_PLAN, Get);

    // Order types
    yield takeEvery(GET_ORDER_TYPES, Get);

}