describe("open two different super domains in different cases are fine", function () {
  it("first, open google.com", function () {
    cy.visit('https://www.google.com')
  });

  it("then open another super domain is fine", function () {
    cy.visit('http://automationpractice.com/index.php')
  });
})

describe('you can use a cypress task to use selenium to manipulate multi browser windows', function () {
  it("a suggested method by Cypress official. Use selenium/puppeteer/protractor to manipulate multi browser windows", function () {
    cy.task("validateTwitterIntegration", {username: Cypress.env('twitter_user_name'), password: Cypress.env('twitter_password')}).then(()=> {
      cy.log('job done by Selenium Driver')
    });
  });
})

describe("you can still open a new window but you lose control for the new window by native Cypress", function () {
  it("open two browsers by Cypress but not easy to control the new browser instance", function () {
    cy.visit('http://automationpractice.com/index.php?id_product=2&controller=product')
    cy.contains('Tweet').click()
    // you can't access the new window which is opened by clicking Tweet button
  });
})

describe("access two super domain in single test case", function () {  
  it("A FAILURE CASE: open two different super domain in one test case is not working", function () {
    cy.visit('https://www.google.com')
    cy.visit('http://automationpractice.com/index.php')
  })
})
