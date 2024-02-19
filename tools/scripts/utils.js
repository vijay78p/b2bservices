const ANSI_RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const FGCYAN = '\x1b[36m';
const FGGREEN = '\x1b[32m';
const FGWHITE = '\x1b[37m';

function generateActions(moduleName) {
  const trimmedName = trimName(moduleName);
  const trimmedNameUpperCase = trimmedName.toUpperCase();

  return `import {
  ${trimmedName}ActionTypes,
  Get${trimmedName},
  Get${trimmedName}Success,
  Get${trimmedName}Error,
} from './models';

export const get${trimmedName} = (requestPayload: any): Get${trimmedName} => ({
  type: ${trimmedName}ActionTypes.GET_${trimmedNameUpperCase},
  request: requestPayload,
});

export const get${trimmedName}Success = (payload: any): Get${trimmedName}Success => ({
  type: ${trimmedName}ActionTypes.GET_${trimmedNameUpperCase}_SUCCESS,
  payload,
});

export const get${trimmedName}Error = (error: Error): Get${trimmedName}Error => ({
  type: ${trimmedName}ActionTypes.GET_${trimmedNameUpperCase}_ERROR,
  error,
});
`;
}

function generateAPI(moduleName, filePath) {
  const trimmedName = trimName(moduleName);

  const apiConstructor = getAPIConstructor(filePath);

  return `import config from '@config';
import { Channel } from '@find-care/models';
import { ${apiConstructor} } from '@services';

// change payload to param you would like to pass in API call, or remove if no param needed
export const get${trimmedName} = (payload: any) =>
  ${apiConstructor}
    // add your API endpoint here
    .get(config.api.memberProfileEndpoint, {
      params: {
        consumerCode: config.consumerCode,
        channel: Channel.Mobile,
        ...payload,
        // add any additional params here
      },
    })
    .then(({ data }) => data);
`;
}

function generateModel(moduleName) {
  const trimmedName = trimName(moduleName);
  const trimmedNameUpperCase = trimmedName.toUpperCase();

  return `export enum ${trimmedName}ActionTypes {
  GET_${trimmedNameUpperCase} = '[${trimmedName}] Get ${trimmedName}',
  GET_${trimmedNameUpperCase}_SUCCESS = '[${trimmedName}] Get ${trimmedName} Success',
  GET_${trimmedNameUpperCase}_ERROR = '[${trimmedName}] Get ${trimmedName} Error',
}

export interface Get${trimmedName} {
  type: typeof ${trimmedName}ActionTypes.GET_${trimmedNameUpperCase};
  // add real action payload here
  // ('request' payload can be called whatever you want, e.g., 'memberClaimsRequest')
  request: any;
}

export interface Get${trimmedName}Success {
  type: typeof ${trimmedName}ActionTypes.GET_${trimmedNameUpperCase}_SUCCESS;
  // add real success action payload here
  // (payload can be called whatever you want, e.g., 'memberClaimsResults')
  payload: any;
}

export interface Get${trimmedName}Error {
  type: typeof ${trimmedName}ActionTypes.GET_${trimmedNameUpperCase}_ERROR;
  error: Error;
}

export type ${trimmedName}Action = Get${trimmedName} | Get${trimmedName}Success | Get${trimmedName}Error;
`;
}

function generateReducer(moduleName) {
  const trimmedName = trimName(moduleName);
  const trimmedNameUpperCase = trimmedName.toUpperCase();

  return `import { ${trimmedName}Action, ${trimmedName}ActionTypes as Types } from './models';

export interface ${trimmedName}State {
  // add your state properties here
  data: any;
  loading: boolean;
  error: Error | null;
}

const ${trimmedName}InitialState: ${trimmedName}State = {
  // add your initial state values here
  data: null,
  loading: false,
  error: null,
};

export default function (
  state: ${trimmedName}State = ${trimmedName}InitialState,
  action: ${trimmedName}Action,
): ${trimmedName}State {
  switch (action.type) {
    case Types.GET_${trimmedNameUpperCase}: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case Types.GET_${trimmedNameUpperCase}_SUCCESS:
      return {
        ...state,
        data: action.payload,
        loading: false,
        // add real success action payload here
        // (payload can be called whatever you want, e.g., 'memberClaimsResults')
      };
    case Types.GET_${trimmedNameUpperCase}_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}
`;
}

function generateSagas(moduleName) {
  const trimmedName = trimName(moduleName);
  const trimmedNameUpperCase = trimmedName.toUpperCase();

  return `import { call, put, takeLatest } from 'redux-saga/effects';
import { checkUserIsAuthorized } from '@utils';
import { ${trimmedName}ActionTypes as Types, Get${trimmedName} } from './models';
import { get${trimmedName}Success, get${trimmedName}Error } from './actions';
import { get${trimmedName} } from './api';

// Note - once you have built out your redux data-access lib, please remove the 'unknown' return type
// for your saga, and either 1) add a return type for the saga, or 2) add a type for the 'data' property
// that stores the return value of the 'yield' call within the saga.

function* request${trimmedName}(action: Get${trimmedName}): unknown {
  try {
    const data = yield call(get${trimmedName}, action.request);
    yield put(get${trimmedName}Success(data?.myStateData));
  } catch (error) {
    checkUserIsAuthorized(error);
    yield put(get${trimmedName}Error(error));
  }
}

export function* watch${trimmedName}Saga() {
  yield takeLatest(Types.GET_${trimmedNameUpperCase}, request${trimmedName});
}
`;
}

function getAPIConstructor(filePath) {
  const moduleName =
    (filePath.match('scenes/(.*)/scenes') &&
      filePath.match('scenes/(.*)/scenes')[1]) ||
    '';

  switch (moduleName) {
    case 'FindCare':
      return 'constructFindCareRequest';
    case 'Claims':
      return 'constructClaimsRequest';
    case 'ProgramMarketplace':
      return 'constructProgramMarketplaceRequest';
    // Add future modules here when new teams join
    default:
      return 'constructFindCareRequest';
  }
}

function generateComponentTemplate(componentProperties) {
  return `import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@styles';

interface ${componentProperties.name}Props {
  testProps1?: string;
  testProps2?: number;
}

const ${componentProperties.name} = ({ testProps1, testProps2 }: ${componentProperties.name}Props) => {
  const [value, setValue] = useState(undefined);

  useEffect(() => {}, []);

  return (
    <>
      <View style={styles.container}>
        <Text>Component ${componentProperties.name} works!</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...colors.white_bg,
  },
});

export default ${componentProperties.name};
`;
}

function styleQuestion(question) {
  return `${FGGREEN}? ${FGWHITE}${BRIGHT}${question} ${ANSI_RESET}${FGCYAN}`;
}

function trimName(name) {
  return name.trim().slice(0, 1).toUpperCase() + name.slice(1).trim();
}

module.exports = {
  generateActions,
  generateAPI,
  generateModel,
  generateReducer,
  generateSagas,
  generateComponentTemplate,
  styleQuestion,
  trimName,
};
