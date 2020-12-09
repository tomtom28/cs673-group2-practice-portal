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
    this.browser.visit('/televisit?appointmentId=3&doctorId=1', done);
  });


  // Upload Billing Codes:

    // Happy Path:

      // ... When I submit my billing codes using the (blue) submit button ...
      it('should have a blue submit button for Billing Codes', function() {
        assert.ok(this.browser.success);
        browser.fill('#BillingCode-List', "F01, F02, F03");
        browser.document.forms[1].submit();

      })



      // ... I will know the submission was successful if the button turns grey


    // Sad Path:

      // ... If I accidently submit no billing codes ...


      // ... I will be alerted to double check my inputs





  // Shutdown the server once complete
  after(function(done) {
    this.server.close(done);
  });

});