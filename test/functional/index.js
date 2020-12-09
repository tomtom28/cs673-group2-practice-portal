process.env.NODE_ENV = 'test';

var app = require('../../server');
var http = require('http');
var assert = require('assert');

// use zombie.js as headless browser
var Browser = require('zombie');

describe('home page', function() {
  before(function() {
    this.server = http.createServer(app).listen(3001);
    // initialize the browser using the same port as the test application
    this.browser = new Browser({ site: 'http://localhost:3000' });
  });

  // load the home page
  before(function(done) {
    this.browser.visit('/', done);
  });

  // Tests are below...

  it('should be labeled as the practice portal', function() {
    assert.ok(this.browser.success);
    assert.equal(this.browser.text('h1'), 'Practice Portal');
  });

  it('should allow the user to toggle between Doctor or Receptionist Views', function() {
    assert.ok(this.browser.success);
    assert.equal(this.browser.text('a.btn-primary'), 'Receptionist View');
    assert.equal(this.browser.text('a.btn-secondary'), 'Doctor View');
  });


  // Shutdown the server once complete
  after(function(done) {
    this.server.close(done);
  });

});