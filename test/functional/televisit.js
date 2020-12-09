process.env.NODE_ENV = 'test';

var app = require('../../server');
var http = require('http');
var assert = require('assert');

// use zombie.js as headless browser
var Browser = require('zombie');

describe('doctor televisit', function() {
  before(function() {
    this.server = http.createServer(app).listen(3001);
    // initialize the browser using the same port as the test application
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });

  // As a Doctor hosting my TeleVisit Session ...
  before(function(done) {
    this.browser.visit('/televisit?appointmentId=55&doctorId=4', done);
  })

  // ... I will Upload Billing Codes ...

    // Sad Path:
      // ... I will see a (blue) submit button for Billing Codes ...
      it('should have a blue submit button for Billing Codes', function() {
        assert.ok(this.browser.success);
        browser.assert.className('#BillingCode-Submit', 'btn-primary');
      })
      // ... And I will add my billing codes to the form & submit ...
      it('should alert me of an invalid input', function() {
        // ... If I accidently submit no billing codes ...
        browser.pressButton('#BillingCode-Submit').then(function() {
          // ... I will be alerted to double check my inputs ...
          assert.equal(browser.Window.alert.text(), 'Please add a list of billing codes!')
          // ... And the button will remain unchanged.
          browser.assert.className('#BillingCode-Submit', 'btn-primary');
        })
      })

    // Happy Path:
      // ... I will see a (blue) submit button for Billing Codes ...
      it('should have a blue submit button for Billing Codes', function() {
        assert.ok(this.browser.success);
        browser.assert.className('#BillingCode-Submit', 'btn-primary');
      })
      // ... And I will add my billing codes to the form & submit ...
      it('should allow me to submit billing codes', function() {
        browser.fill('#BillingCode-List', "F01, F02, F03");
        // ... When I submit my billing codes, I will know the submission was successful if the button turns grey.
        browser.pressButton('#BillingCode-Submit').then(function() {
          browser.assert.className('#BillingCode-Submit', 'btn-secondary');
        })
      })

  // Shutdown the server once complete
  after(function(done) {
    this.server.close(done);
  });

});