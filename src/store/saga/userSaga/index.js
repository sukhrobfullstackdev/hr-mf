import Req from "../../api";
import { call, put, takeEvery } from "redux-saga/effects";
import { setToast } from "../../actions";
import { AUTH, AUTH_ERI, USER_LOGOUT, STAFFLIST_USER_LOGOUT, USER_ME, GET_STAFFLIST_USERDATA } from "../../types";

function* checkUser(user) {
  try {
    if (user.current_role === 'S') {
      if (user.activeUrl && typeof user.activeUrl === 'string' && user.activeUrl.indexOf('cabinet') >= 0) {
        return yield call(redirect, user.activeUrl);
      }
      return yield call(redirect, '/cabinet/news');
    } else if (user.current_role === 'SA' || user.current_role === "HR" ||
      user.current_role === "HO" || user.current_role === "HHR") {
      if (user.activeUrl && typeof user.activeUrl === 'string' && user.activeUrl.indexOf('dashboard')) {
        return yield call(redirect, user.activeUrl);
      }
      return yield call(redirect, '/dashboard/main');
    }
  } catch (err) {
    console.log(err)
  }
}

function* redirect(path) {
  yield put({
    type: 'redirect',
    payload: path
  });
}

function* Auth(action) {
  try {
    const { data } = yield Req({
      type: action.type,
      data: action.payload,
    });
    yield put(setToast({
      type: 'success',
    }));
    localStorage.setItem(`token`, data.access_token);
    if (data.is_shtatka) {
      localStorage.setItem('isStaffList', data.is_shtatka);
      yield put({
        type: 'redirect',
        payload: `/state/main`
      });
      yield put({
        type: 'userData',
        payload: data
      });
    } else {
      yield put({
        type: 'isUser',
        payload: data.context ? data.context : data.data
      });
      yield put({
        type: 'redirect',
        payload: `/dashboard/main`
      });
    }
  } catch (err) {
    const { data, status } = err.response;
    yield put({
      type: 'loader',
      payload: false
    });
    if (status < 500) {
      yield put(setToast({
        type: 'error',
        message: data?.message
      }));
      if (status === 401 || status === '401') {
        localStorage.removeItem('token');
        yield put({
          type: 'isUser',
          payload: null
        });
        yield put({
          type: 'redirect',
          payload: '/login'
        });
      }
    } else {
      yield put(setToast({
        type: 'error',
        message: "Tizim hatoligi qayta urinib ko'ring!"
      }));
    }
  }
}

function* AuthEri(action) {
  try {
    yield put({
      type: 'loader',
      payload: true
    })
    const { data } = yield Req({
      type: action.type,
      data: action.payload,
    });
    yield put({
      type: 'loader',
      payload: false
    })
    yield put(setToast({
      type: 'success',
      message: "Tizmiga muvaffaqiyatli kirdingiz!"
    }));
    localStorage.setItem(`token`, data.access_token);
    yield put({
      type: 'isUser',
      payload: data.data
    });
    yield put({
      type: 'redirect',
      payload: `/dashboard/main`
    });
  } catch (err) {
    const { data, status } = err.response;
    yield put({
      type: 'loader',
      payload: false
    });
    if (status < 500) {
      yield put(setToast({
        type: 'error',
        message: data?.message
      }));
      if (status === 401 || status === '401') {
        localStorage.removeItem('token');
        yield put({
          type: 'isUser',
          payload: null
        });
        yield put({
          type: 'redirect',
          payload: '/login'
        });
      }
    } else {
      yield put(setToast({
        type: 'error',
        message: "Tizim hatoligi qayta urinib ko'ring!"
      }));
    }
  }
}

function* UserMe(action) {
  try {
    const { payload = {} } = action;
    const { loginPage = false, activeUrl = null } = payload;
    const {data} = yield Req({
      type: action.type
    });
    const user = data.data;
    user.role = user.role.replaceAll(' ', '');
    user.role = user.role.replaceAll('[', '');
    user.role = user.role.replaceAll(']', '');
    user.role = user.role.replaceAll("'", '');
    user.role = user.role.split(',');
    yield put({
      type: "isUser",
      payload: user
    });
    yield put({
      type: 'is_user',
      payload: true
    });
    if (Object.keys(user).length) {
      yield call(checkUser, {
        ...user,
        activeUrl: loginPage ? (
          user.current_role === 'S' ? '/cabinet/info' : '/dashboard/main'
        ) : activeUrl
      })
    }
  } catch (err) {
    const { data, status } = err.response;
    yield put({
      type: 'loader',
      payload: false
    });
    if (status < 500) {
      yield put(setToast({
        type: 'error',
        message: data?.detail
      }));
      if (status === 401 || status === '401') {
        localStorage.removeItem('token');
        yield put({
          type: 'isUser',
          payload: null
        });
        yield put({
          type: 'redirect',
          payload: '/login'
        });
      }
    }
    else {
      yield put(setToast({
        type: 'error',
        message: "Tizim hatoligi qayta urinib ko'ring!"
      }));
    }
  }
}

function* StaffListUserMe(action) {
  try {
    const { data } = yield Req({
      type: action.type
    });

    yield put({
      type: "userData",
      payload: data
    });
  } catch (err) {
    const { data, status } = err.response;
    yield put({
      type: 'loader',
      payload: false
    });
    if (status < 500) {
      yield put(setToast({
        type: 'error',
        message: data?.message
      }));
      if (status === 401 || status === '401') {
        localStorage.removeItem('token');
        yield put({
          type: 'isUser',
          payload: null
        });
        yield put({
          type: 'redirect',
          payload: '/login'
        });
      }
    } else {
      yield put(setToast({
        type: 'error',
        message: "Tizim hatoligi qayta urinib ko'ring!"
      }));
    }
  }
}

function* LogOut(action) {
  try {
    yield Req({
      type: action.type
    });
    localStorage.removeItem(`token`);
    yield put({
      type: 'activeOrganisation',
      payload: null
    });
    yield put({
      type: 'redirect',
      payload: `/login`
    });
    yield put({
      type: 'isUser',
      payload: null
    });
  } catch (err) {
    const { data, status } = err.response;
    yield put({
      type: 'loader',
      payload: false
    });
    if (status < 500) {
      yield put(setToast({
        type: 'error',
        message: data?.message
      }));
      if (status === 401 || status === '401') {
        localStorage.removeItem('token');
        yield put({
          type: 'isUser',
          payload: null
        });
        yield put({
          type: 'redirect',
          payload: '/login'
        });
      }
    } else {
      yield put(setToast({
        type: 'error',
        message: "Tizim hatoligi qayta urinib ko'ring!"
      }));
    }
  }
}

export default function* rootSaga() {
  yield takeEvery(AUTH, Auth);
  yield takeEvery(AUTH_ERI, AuthEri);
  yield takeEvery(USER_ME, UserMe);
  yield takeEvery(GET_STAFFLIST_USERDATA, StaffListUserMe);
  yield takeEvery(USER_LOGOUT, LogOut);
  yield takeEvery(STAFFLIST_USER_LOGOUT, LogOut);
}