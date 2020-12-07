process.env.NODE_ENV = 'test';

var app = require('../../server');
var http = require('http');
var assert = require('assert');

// use zombie.js as headless browser
var Browser = require('zombie');

describe('calendar page', function() {
  before(function() {
    this.server = http.createServer(app).listen(3001);
    // initialize the browser using the same port as the test application
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });

  // // load calendar for doctorID 1
  // before(function(done) {
  //   this.browser.visit('/calendar?userType=d&userId=1', done);
  // });
  //
  // // Tests are below...
  //
  //
  //
  // // Shutdown the server once complete
  after(function(done) {
    this.server.close(done);
  });

});