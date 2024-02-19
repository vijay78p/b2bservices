/* eslint-disable */
const _fs = require('fs');
const _pathModule = require('path');
const {
  generateActions,
  generateAPI,
  generateModel,
  generateReducer,
  generateSagas,
  generateComponentTemplate,
  styleQuestion,
  trimName,
} = require('./utils');

const _readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ANSI_RESET = '\x1b[0m';
const FGMAGENTA = '\x1b[35m';

console.log("Let's create a new React Native scene!");

// First Question - get new module name
const askName = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion('What name would you like to use for your new scene?'),
      (name) => {
        if (!name) {
          console.log(ANSI_RESET + 'Please provide a scene name.');
          process.exit(0);
        }

        const trimmedName = trimName(name);

        resolve(trimmedName);
      },
    );
  });

// Second Question - get relative path
const askPath = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion('Where should the scene be created? (relative to /src) '),
      (path) => {
        const filePath =
          path.startsWith('src') || path.startsWith('/src')
            ? path.replace('src', '').trim()
            : path.trim();
        resolve(filePath);
      },
    );
  });

// Main Process
const main = async () => {
  // Await all questions answered
  const sceneProperties = {
    name: await askName(),
    path: await askPath(),
  };

  // Path to scene's folder
  const FOLDER_PATH = _pathModule.join(
    'src',
    sceneProperties.path,
    sceneProperties.name,
  );

  // Create folders synchronously
  _fs.mkdirSync(FOLDER_PATH, { recursive: true });

  const newSceneDirectories = ['components', 'services', 'utils'];

  // generate all new scene's directories
  newSceneDirectories.forEach((dir) => {
    const DIR_PATH = `${FOLDER_PATH}/${dir}`;
    _fs.mkdirSync(DIR_PATH, { recursive: true });
  });

  const newSceneFiles = [
    {
      filePath: _pathModule.join(FOLDER_PATH, 'services', 'actions.ts'),
      fileContent: generateActions(sceneProperties.name),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'services', 'api.ts'),
      fileContent: generateAPI(sceneProperties.name, sceneProperties.path),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'services', 'models.ts'),
      fileContent: generateModel(sceneProperties.name),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'services', 'reducer.ts'),
      fileContent: generateReducer(sceneProperties.name),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'services', 'sagas.ts'),
      fileContent: generateSagas(sceneProperties.name),
    },
  ];

  // generate all new scene's files
  newSceneFiles.forEach((file) =>
    _fs.writeFileSync(file.filePath, file.fileContent),
  );

  const componentFileContent = generateComponentTemplate(sceneProperties);

  _fs.writeFileSync(
    `${FOLDER_PATH}/${sceneProperties.name}.tsx`,
    componentFileContent,
  );

  console.log(
    ANSI_RESET,
    `Success 🦅 🌎 => ${sceneProperties.name} scene created! => `,
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
