const fs = require('fs')
const pack = require('../package.json')

// update installation.md
const installation = fs
  .readFileSync('./gitbook/installation.md', 'utf-8')
  .replace(
    /https:\/\/unpkg\.com\/vue2-storage@[\d.]+.[\d]+\/dist\/vue2-storage\.js/,
    'https://unpkg.com/vue2-storage@' + pack.version + '/dist/vue2-storage.js.'
  )
fs.writeFileSync('./gitbook/installation.md', installation)
