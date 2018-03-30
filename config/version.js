const fs = require('fs')
const pack = require('../package.json')

// update installation.md
const langs = ['ru', 'en']
langs.forEach((lang) => {
  const installation = fs
    .readFileSync(`./gitbook/${lang}/installation.md`, 'utf-8')
    .replace(
      /https:\/\/unpkg\.com\/vue2-storage@[\d.]+.[\d]+.[\d]+\/dist\/vue2-storage\.js/,
      'https://unpkg.com/vue2-storage@' + pack.version + '/dist/vue2-storage.js.'
    )

  fs.writeFileSync(`./gitbook/${lang}/installation.md`, installation)
})
