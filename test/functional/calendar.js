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

  // As a Doctor viewing my calendar ...
  before(function(done) {
    this.browser.visit('/calendar?userType=d&userId=4', done);
  });


  // ... I will book an appointment:

    // Happy Path:
      // TODO


    // Sad Path:
      // TODO


  // Shutdown the server once complete
  after(function(done) {
    this.server.close(done);
  });

});