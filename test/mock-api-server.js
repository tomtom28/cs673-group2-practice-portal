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