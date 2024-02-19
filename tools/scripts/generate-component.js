/* eslint-disable */
const _fs = require('fs');
const _pathModule = require('path');
const { generateComponentTemplate, styleQuestion } = require('./utils');

const _readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ANSI_RESET = '\x1b[0m';
const FGMAGENTA = '\x1b[35m';

console.log("Let's create a component!");

// First Question
const askName = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion('What name would you like to use for the component?'),
      (name) => {
        if (!name) {
          console.log(ANSI_RESET + 'Please provide a component name.');
          process.exit(0);
        }

        const trimmedName =
          name.trim().slice(0, 1).toUpperCase() + name.slice(1).trim();
        resolve(trimmedName);
      },
    );
  });

// Second Question
const askPath = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion(
        'Where should the component folder be created? (relative to /src) ',
      ),
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
  const componentProperties = {
    name: await askName(),
    path: await askPath(),
  };

  // Path to component's folder
  const FOLDER_PATH = _pathModule.join(
    'src',
    componentProperties.path,
    componentProperties.name,
  );

  // Create folders synchronously
  _fs.mkdirSync(FOLDER_PATH, { recursive: true });

  // Component file's relative path
  const COMPONENT_PATH = _pathModule.join(
    FOLDER_PATH,
    `${componentProperties.name}.tsx`,
  );

  const INDEX_FILE_PATH = _pathModule.join(FOLDER_PATH, 'index.ts');

  const componentFileContent = generateComponentTemplate(componentProperties);
  const indexFileContent = indexTemplate(componentProperties.name);

  _fs.writeFileSync(COMPONENT_PATH, componentFileContent);
  _fs.writeFileSync(INDEX_FILE_PATH, indexFileContent);

  if (process.argv.includes('--scenes')) {
    _fs.mkdirSync(_pathModule.join(FOLDER_PATH, 'scenes'));
  }

  console.log(
    ANSI_RESET,
    'Success 👨🏻‍💻, component built! => ',
    FGMAGENTA,
    `${COMPONENT_PATH}`,
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

function indexTemplate(name) {
  return `import ${name} from './${name}';

export default ${name};
`;
}
