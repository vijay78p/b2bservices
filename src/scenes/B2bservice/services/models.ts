export enum B2bserviceActionTypes {
  GET_B2BSERVICE = '[B2bservice] Get B2bservice',
  GET_B2BSERVICE_SUCCESS = '[B2bservice] Get B2bservice Success',
  GET_B2BSERVICE_ERROR = '[B2bservice] Get B2bservice Error',
}

export interface GetB2bservice {
  type: typeof B2bserviceActionTypes.GET_B2BSERVICE;
  // add real action payload here
  // ('request' payload can be called whatever you want, e.g., 'memberClaimsRequest')
  request: any;
}

export interface GetB2bserviceSuccess {
  type: typeof B2bserviceActionTypes.GET_B2BSERVICE_SUCCESS;
  // add real success action payload here
  // (payload can be called whatever you want, e.g., 'memberClaimsResults')
  payload: any;
}

export interface GetB2bserviceError {
  type: typeof B2bserviceActionTypes.GET_B2BSERVICE_ERROR;
  error: Error;
}

export type B2bserviceAction = GetB2bservice | GetB2bserviceSuccess | GetB2bserviceError;
