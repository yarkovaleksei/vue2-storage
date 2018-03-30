module.exports = {
  view: function (browser) {
    browser
      .url('http://localhost:8080/examples/')
      .waitForElementVisible('.container', 1000)
      .assert.containsText('header', 'vue2-storage example', 'Item <header> found!')
      .end()
  }
}
