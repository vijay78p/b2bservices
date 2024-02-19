import { call, put, takeLatest } from 'redux-saga/effects';
import { checkUserIsAuthorized } from '@utils';
import { B2bserviceActionTypes as Types, GetB2bservice } from './models';
import { getB2bserviceSuccess, getB2bserviceError } from './actions';
import { getB2bservice } from './api';

// Note - once you have built out your redux data-access lib, please remove the 'unknown' return type
// for your saga, and either 1) add a return type for the saga, or 2) add a type for the 'data' property
// that stores the return value of the 'yield' call within the saga.

function* requestB2bservice(action: GetB2bservice): unknown {
  try {
    const data = yield call(getB2bservice, action.request);
    yield put(getB2bserviceSuccess(data?.myStateData));
  } catch (error) {
    checkUserIsAuthorized(error);
    yield put(getB2bserviceError(error));
  }
}

export function* watchB2bserviceSaga() {
  yield takeLatest(Types.GET_B2BSERVICE, requestB2bservice);
}
