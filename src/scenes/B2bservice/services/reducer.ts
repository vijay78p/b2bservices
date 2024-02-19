import { B2bserviceAction, B2bserviceActionTypes as Types } from './models';

export interface B2bserviceState {
  // add your state properties here
  data: any;
  loading: boolean;
  error: Error | null;
}

const B2bserviceInitialState: B2bserviceState = {
  // add your initial state values here
  data: null,
  loading: false,
  error: null,
};

export default function (
  state: B2bserviceState = B2bserviceInitialState,
  action: B2bserviceAction,
): B2bserviceState {
  switch (action.type) {
    case Types.GET_B2BSERVICE: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case Types.GET_B2BSERVICE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        // add real success action payload here
        // (payload can be called whatever you want, e.g., 'memberClaimsResults')
      };
    case Types.GET_B2BSERVICE_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}
