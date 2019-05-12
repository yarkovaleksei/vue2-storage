const fs = require('fs');
const pack = require('../package.json');

const book = fs
  .readFileSync('./gitbook/book.json', 'utf-8')
  .replace(/"packageName": "[^"]+"/, `"packageName": "${pack.name}"`)
  .replace(/"packageVersion": "[^"]+"/, `"packageVersion": "${pack.version}"`);

fs.writeFileSync('./gitbook/book.json', book);
