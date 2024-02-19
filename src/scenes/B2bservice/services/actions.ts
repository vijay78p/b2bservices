import {
  B2bserviceActionTypes,
  GetB2bservice,
  GetB2bserviceSuccess,
  GetB2bserviceError,
} from './models';

export const getB2bservice = (requestPayload: any): GetB2bservice => ({
  type: B2bserviceActionTypes.GET_B2BSERVICE,
  request: requestPayload,
});

export const getB2bserviceSuccess = (payload: any): GetB2bserviceSuccess => ({
  type: B2bserviceActionTypes.GET_B2BSERVICE_SUCCESS,
  payload,
});

export const getB2bserviceError = (error: Error): GetB2bserviceError => ({
  type: B2bserviceActionTypes.GET_B2BSERVICE_ERROR,
  error,
});
