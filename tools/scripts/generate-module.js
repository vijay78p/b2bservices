/* eslint-disable */
const _fs = require('fs');
const _pathModule = require('path');
const {styleQuestion, trimName} = require('./utils');

const _readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ANSI_RESET = '\x1b[0m';
const FGMAGENTA = '\x1b[35m';

console.log("Let's create a new React Native module!");

// First Question - get new module name
const askName = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion(
        "What name would you like to use for your team's new module?",
      ),
      name => {
        if (!name) {
          console.log(ANSI_RESET + 'Please provide a module name.');
          process.exit(0);
        }

        const trimmedName = trimName(name);

        resolve(trimmedName);
      },
    );
  });

// Main Process
const main = async () => {
  const moduleName = await askName();
  // Await all questions answered
  const moduleProperties = {
    name: moduleName,
    fileName: moduleName.toLowerCase(),
    path: '/scenes',
  };

  // Path to module's folder
  const FOLDER_PATH = _pathModule.join(
    'src',
    moduleProperties.path,
    moduleProperties.name,
  );

  // Create folders synchronously
  _fs.mkdirSync(FOLDER_PATH, {recursive: true});

  const newModuleDirectories = [
    'components',
    'enums',
    'hooks',
    'mocks',
    'models',
    'navigation',
    'scenes',
    'services',
    'styles',
    'utils',
  ];

  // generate all new module's directories
  newModuleDirectories.forEach(dir => {
    const DIR_PATH = `${FOLDER_PATH}/${dir}`;
    _fs.mkdirSync(DIR_PATH, {recursive: true});

    if (dir !== 'scenes' && dir !== 'styles') {
      const indexFileContent = generateIndexTS(moduleProperties.fileName, dir);

      const INDEX_FILE_PATH = _pathModule.join(DIR_PATH, 'index.ts');
      _fs.writeFileSync(INDEX_FILE_PATH, indexFileContent);
    }
  });

  const newModuleDirectoriesContent = [
    {
      filePath: generateFilePath(`rootReducer-${moduleProperties.fileName}.ts`),
      fileContent: generateRootReducer(moduleProperties.fileName),
    },
    {
      filePath: generateFilePath(`rootSaga-${moduleProperties.fileName}.ts`),
      fileContent: generateRootSaga(moduleProperties.fileName),
    },
    {
      filePath: generateFilePath([
        'navigation',
        `${moduleProperties.name}StackList.ts`,
      ]),
      fileContent: generateStackList(moduleProperties.fileName),
    },
    {
      filePath: generateFilePath([
        'navigation',
        `${moduleProperties.name}Navigator.tsx`,
      ]),
      fileContent: generateNavigator(moduleProperties.fileName),
    },
  ];

  newModuleDirectoriesContent.forEach(content =>
    _fs.writeFileSync(content.filePath, content.fileContent),
  );

  function generateFilePath(path) {
    return Array.isArray(path)
      ? _pathModule.join(FOLDER_PATH, ...path)
      : _pathModule.join(FOLDER_PATH, path);
  }

  console.log(
    ANSI_RESET,
    `Success 🦅 🌎 => ${moduleProperties.name} module built! => `,
    FGMAGENTA,
    `${FOLDER_PATH}`,
    ANSI_RESET,
  );

  process.exit(0);
};

// Run Main Process
try {
  main();
} catch (err) {
  console.log(ANSI_RESET);
  console.log(err);
}

function generateIndexTS(name, dirType) {
  return dirType !== 'navigation'
    ? `// export * from './${name}_${dirType}';

// see /src/scenes/FindCare/${dirType} for example barrel file of this type

// add future exports here
export {};
`
    : `export * from './${trimName(name)}StackList';
`;
}

function generateRootReducer(moduleName) {
  return `// import TestFeature1Reducer from './scenes/TestFeature1/services/reducer';
// import TestFeature2Reducer from './scenes/TestFeature2/services/reducer';
// import TestFeature3Reducer from './scenes/TestFeature3/services/reducer';

export const ${moduleName}RootReducer = {
  // testFeature1: TestFeature1Reducer,
  // testFeature2: TestFeature2Reducer,
  // testFeature3: TestFeature3Reducer,
};
`;
}

function generateRootSaga(moduleName) {
  const trimmedName = trimName(moduleName);

  return `import { all, fork } from 'redux-saga/effects';
// import * as futureFeature1Sagas from './scenes/FutureFeature1/services/sagas';
// import * as futureFeature2Sagas from './scenes/FutureFeature2/services/sagas';
// import * as futureFeature3Sagas from './scenes/FutureFeature3/services/sagas';

export default function* rootSaga${trimmedName}() {
  yield all(
    [
      // ...Object.values(futureFeature1Sagas),
      // ...Object.values(futureFeature2Sagas),
      // ...Object.values(futureFeature3Sagas),
      // ...Object.values(futureSagasWillGoHere),
    ].map(fork),
  );
}
`;
}

function generateStackList(moduleName) {
  const trimmedName = trimName(moduleName);

  return `import { createStackNavigator } from '@react-navigation/stack';

export type ${trimmedName}StackList = {
  ExampleScene1: { title: string };
  // example scenes with route params (replace these with your new module's screens!):
  ExampleScene2: {
    findCareSearchCategory?: string;
    shouldDisplay: boolean;
  };
  ExampleScene3: {
    providerId: string;
    city?: string;
    stateCode?: string;
    country?: string;
    zipCode?: string;
    searchLocation?: string;
    latitude?: string;
    longitude?: string;
    awayFromHomeIndicator?: boolean;
    dentalSelectedMemberId?: string;
    locationId?: string;
    categoryId?: string;
  };
};

export const ${trimName(
    moduleName,
  )}Stack = createStackNavigator<${trimmedName}StackList>();
`;
}

function generateNavigator(moduleName) {
  const trimmedName = trimName(moduleName);

  const stackNavigatorTitle = `${trimmedName}Stack.Navigator`;

  const stackScreenTitle = `${trimmedName}Stack.Screen`;

  return `import React from 'react';
import { ${trimmedName}Stack } from './${trimmedName}StackList';

const TestComponent = () => ({} as React.ReactElement);

export const ${trimName(moduleName)}Navigator = () => (
  <${stackNavigatorTitle} headerMode="screen">
    <${stackScreenTitle}
      name="ExampleScene1"
      component={TestComponent}
      options={{
        headerShown: false,
      }}
    />
    <${stackScreenTitle}
      name="ExampleScene2"
      component={TestComponent}
      options={{
        headerShown: false,
      }}
    />
    <${stackScreenTitle}
      name="ExampleScene3"
      component={TestComponent}
      options={{
        headerShown: false,
      }}
    />
  </${stackNavigatorTitle}>
);
`;
}
