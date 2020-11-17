const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000; // Select either local port or Heroku default

// Use Body Parser
app.use(bodyParser.urlencoded({
    extended: true
}));

// Fix CORS issue
// https://medium.com/@dtkatz/3-ways-to-fix-the-cors-error-and-how-access-control-allow-origin-works-d97d55946d9
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   next();
// });

// set the view engine to ejs
app.set('view engine', 'ejs');
// server static assets (ex css, js, vendor)
app.use(express.static('public'));

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

// calendar
app.get('/calendar', function(req, res) {
    res.render('pages/calendar');
});

// televisit
app.get('/televisit', function(req, res) {
    res.render('pages/televisit');
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

// TeleVist Creation
app.post("/televisit", function(req, res) {
  console.log(req.body);

  var sampleAuthTokens = {
    apiKey : "46950324",
    sessionId : "2_MX40Njk1MDMyNH5-MTYwNDg5Mzg5MzAwMH5wdndpN0pxSWZWaVNFQitab3NUa3lmU1B-UH4",
    token : "T1==cGFydG5lcl9pZD00Njk1MDMyNCZzaWc9ZWUzODBmYjdkMDIxOGY4OWE5YTJiOTRiMDg2MDVlYWFiMDEzZDY0Nzpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5qazFNRE15Tkg1LU1UWXdORGc1TXpnNU16QXdNSDV3ZG5kcE4wcHhTV1pXYVZORlFpdGFiM05VYTNsbVUxQi1VSDQmY3JlYXRlX3RpbWU9MTYwNDg5Mzg5MyZub25jZT0wLjExNjg0NTkyNDQ2NTg4MTgyJmV4cGlyZV90aW1lPTE2MDc0ODU4OTM=",
  }

  res.json(sampleAuthTokens)
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
        "startDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "endDate" : "2020-" + endMonth + "-" + (endDate - 2),
        "startTime" : "11:00",
        "endTime" : "12:00",
      },
    ],
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


  let sampleOpenSlotsDoctor1 = [
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

  let sampleOpenSlotsDoctor2 = [
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
    res.json(sampleOpenSlotsDoctor1);
  }
  else {
    res.json(sampleOpenSlotsDoctor2);
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