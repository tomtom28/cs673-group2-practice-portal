# CS673 - Group 2 - Practice Portal
This is the "Practice Portal" micro-service used for Appointment Scheduling and Tele-Visits for
employees of a medical practice (i.e. Doctors or Receptionists).

The project implements the GUI and proxy server for the front-end application (by Thomas Thompson).

The code is deployed on Heroku at the following location:
https://group2-practice-portal.herokuapp.com/


#### External Dependencies
This project requires the supporting APIs provided in the main project repository located at:
https://github.com/vishnudivakar31/Appointment-Scheduling-and-Tele-visit

Supporting APIs include:
  - UI Helper API (by Akul)
  - Appointment Service API (by Vishnu)
  - Televisit API (by Vishnu)


#### User Manual
A copy of the User Manual can be found [here](https://docs.google.com/document/d/1VSUk8jVyzqQLvVIW0Svl_EZTsbg36wzE45ejL-heb6s/edit?usp=sharing).

Please refer to the "Practice Portal" section of the manual.


#### Repo Setup
Ensure you have NodeJS installed:
  - Download [NodeJS](https://nodejs.org/en/) if needed.
Within the command line, perform the following actions:
  - Run `npm install` to download dependencies
  - Run `node server.js`
  - Open up to [localhost:3000](http://localhost:3000/) in your browser to see the webapp in action.


#### Testing
Basic funcitional tests are found in the `/test` folder.
 - Run `mocha` in the main project folder `/` for a test report
 - Note that `/test/televisit.js` test may need to be re-done using Selenium.