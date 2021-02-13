/// <reference types='cypress' />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */

const { Builder,By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const chromeCapabilities = new chrome.Options();
const until = require('selenium-webdriver/lib/until');
require('chromedriver');

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  on('task', {
    validateTwitterIntegration: async({username, password}) =>{
      driver = new Builder()
        .setChromeOptions(chromeCapabilities)
        .forBrowser('chrome')
        .build();
      await driver.get('http://automationpractice.com/index.php?id_product=2&controller=product');

      await driver.wait(until.elementLocated(By.className('btn-twitter')),10000)
      .catch(() => {
        throw new Error('the twitter link is not visible');
      })
      //Store the ID of the original window
      const originalWindow = await driver.getWindowHandle();

      const twitterButton = driver.findElement(By.className('btn-twitter'));
      twitterButton.click()

      //Wait for the new window or tab
      await driver.wait(
        async () => (await driver.getAllWindowHandles()).length === 2,
        10000
      );

      //Loop through until we find a new window handle
      const windows = await driver.getAllWindowHandles();
      windows.forEach(async handle => {
      if (handle !== originalWindow) {
        await driver.switchTo().window(handle);
      }
      });

      //Assertion for the url
      await driver.wait(
        async () => (await driver.getCurrentUrl() === 'https://twitter.com/intent/tweet?text=Blouse%20http://automationpractice.com/index.php?id_product=2&controller=product',
        10000
      ))

      await driver.wait(until.elementLocated(By.name('session[username_or_email]'),10000))
      driver.findElement(By.name('session[username_or_email]')).sendKeys(username);
      driver.findElement(By.name('session[password]')).sendKeys(password);
      driver.findElement(By.xpath ('//*[contains(text(),"Log in")]')).click();
      // you can do more interaction after a successful login
      // e.g. submit a post on twitter.com
      return driver;
    }
  }),
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.name === 'chrome') {
      launchOptions.args.push('--disable-extensions')
      return launchOptions
    }
  })  
}
