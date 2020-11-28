// Express and Body Parser
const express = require('express');
const bodyParser = require("body-parser");

// For External API Calls
const axios = require('axios').default;

const app = express();
const port = process.env.PORT || 3000; // Select either local port or Heroku default


// UI Helper API Endpoint
// const UI_HELPER_API = "http://localhost:3000";
const UI_HELPER_API = "https://group2-practice-portal.herokuapp.com";


// Use Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));

// Fix CORS issue
// https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
// app.use(function (req, res, next) {
//
//   console.log("hit")
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'https://group2-practice-portal.herokuapp.com');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });

// set the view engine to ejs
app.set('view engine', 'ejs');

// server static assets (ex css, js, vendor)
app.use(express.static('public'));

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

// API endpoint to get Doctor Name
app.get('/doctorname', function(req, res) {

  let doctorId = req.query.doctorId;
  let doctorName = "Undefined";

  axios.get(UI_HELPER_API + '/doctors', {
    params: {}
  })
  .then(function (response) {
    let doctorList = response.data;
    for (let i=0; i<doctorList.length; i++) {
      if (doctorList[i].doctorId == doctorId) {
        doctorName = doctorList[i].doctorName;
        break;
      }
    }
  })
  .then(function() {
    res.json({doctorName: doctorName})
  })

});

// API endpoint to return unbooked open slots
// (i.e. remove grey tiles that collide with blue)
app.get('/unbooked', function(req, res) {

  // First, Call UI Helper API for Booked Slots
  let unbookedSlots = []; // open slots, minus booked overlap
  let bookedSlots = [];
  axios.get(UI_HELPER_API + '/booked', {
    params: req.query
  })
  .then(function (response) {
    // Iterate over all booked slots & track their start and endDateTimes
    const resData = response.data;
    for (var i=0; i<resData.length; i++) {
      for (var j=0; j<resData[i].length; j++) {
        var bookedSlot = {
          startDate: resData[i][j].startDate,
          endDate: resData[i][j].endDate,
          startTime: resData[i][j].startTime,
          endTime: resData[i][j].endTime
        };
        bookedSlots.push(bookedSlot);
      }
    }
  })
  .catch(function (error) {
    console.log("Unable to parse booked appointments!")
    console.log(error);
  })
  .then(function () {
    // Second, Call UI Helper API for Open Slots
    axios.get(UI_HELPER_API + '/open', {
      params: req.query
    })
    .then(function (response) {
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
      console.log("Unable to parse booked appointments!")
      console.log(error);
    })
    .then(function () {
      // Finally, return results
      res.json(unbookedSlots);
    })
  })

});




// ------------ Mock API Endpoint for Testing ------------

// Get all Doctors
app.get('/doctors', function(req, res) {
  let sampleDoctors = [
    {
      "doctorId" : 1,
      "doctorName" : "Jasani, Shruti"
    },
    {
      "doctorId" : 2,
      "doctorName" : "Price, Phil"
    }
  ];
  res.json(sampleDoctors);
});


// Get all patients
app.get('/patients', function(req, res) {
  let samplePatients = [
    {
      "id" : 1,
      "name" : "Monster, Cookie"
    },
    {
      "id" : 201,
      "name" : "Archer, Sterling"
    },
    {
      "id" : 301,
      "name" : "Brown, John"
    },
    {
      "id" : 501,
      "name" : "Jones, Mike"
    },
    {
      "id" : 921,
      "name" : "Wayne, Bruce"
    }
  ]

  res.json(samplePatients);
});

// TeleVisit: Get Patient Info
app.get("/patient-by-apt-id", function(req, res) {
  res.json({patientName : "Demo, Johnny"});
})


// TeleVisit: Video Creation
app.post("/televisit", function(req, res) {
  console.log(req.body);

  var sampleAuthTokens = {
    apiKey : "46950324",
    sessionId : "2_MX40Njk1MDMyNH5-MTYwNDg5Mzg5MzAwMH5wdndpN0pxSWZWaVNFQitab3NUa3lmU1B-UH4",
    token : "T1==cGFydG5lcl9pZD00Njk1MDMyNCZzaWc9ZWUzODBmYjdkMDIxOGY4OWE5YTJiOTRiMDg2MDVlYWFiMDEzZDY0Nzpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5qazFNRE15Tkg1LU1UWXdORGc1TXpnNU16QXdNSDV3ZG5kcE4wcHhTV1pXYVZORlFpdGFiM05VYTNsbVUxQi1VSDQmY3JlYXRlX3RpbWU9MTYwNDg5Mzg5MyZub25jZT0wLjExNjg0NTkyNDQ2NTg4MTgyJmV4cGlyZV90aW1lPTE2MDc0ODU4OTM=",
  }

  res.json(sampleAuthTokens)
});

// TeleVisit: Consultation Summary Upload
app.post("/consultation-summary", function(req, res) {
  console.log(req.body);
  res.json({});
});


// TeleVisit: Consultation File Upload
app.post("/chart-notes", function(req, res) {
  console.log(req.query);
  console.log(req.formData);
  res.json({});
});


// Get all OPEN appointments in a date range
app.get('/open', function(req, res) {

  let doctorId = Number(req.query.doctorId);
  let startMonth = Number(req.query.startMonth);
  let endMonth = Number(req.query.endMonth);
  let startDate = Number(req.query.startDate);
  let endDate = Number(req.query.endDate);

  let sampleOpenSlotsDoctor1 = [
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + startDate,
        "endDate" : "2020-" + startMonth + "-" + startDate,
        "startTime" : "09:00",
        "endTime" : "09:30",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + startDate,
        "endDate" : "2020-" + startMonth + "-" + startDate,
        "startTime" : "10:00",
        "endTime" : "10:30",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + startDate,
        "endDate" : "2020-" + startMonth + "-" + startDate,
        "startTime" : "11:00",
        "endTime" : "12:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + startDate,
        "endDate" : "2020-" + startMonth + "-" + startDate,
        "startTime" : "14:00",
        "endTime" : "15:00",
      }
    ],
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "startTime" : "09:30",
        "endTime" : "10:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "startTime" : "10:30",
        "endTime" : "11:30",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "startTime" : "12:00",
        "endTime" : "13:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 1),
        "startTime" : "14:30",
        "endTime" : "15:00",
      }
    ],
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "startTime" : "09:00",
        "endTime" : "09:30",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "startTime" : "10:00",
        "endTime" : "10:30",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "startTime" : "11:00",
        "endTime" : "12:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "startTime" : "14:00",
        "endTime" : "15:00",
      }
    ],
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "09:30",
        "endTime" : "10:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "10:30",
        "endTime" : "11:30",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "12:00",
        "endTime" : "13:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "14:30",
        "endTime" : "15:00",
      }
    ],
  ];


  let sampleOpenSlotsDoctor2 = [
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + startDate,
        "endDate" : "2020-" + startMonth + "-" + startDate,
        "startTime" : "09:00",
        "endTime" : "10:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + startDate,
        "endDate" : "2020-" + startMonth + "-" + startDate,
        "startTime" : "13:00",
        "endTime" : "14:00",
      }
    ],
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (startDate + 1),
        "endDate" : "2020-" + endMonth + "-" + (startDate + 1),
        "startTime" : "12:00",
        "endTime" : "13:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (startDate + 1),
        "endDate" : "2020-" + endMonth + "-" + (startDate + 1),
        "startTime" : "14:00",
        "endTime" : "15:00",
      }
    ],
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "startTime" : "14:00",
        "endTime" : "15:00"
      }
    ],
    [
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "11:00",
        "endTime" : "12:00",
      },
      {
        "title" : "Available",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "13:30",
        "endTime" : "14:00",
      }
    ]
  ];

  if (doctorId == 1) {
    res.json(sampleOpenSlotsDoctor1);
  }
  else {
    res.json(sampleOpenSlotsDoctor2);
  }
});


// Get all BOOKED appointments in a date range
app.get('/booked', function(req, res) {

  let doctorId = Number(req.query.doctorId);
  let startMonth = Number(req.query.startMonth);
  let endMonth = Number(req.query.endMonth);
  let startDate = Number(req.query.startDate);
  let endDate = Number(req.query.endDate);


  let sampleBookedSlotsDoctor1 = [
    [
      {
        "id" : 101,
        "title" : "Patient, Name", // Patient Name
        "startDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "startTime" : "11:30",
        "endTime" : "12:00",
        "doctorId" : 1,
        "patientId" : 501,
        "isTeleVisit" : false
      },
      {
        "id" : 102,
        "title" : "Smith, John",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "startTime" : "14:00",
        "endTime" : "15:00",
        "doctorId" : 1,
        "patientId" : 502,
        "isTeleVisit" : true
      }
    ],
    [
      {
        "id" : 103,
        "title" : "Sigh, Andre",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 3),
        "startTime" : "15:00",
        "endTime" : "15:30",
        "doctorId" : 1,
        "patientId" : 503,
        "isTeleVisit" : true
      }
    ],
    [
      {
        "id" : 104,
        "title" : "Yan, Ted",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "08:30",
        "endTime" : "09:00",
        "doctorId" : 1,
        "patientId" : 504,
        "isTeleVisit" : false
      }
    ],
  ];

  let sampleBookedSlotsDoctor2 = [
    [
      {
        "id" : 106,
        "title" : "Hope, Jenna",
        "startDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "endDate" : "2020-" + startMonth + "-" + (startDate + 2),
        "startTime" : "14:00",
        "endTime" : "15:00",
        "doctorId" : 1,
        "patientId" : 506,
        "isTeleVisit" : false
      }
    ],
    [
      {
        "id" : 105,
        "title" : "Paterson, William",
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "13:30",
        "endTime" : "14:00",
        "doctorId" : 1,
        "patientId" : 505,
        "isTeleVisit" : true
      }
    ],
  ];

  if (doctorId == 1) {
    res.json(sampleBookedSlotsDoctor1);
  }
  else {
    res.json(sampleBookedSlotsDoctor2);
  }


});

// ------------                               ------------


// CATCH ALL ROUTE
app.get('*', function(req, res) {
  res.send("Invalid Page, redirect to Login Page for Practice Portal")
});

app.listen(port, () => {
  console.log(`Example app listening on port:${port}`);
})