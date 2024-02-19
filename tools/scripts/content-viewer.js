/* eslint-disable */
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const util = require('util');
const request = require('request');

app.use(bodyParser.json());

const get = util.promisify(request.get);

const CDN_URL = 'https://a.static.cigna.com/';
// Handle HTTP OPTIONS requests
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With',
  );

  if (req.method === 'OPTIONS') res.sendStatus(200);
  else next();
});

app.get('/', (req, res) => {
  get({
    url: `${CDN_URL}content/mobile-mycigna/manifest.json`,
    json: true,
  }).then(({ statusCode, body }) => {
    if (statusCode !== 200) {
      res.status(statusCode).send('Error');
      return;
    }

    const bundles = {
      findCare: body.public['en-us']['findcare_mobile'],
      taxonomyMessages: body.public['en-us']['fc_taxonomy_messages'],
      directory: body.public['en-us']['fc_directory'],
    };

    const rs = Object.keys(bundles).map((bundle) =>
      get({
        url: CDN_URL + bundles[bundle],
        json: true,
      }).then(({ statusCode, body }) => [CDN_URL + bundles[bundle], body]),
    );

    Promise.all(rs).then((tr) => {
      res.status(200).send(
        `<pre>${JSON.stringify(
          tr.map(([k, o]) => ({ [k]: o })),
          null,
          4,
        )}</pre>`,
      );
    });
  });
});

function walkObj(obj, res = {}, path = []) {
  if (!obj) {
    return res;
  }

  if (Array.isArray(obj)) {
    obj.forEach((iobj, i) => walkObj(iobj, res, [...path, `${i}`]));
    return res;
  }

  if (typeof obj === 'object') {
    Object.keys(obj)
      .filter((k) => !k.endsWith('.json'))
      .forEach((k) => walkObj(obj[k], res, [...path, k]));

    return res;
  }

  if (path.length) {
    res[path.join('.')] = obj;
  }

  return res;
}

app.listen(9005, () =>
  console.log(
    'Navigate to localhost:9005 to view Find Care content bundles 🏁 🏁 🏁',
  ),
);
