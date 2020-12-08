// Express and Body Parser
const express = require('express');
const bodyParser = require("body-parser");

// For External API Calls
const axios = require('axios').default;

const app = express();
const port = process.env.PORT || 3000; // Select either local port or Heroku default


// UI Helper API Endpoint & Constants
const UI_HELPER_API = "https://ui-helper.herokuapp.com";
const TELE_SERVICE_API = "https://televisit-service.herokuapp.com";
const APPT_SERVICE_API = "https://sdpm-appointment-service.herokuapp.com";
const CANCELLED_APT_CODE = 3;


// Use Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));


// set the view engine to ejs
app.set('view engine', 'ejs');

// server static assets (ex css, js, vendor)
app.use(express.static('public'));

// Render Pages ...

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// calendar page
app.get('/calendar', function(req, res) {
    res.render('pages/calendar');
});

// televisit page
app.get('/televisit', function(req, res) {
    res.render('pages/televisit');
});


// Helper Endpoints ...

// API endpoint to get Doctor Name
app.get('/doctorname', function(req, res) {

  let doctorId = req.query.doctorId;
  let doctorName = "Undefined";

  axios.get(UI_HELPER_API + '/all_doctors', {
    params: {}
  })
  .then(function (response) {
    let doctorList = response.data;
    for (let i=0; i<doctorList.length; i++) {
      if (doctorList[i].id == doctorId) {
        doctorName = doctorList[i].name;
        break;
      }
    }
  })
  .then(function() {
    res.json({doctorName: doctorName})
  });

});

// API endpoint to get Doctor Name
app.get('/patientInfo', function(req, res) {

  let patientId = req.query.patientId;
  let patientName = "Undefined";

  axios.get(UI_HELPER_API + '/single_patient_info', {
    params: {
      patient_id : patientId
    }
  })
  .then(function (response) {
    patientName = response.data.patient_first_name + " " + response.data.patient_last_name;
    res.json(response.data)
  })
  .then(function (error) {
    console.log(error);
    res.status(500).send(error);
  });

});

// API endpoint to return unbooked open slots
// (i.e. remove grey tiles that collide with blue)
app.get('/unbooked', function(req, res) {

  // First, Call UI Helper API for Booked Slots
  let unbookedSlots = []; // open slots, minus booked overlap
  let bookedSlots = [];
  axios.get(UI_HELPER_API + '/get_all_appoitments', {
    params: {
      "id" : req.query.doctorId,
    }
  })
  .then(function (response) {
    // Iterate over all booked slots & track their start and endDateTimes
    const resData = response.data;
    for (let i=0; i<resData.length; i++) {

      // Only append non-cancelled appoitments
      if (resData[i].appointment_status != CANCELLED_APT_CODE) {
        // Parse for Dates / Times
        let startDateTime = new Date(resData[i].start_time);
        let endDateTime = new Date(resData[i].end_time);
        let bookedSlot = {
          startDate: FormatDate(startDateTime),
          endDate: FormatDate(endDateTime),
          startTime: FormatTime(startDateTime),
          endTime: FormatTime(endDateTime)
        };
        bookedSlots.push(bookedSlot);
      }
    }
  })
  .catch(function (error) {
    console.log(error);
    // res.status(500).send('Error calling API!');
  })
  .then(function () {
    // Second, Call UI Helper API for Open Slots
    axios.get(UI_HELPER_API + '/open', {
      params: {
        "doctorId" : req.query.doctorId,
        "StartDate" : req.query.startYear + '/' + req.query.startMonth + "/" + req.query.startDay,
        "EndDate" : req.query.endYear + '/' + req.query.endMonth + '/' + req.query.endDay
      }
    })
    .then(function (response) {
      // console.log(response.data)

      // Iterate over all open slots & remove any overlap
      const resData2 = response.data;
      for (let i=0; i<resData2.length; i++) {
        let dateArray = []
        for (let j=0; j<resData2[i].length; j++) {
          // Check for overlap
          let hasOverlap = false;
          for (let k=0; k<bookedSlots.length; k++) {
            if (
              bookedSlots[k].startDate == resData2[i][j].startDate &&
              bookedSlots[k].endDate == resData2[i][j].endDate &&
              bookedSlots[k].startTime == resData2[i][j].startTime &&
              bookedSlots[k].endTime == resData2[i][j].endTime
            ) {
              hasOverlap = true;
            }
          }
          // Only add the timeslot if there is not overlap
          if (!hasOverlap) {
            dateArray.push(resData2[i][j]);
          }
        }
        // Only add the date array if there is at least 1 open slot
        if (dateArray.length > 0) unbookedSlots.push(dateArray);
      }
    })
    .catch(function (error) {
      console.log(error);
      res.status(500).send('Error calling API!');
    })
    .then(function () {
      // Finally, return results
      res.json(unbookedSlots);
    })
  })

});


// ------------ Proxy Endpoints for CORS issues ------------
  app.get("/doctors", function(req, res) {
    // Query UI helper
    axios.get(UI_HELPER_API + '/all_doctors', {})
    .then(function (response) {
      res.json(response.data);
    })
    .catch(function (error) {
      console.log("Error calling UI Helper!");
      console.log(error);
      res.status(500).send('Error calling API!');
    })
  });

app.get("/patients", function(req, res) {
  // Query UI helper
  axios.get(UI_HELPER_API + '/all_patients', {})
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log("Error calling UI Helper!");
    console.log(error);
    res.status(500).send('Error calling API!');
  })
});

app.post("/open", function(req, res) {
  // Query UI helper
  axios.post(UI_HELPER_API + '/create_appoitment', {
    "patient_id" : req.body.patientId,
    "doctor_id" : req.body.doctorId,
    "start_time" : req.body.startDateTime,
    "end_time" : req.body.endDateTime,
    "tele_visit" : req.body.isTeleVisit
  })
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log("Error calling UI Helper!");
    console.log(error);
    res.status(500).send('Error calling API!');
  })
});

// (i.e. remove grey tiles that collide with blue)
app.get('/booked', function(req, res) {
  let bookedSlots = [];
  // Query UI helper
  axios.get(UI_HELPER_API + '/get_all_appoitments', {
    params: {
      "id" : req.query.doctorId,
    }
  })
  .then(function (response) {
    // Iterate over all booked slots & track their start and endDateTimes
    const resData = response.data;
    for (let i=0; i<resData.length; i++) {
      // Only append non-cancelled appoitments
      if (resData[i].appointment_status != CANCELLED_APT_CODE) {

        // Parse for Dates / Times
        let startDateTime = new Date(resData[i].start_time);
        let endDateTime = new Date(resData[i].end_time);
        let bookedSlot = {
          id: resData[i].appointment_id,
          title: "Patient " + resData[i].patient_id, // todo
          startDate: FormatDate(startDateTime),
          endDate: FormatDate(endDateTime),
          startTime: FormatTime(startDateTime),
          endTime: FormatTime(endDateTime),
          doctorId: resData[i].doctor_id,
          patientId: resData[i].patient_id,
          isTeleVisit: true //resData[i].isTeleVisit // todo
        };
        bookedSlots.push(bookedSlot);
      }
    }
    res.json(bookedSlots);
  })
  .catch(function (error) {
    console.log("Unable to parse booked appointments!")
    console.log(error);
    res.status(500).send('Error calling API!');
  })
});


app.post('/booked', function (req, res) {
  // Post to UI helper
  axios.delete(UI_HELPER_API + '/cancel_appoitment', {
    data : {
      appointment_id : req.body.appointmentId,
      doctor_id: req.body.cancelledById
    }
  })
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log("Error calling UI Helper!");
    console.log(error);
    res.status(500).send('Error calling API!');
  })
});


app.get('/session', function (req, res) {
  // Post to UI helper
  axios.get(TELE_SERVICE_API + '/televisit/' + req.query.appointmentId, {})
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log("Error calling UI Helper!");
    console.log(error);
    res.status(500).send('Error calling API!');
  })
});

app.get('/appointment', function(req, res) {
  // Post to UI helper
  axios.get(UI_HELPER_API + '/get_appoitment', {
    params : {
      id : req.query.appointmentId,
    }
  })
  .then(function (response) {
    res.json(response.data);
  })
  .catch(function (error) {
    console.log("Error calling UI Helper!");
    console.log(error);
    res.status(500).send('Error calling API!');
  })
});

app.post('/chart-notes', function (req, res) {
  console.log("HIT IT HERE")
  console.log(req.form)
  // Post to UI helper
  axios.post(APPT_SERVICE_API + '/appointment/' + req.query.appointmentId + "/charts", {
    "form-data" :  req.body.formData
  })
  .then(function (response) {
    // console.log(response)
    res.json(response.data);
  })
  .catch( function (error) {
    console.log("Error calling API Service!");
    console.log(error);
    res.status(500).send(error);
  })
});


app.post('/consultation-summary', function (req, res) {
  // Post to UI helper
  axios.post(APPT_SERVICE_API + '/appointment/' + req.query.appointmentId + "/consultation_summary", {
    "form-data" :  req.body.formData
  })
  .then(function (response) {
    console.log(response)
    res.json(response.data);
  })
  .catch( function (error) {
    console.log("Error calling API Service!");
    console.log(error);
    res.status(500).send(error);
  })
});


app.post('/billing-codes', function (req, res) {
  // Post to UI helper
  axios.post(UI_HELPER_API + "/post_billing_codes", {
    id : req.body.appointmentId,
    billing_codes: req.body.billingCodes
  })
  .then(function (response) {
    console.log(response)
    res.json(response.data);
  })
  .catch( function (error) {
    console.log("Error calling API Service!");
    console.log(error);
    res.status(500).send(error);
  })
})


// ------------                               ------------


// CATCH ALL ROUTE
app.get('*', function(req, res) {
  res.send("Invalid Page, redirect to Login Page for Practice Portal")
});

app.listen(port, () => {
  console.log(`Example app listening on port:${port}`);
});


// Helper Method: Format Date Time (YYYY-DD-MM)
function FormatDate(dateTimeObject) {
  // Add 0's in front of single digits
  let month = (dateTimeObject.getUTCMonth() + 1);
  if (month < 10) {
    month = "0" + month;
  }
  let day = dateTimeObject.getUTCDate();
  if (day < 10) {
    day = "0" + day;
  }
  // Format as YYYY-DD-MMTHH:mm
  let date = dateTimeObject.getUTCFullYear() + "-" + month + "-" + day;
  return date;
}

// Helper Method: Format  Time (HH:mm)
function FormatTime(dateTimeObject) {
  let minutes = dateTimeObject.getUTCMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let hours = dateTimeObject.getUTCHours();
  if (hours < 10) {
    hours = "0" + hours;
  }
  // Format as HH:mm
  let time = hours + ":" + minutes;
  return time;
}