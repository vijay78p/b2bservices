/* eslint-disable */
const _fs = require('fs');
const _pathModule = require('path');
const prettier = require('prettier');
const acorn = require('acorn');
const escodegen = require('escodegen');
const { styleQuestion } = require('./utils');

const _readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ANSI_RESET = '\x1b[0m';
const FGMAGENTA = '\x1b[35m';

console.log("Let's create a new file @alias");

// First Question - get new module name
const askName = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion('What name would you like to use for your new @alias?'),
      (name) => {
        if (!name) {
          console.log(ANSI_RESET + 'Please provide an @alias name.');
          process.exit(0);
        }

        const formattedAlias = formatAlias(name);

        resolve(formattedAlias);
      },
    );
  });

// Second Question
const askPath = () =>
  new Promise((resolve, reject) => {
    _readline.question(
      styleQuestion(
        'What is the relative path to the index.ts file of your alias? (relative to /src) ',
      ),
      (path) => {
        const aliasPath = path.startsWith('/src')
          ? path.trim()
          : formulatePath(path);

        resolve(aliasPath);
      },
    );
  });

// Main Process
const main = async () => {
  // Await all questions answered
  const aliasProperties = {
    name: await askName(),
    path: await askPath(),
  };

  console.log('aliasProperties.path: ', aliasProperties.path);

  const SHARED_ALIAS_PATH = `.${aliasProperties.path}`;

  const GATSBY_NODE_JS_ALIAS_PATH = _pathModule.join(
    '../',
    aliasProperties.path,
  );

  addAliasToTSConfig(aliasProperties.name, SHARED_ALIAS_PATH);
  addAliasToBabelConfig(aliasProperties.name, SHARED_ALIAS_PATH);
  addAliasToGatsbyNodeJS(aliasProperties.name, GATSBY_NODE_JS_ALIAS_PATH);

  console.log(
    ANSI_RESET,
    `Success 👨🏻‍💻, new alias created! => `,
    FGMAGENTA,
    `${aliasProperties.name}`,
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

function addAliasToTSConfig(aliasName, aliasPath) {
  const configJSON = getConfigFile('tsconfig.json');
  const paths = configJSON.compilerOptions.paths;

  paths[aliasName] = [aliasPath];

  configJSON.compilerOptions.paths = sortAliases(paths);

  _fs.writeFileSync(
    'tsconfig.json',
    prettier.format(JSON.stringify(configJSON, null, 2), {
      parser: 'json',
    }),
  );
}

function addAliasToBabelConfig(aliasName, aliasPath) {
  const babelConfig = require('../../babel.config');
  const alias = babelConfig.plugins[0][1].alias;
  alias[aliasName] = aliasPath;

  babelConfig.plugins[0][1].alias = sortAliases(alias);

  _fs.writeFileSync(
    'babel.config.js',
    prettier.format(
      'module.exports = ' + JSON.stringify(babelConfig, null, 2),
      {
        parser: 'babel',
      },
    ),
  );
}

function addAliasToGatsbyNodeJS(aliasName, aliasPath) {
  const gatsbyNodeJS = getConfigFile('gatsby-node.js');
  const comments = [];
  const tokens = [];
  const ast = acorn.parse(gatsbyNodeJS, {
    onComment: comments,
    ranges: true,
    onToken: tokens,
    ecmaVersion: 2020,
  });

  const dupProperties = JSON.parse(
    JSON.stringify(
      ast.body[1].expression.right.body.body[3].expression.arguments[0]
        .properties[0].value.properties[0].value.properties[0],
    ),
  );

  dupProperties.value.arguments[1].raw = `'${aliasPath}'`;
  dupProperties.value.arguments[1].value = `${aliasPath}`;
  dupProperties.key.raw = `'${aliasName}'`;
  dupProperties.key.value = `${aliasName}`;

  const aliasProperties =
    ast.body[1].expression.right.body.body[3].expression.arguments[0]
      .properties[0].value.properties[0].value.properties;

  aliasProperties.push(dupProperties);
  aliasProperties.sort((a, b) => (a.key.value > b.key.value ? 1 : -1));

  escodegen.attachComments(ast, comments, tokens);

  const updatedGatsbyNodeJSFile = escodegen.generate(ast, { comment: true });

  _fs.writeFileSync(
    'gatsby-node.js',
    prettier.format(updatedGatsbyNodeJSFile, {
      parser: 'babel',
    }),
  );
}

function getConfigFile(file) {
  const config = _fs.readFileSync(file, 'utf-8');

  return file.endsWith('json') ? JSON.parse(config) : config;
}

function sortAliases(aliasObj) {
  return Object.keys(aliasObj)
    .sort()
    .reduce((formattedPaths, currKey) => {
      formattedPaths[currKey] = aliasObj[currKey];
      return formattedPaths;
    }, {});
}

function formatAlias(aliasName) {
  const alias = aliasName.trim();
  return alias.startsWith('@') ? alias : `@${alias}`;
}

function formulatePath(path) {
  if (path.startsWith('src')) {
    return `/${path.trim()}`;
  }
  return `/src/${path.replace('/', '')}`;
}
