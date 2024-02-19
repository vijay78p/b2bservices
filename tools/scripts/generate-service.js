/* eslint-disable */
const _fs = require('fs');
const _pathModule = require('path');
const {
  generateActions,
  generateAPI,
  generateModel,
  generateReducer,
  generateSagas,
  styleQuestion,
  trimName,
} = require('./utils');

const _readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ANSI_RESET = '\x1b[0m';
const FGMAGENTA = '\x1b[35m';

console.log("Let's create a new Redux service!");

// First Question - get new module name
const askName = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion('What name would you like to use for your new service?'),
      (name) => {
        if (!name) {
          console.log(ANSI_RESET + 'Please provide a service name.');
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
      styleQuestion('Where should the service be created? (relative to /src) '),
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
  const serviceProperties = {
    name: await askName(),
    path: await askPath(),
  };

  // Path to module's folder
  const FOLDER_PATH = _pathModule.join(
    'src',
    serviceProperties.path,
    'services',
  );

  // Create folders synchronously
  _fs.mkdirSync(FOLDER_PATH, { recursive: true });

  const newServiceFiles = [
    {
      filePath: _pathModule.join(FOLDER_PATH, 'actions.ts'),
      fileContent: generateActions(serviceProperties.name),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'api.ts'),
      fileContent: generateAPI(serviceProperties.name, serviceProperties.path),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'models.ts'),
      fileContent: generateModel(serviceProperties.name),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'reducer.ts'),
      fileContent: generateReducer(serviceProperties.name),
    },
    {
      filePath: _pathModule.join(FOLDER_PATH, 'sagas.ts'),
      fileContent: generateSagas(serviceProperties.name),
    },
  ];

  // generate all new service's files
  newServiceFiles.forEach((file) =>
    _fs.writeFileSync(file.filePath, file.fileContent),
  );

  console.log(
    ANSI_RESET,
    `Success 🦅 🌎 => ${serviceProperties.name} module built! => `,
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
