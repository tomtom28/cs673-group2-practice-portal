var counterStart = 1000000000000; // sets an very large number for open slot id's to avoid collisions with real apt ids
var counterMax = counterStart + 1; // tracks the maximum calendar counter value

document.addEventListener('DOMContentLoaded', function() {

  // Get params
  // https://stackoverflow.com/questions/4656843/get-querystring-from-url-using-jquery
  var queries = {};
  $.each(document.location.search.substr(1).split('&'),function(c,q){
    var i = q.split('=');
    queries[i[0].toString()] = i[1].toString();
  });

  // Parse UserId and UserType from URL
  var userId = queries.userId;
  var userType = queries.userType; // 'r' = receptionist, 'd' = doctor

  // Create Calendar
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'timeGridWeek',
    // initialDate: startOfCalander,
    navLinks: true, // can click day/week names to navigate views
    nowIndicator: true,

    weekNumbers: true,
    weekNumberCalculation: 'ISO',

    editable: false, // cannot drag events
    selectable: true,

    // Add Available Time for given doctor
    select: function(arg) {

      var addNewEvent = confirm('Add a New Appointment Time Slot?');
      if (addNewEvent) {

        // TODO - Remove this once AJAX call to UpdateDoctorAvailability is supported
        alert("Functionality currently not supported. \n" +
              "Please contact Practice Management to update availability.");
        return false;

        // Get Date & Time Ranges
        var startMonth = arg.start.getMonth() + 1;
        var startDay = arg.start.getDate();
        var startHour = arg.start.getHours();
        var startMinute = arg.start.getMinutes();
        var endMonth = arg.end.getMonth() + 1;
        var endDay = arg.end.getDate();
        var endHour = arg.end.getHours();
        var endMinute = arg.end.getMinutes();

        // Call External API via helper
        UpdateDoctorAvailability(startMonth, startDay, startHour, startMinute,
          endMonth, endDay, endHour, endMinute, function(res, err) {

            // Alert if error
            if (err) {
              alert("Unable to new Availablity!");
              console.log(err);
            }
            // Otherwise, append to Calendar
            else {
              calendar.addEvent({
                title: 'Available',
                start: arg.start,
                end: arg.end,
                className: 'pp-calendar-open'
              });
            }
          });
      }
      calendar.unselect()
    },

    // Get new Events on Render or Re-Render of Calendar
    datesSet: function(arg) {

      // Clear any old Events
      ClearAllCalendarEvents(calendar);

      // Get Date Ranges
      var startMonth = arg.start.getMonth() + 1;
      var startDay = arg.start.getDate();
      var endMonth = arg.end.getMonth() + 1;
      var endDay = arg.end.getDate();
      var startYear = arg.start.getUTCFullYear();
      var endYear = arg.end.getUTCFullYear();

      // Call Helper Method to hit API and add all events to calendar within date range
      _this = this;
      GetDoctorEventsByDateRange(startMonth, startDay, startYear, endMonth, endDay, endYear, function (data) {
        for (var _event of data) {
          _this.addEvent(_event);
        }
      });
    },

    // Clicked Event, Triggers Modal
    eventClick: function(arg) {

      console.log(arg.event.extendedProps)

      // Determine Type of Event
      var eventClassNames = arg.el.className;

      // Open Appointment
      if (eventClassNames.includes("pp-calendar-open")) {

        // Get Required Data Elements
        var appointmentId = arg.event.id;
        var startTime = arg.event.start;
        var endTime = arg.event.end;
        var doctorName = GetDoctorName();

        // Update Modal
        $("#openAptModal-label-apt-id").val(appointmentId);
        $("#openAptModal-label-date-start-time").val(startTime);
        $("#openAptModal-label-date-end-time").val(endTime);
        $("#openAptModal-label-doctor-name").val(doctorName);


        // AJAX Call to get all Patients in Practice
        $.ajax({
          type: "GET",
          url: INTERNAL_API + "/patients",
          data: {},
          success: function(res) {
            // Append all Patients to the Dropdown menu
            $("#openAptModal-label-patient-name").empty();
            $("#openAptModal-label-patient-name").append('<option value="0">Please select...</option>');
            for (var i=0; i < res.length; i++) {
              var patientHTML = '<option value="' + res[i].id + '">' + res[i].name + '</option>';
              $("#openAptModal-label-patient-name").append(patientHTML);
            }

            // Show modal
            $('#openAptModal').modal('show');
          }
        });

      }

      // Booked Appointment
      else if (eventClassNames.includes("pp-calendar-booked")) {

        // Get Required Data Elements
        var appointmentId = arg.event.id;
        var startTime = arg.event.start;
        var endTime = arg.event.end;
        var doctorName = GetDoctorName();
        var apptTitle = arg.event.title;
        var isTeleVisit = arg.event.extendedProps.isTeleVisit;
        var patientId = apptTitle.split(" ")[1]; // get patient Id

        // Update Modal
        $("#bookedAptModal-label-apt-id").val(appointmentId);
        $("#bookedAptModal-label-date-start-time").val(startTime);
        $("#bookedAptModal-label-date-end-time").val(endTime);
        $("#bookedAptModal-label-doctor-name").val(doctorName);

        if (isTeleVisit) {
          // Only show televist button if doctor is logged in
          if (userType == 'd') {
            $("#bookedAptModal-televisit").show(); // show button for tele visit
          }
          $("#bookedAptModal-label-apt-type").empty();
          $("#bookedAptModal-label-apt-type").append('<option value="true">Tele-Visit</option>');
        }
        else {
          $("#bookedAptModal-televisit").hide(); // hide button for tele visit
          $("#bookedAptModal-label-apt-type").empty();
          $("#bookedAptModal-label-apt-type").append('<option value="false">In-Person</option>');
        }

        // Query for Patient Name
        $.ajax({
          type: "GET",
          url: INTERNAL_API + "/patient-info",
          data: {
            "patientId" : patientId
          },
          success: function(res) {
            // Append Patient Name to DOM
            patientName = res.patient_first_name + " " + res.patient_last_name;
          },
          error: function(err) {
            console.log(err);
            patientName = "Undefined";
          }
        })
        .then(function() {
          // Show modal
          $("#bookedAptModal-label-patient-name").val(patientName);
          $('#bookedAptModal').modal('show');
        })

      }

      // Cancelled Appointment
      else if (eventClassNames.includes("pp-calendar-cancelled")) {

        // Get Required Data Elements
        var appointmentId = arg.event.id;
        var startTime = arg.event.start;
        var endTime = arg.event.end;
        var doctorName = GetDoctorName();
        var patientName = arg.event.extendedProps.patientName;
        var cancelledByName = arg.event.extendedProps.cancelledByName;
        var appointmentType = arg.event.extendedProps.appointmentType;

        // Update Modal
        $("#cancelledAptModal-label-apt-id").val(appointmentId);
        $("#cancelledAptModal-label-date-start-time").val(startTime);
        $("#cancelledAptModal-label-date-end-time").val(endTime);
        $("#cancelledAptModal-label-doctor-name").val(doctorName);
        $("#cancelledAptModal-label-patient-name").val(patientName);
        $("#cancelledAptModal-label-cancelledByName").val(cancelledByName);
        $("#cancelledAptModal-label-apt-type").val(appointmentType);

        // Show modal
        $('#cancelledAptModal').modal('show');
      }

      // Invalid Condition
      else {
        console.log("Invalid Option!");
        console.log(arg);
      }

    },
    dayMaxEvents: true, // allow "more" link when too many events
    events: [] // This gets set each time the calender mounts

  });

  // Add Logged In User Name
  if (userType == 'r') {
    $("#user-name").html("Receptionist");
    $("#bookedAptModal-televisit").hide(); // hide button for tele visit
  }
  else {
    $.ajax({
      type: "GET",
      url: INTERNAL_API + "/doctorname",
      data: {
        "doctorId" : userId
      },
      success: function(res) {
        // Append Doctor Name to DOM
        $("#user-name").html(res.doctorName);
      },
      error: function(err) {
        console.log(err);
        $("#user-name").html("Undefined");
      }
    });

  }

  // Update Doctor Selector, if Receptionist
  if (userType == 'r') {
    $.ajax({
      type: "GET",
      url: INTERNAL_API + "/doctors",
      data: {},
      success: function(res) {
        // Iterate over response and append to DOM
        for (var i=0; i < res.length; i++) {
          $("#select-doctor").append('<option value="' + res[i].ID + '">' + res[i].Name + '</option>');
        }
        // Render Calendar
        calendar.render();
      }
    });
  }
  // Otherwise, Hide Doctor Selector
  else {
    $("#select-doctor").hide();
    $("#select-doctor-label").hide();
    calendar.render();
  }

  // Calendar Helper: Dr Name was Changed
  $("#select-doctor").change(function(){

    // Clear any old Events
    ClearAllCalendarEvents(calendar);

    // Get Date Ranges
    var startMonth = calendar.view.getCurrentData().dateProfile.currentRange.start.getMonth() + 1;
    var startDay = calendar.view.getCurrentData().dateProfile.currentRange.start.getDate();
    var startYear = calendar.view.getCurrentData().dateProfile.currentRange.start.getUTCFullYear();
    var endMonth = calendar.view.getCurrentData().dateProfile.currentRange.end.getMonth() + 1;
    var endDay = calendar.view.getCurrentData().dateProfile.currentRange.end.getDate();
    var endYear = calendar.view.getCurrentData().dateProfile.currentRange.end.getUTCFullYear();

    // Call Helper Method to hit API and add all events to calendar within date range
    GetDoctorEventsByDateRange(startMonth, startDay, startYear, endMonth, endDay, endYear, function(data) {
      for (var _event of data) {
        calendar.addEvent(_event);
      }
    });
  })


  // Calendar Helper: Call API for Date Range
  function GetDoctorEventsByDateRange(startMonth, startDay, startYear, endMonth, endDay, endYear,
    _callback) {

    // Get Doctor Id
    var doctorId = GetDoctorId();

    // Initialize response
    var myResponse = [];

    // First, get open timeslots (minus booked slot conflicts)
    $.ajax({
      type: "GET",
      url: INTERNAL_API + "/unbooked",
      data: {
        "doctorId" : doctorId,
        "startMonth" : startMonth,
        "startDay" : startDay,
        "startYear" : startYear,
        "endMonth" : endMonth,
        "endDay" : endDay,
        "endYear" : endYear
      },
      success: function (res1) {
        // Format and Append all Open Slots
        var counter = counterStart;
        for (var i=0; i<res1.length; i++) {
          for (var j=0; j<res1[i].length; j++) {
            var openSlot = {
              id : counter,
              title: res1[i][j].title,
              start: res1[i][j].startDate + "T" + res1[i][j].startTime,
              end: res1[i][j].endDate + "T" + res1[i][j].endTime,
              className: 'pp-calendar-open'
            };
            myResponse.push(openSlot);
            counter++;
          }
        }
        // Store counter max value to prevent collisions
        counterMax = counter;

        // Second, get Booked Timeslots
        $.ajax({
          type: "GET",
          url: INTERNAL_API + "/booked",
          data: {
            "doctorId" : doctorId,
            "startMonth" : startMonth,
            "startDay" : startDay,
            "startYear" : startYear,
            "endMonth" : endMonth,
            "endDay" : endDay,
            "endYear" : endYear
          },
          success: function (res2) {
            // Format and Append all Booked Slots
            for (var i=0; i<res2.length; i++) {
              var bookedSlot = {
                id : res2[i].id,
                title: res2[i].title,
                start: res2[i].startDate + "T" + res2[i].startTime,
                end: res2[i].endDate + "T" + res2[i].endTime,
                className: 'pp-calendar-booked',
                extendedProps: {
                  isTeleVisit: res2[i].isTeleVisit,
                  patientId: res2[i].patientId,
                  doctorId: res2[i].doctorId
                }
              };
              myResponse.push(bookedSlot);
            }

            return _callback(myResponse);

          } // end success 2
        }); // end AJAX call 2
      },
      error: function (err) {
        alert("Error. Unable to get calendar.\nContact Support.");
        console.log(err);
      } // end success 1
    }); // end AJAX call 1

  }

  // Calendar Helper: Call API to update Doctor Availablity
  function UpdateDoctorAvailability(startMonth, startDay, startHour, startMinute,
    endMonth, endDay, endHour, endMinute, _callback) {

    // TODO - AJAX Call, if supported by Group 4 in future
    return _callback(false, false);

  }

  // Calendar Helper: Call All events
  function ClearAllCalendarEvents(calendar) {
    var allEvents = calendar.getEvents();
    for (var _event of allEvents) {
      _event.remove();
    }
  }


  // Modal Helper: Cancelled Booked Appointment (by Practice)
  $("#bookedAptModal-cancel-apt").on('click', function() {

    // Ensure past event cannot be changed
    var startDate = new Date($("#bookedAptModal-label-date-start-time").val());
    if (startDate < new Date()) {
      alert("Past appointments cannot be cancelled!");
      return false;
    }

    // Get Data Elements
    var appointmentId = $("#bookedAptModal-label-apt-id").val();

    // DoctorId is used if Receptionist is logged in
    var cancelledById = GetDoctorId();

    // Call UI Helper API to remove apt
    $.ajax({
       type:"POST",
       url: INTERNAL_API + "/booked",
       data:{
        "appointmentId" : appointmentId,
        "cancelledById": cancelledById
       },
       success: function(res) {

         // Get Event Properties & Remove Event
         var _event = calendar.getEventById(appointmentId);
         console.log(_event)
         var startDateTime = _event.start;
         var endDateTime = _event.end;
         _event.remove();

         // Add Back Updated Event with updated Values
         var _updatedEvent = {
           id: ++counterMax,
           title: 'Available',
           start: startDateTime,
           end: endDateTime,
           className: 'pp-calendar-open'
         }
         calendar.addEvent(_updatedEvent);
       },
       error: function(err) {
         alert("Error. Unable to Cancel Booking!");
       }
     })

    // Close Modal
    $("#bookedAptModal").modal('hide');
    return false;
  });


  // Modal Helper: Book New Appointment (by Practice)
  $("#openAptModal-book-apt").on('click', function() {

    // Ensure past event cannot be changed
    var startDate = new Date($("#openAptModal-label-date-start-time").val());
    if (startDate < new Date()) {
      alert("Past appointments cannot be scheduled!");
      return false;
    }

    // Get Data Elements
    var openId = $("#openAptModal-label-apt-id").val();
    var isTeleVisit = $("#openAptModal-label-apt-type").val();
    var doctorId = GetDoctorId();
    var patientId = $("#openAptModal-label-patient-name").val();
    var patientName = $("#openAptModal-label-patient-name :selected")[0].text;

    // Ensure Patient Name was selected
    if (patientId == 0) {
      alert("Please Select a Patient Name from the Dropdown menu.")
      return false;
    }

    // Parse Start / End Date Times
    var startDateTime = FormatDateTime(new Date($("#openAptModal-label-date-start-time").val()));
    var endDateTime = FormatDateTime(new Date($("#openAptModal-label-date-end-time").val()));
    console.log(startDateTime)

    // Call UI Helper API to book apt
    $.ajax({
       type:"POST",
       url: INTERNAL_API + "/open",
       data: {
        "doctorId" : doctorId,
        "patientId" : patientId,
        "startDateTime" : startDateTime,
        "endDateTime" : endDateTime,
        "isTeleVisit" : isTeleVisit
       },
       success: function(res) {
         // Get Event Properties & Remove Event
         var _event = calendar.getEventById(openId);
         //
         var startDateTime = _event.start;
         var endDateTime = _event.end;
         _event.remove();

         // Add Back Updated Event with updated Values
         var _updatedEvent = {
           id: res.appointment_id,
           title: "Patient " + patientId,
           start: startDateTime,
           end: endDateTime,
           className: 'pp-calendar-booked',
           extendedProps: {
             patientId: patientId,
             doctorId: doctorId,
             appointmentType: isTeleVisit == "true"
           }
         }
         calendar.addEvent(_updatedEvent);
       },
       error: function(err) {
         alert("Error. Unable to Create Booking!");
       }
     })

    // Close Modal
    $("#openAptModal").modal('hide');
    return false;

  });


  // Modal Helper: Remove Open Time Slot (by Practice)
  $("#openAptModal-delete-apt").on('click', function() {
    // Get Data Elements
    var openId = $("#openAptModal-label-apt-id").val();
    var doctorId = GetDoctorId();

    //  TODO - AJAX Call, if supported by Group 4 in future
    alert("Functionality currently not supported. \n" +
          "Please contact Practice Management to update availability.");

    // Get Event Time Line
    // var _event = calendar.getEventById(openId);
    // var startDateTime = _event.start;
    // var endDateTime = _event.end;
    // _event.remove();

    // Close Modal
    // $("#openAptModal").modal('hide');

    return false;

  });


  // Modal Helper: Start TeleVist Session
  $("#bookedAptModal-televisit").on('click', function() {

    // Ensure past televisit cannot be selected
    var endDate = new Date($("#bookedAptModal-label-date-end-time").val());
    if (endDate < new Date()) {
      alert("Unable to redirect! TeleVisit has already ended!");
      return false;
    }

    // Get Appointment and Doctor
    var doctorId = GetDoctorId();
    var appointmentId = $("#bookedAptModal-label-apt-id").val();

    // Redirect to TeleVisit
    var newURL = window.location.origin + "/televisit?appointmentId=" + appointmentId + "&doctorId="+doctorId;
    window.location.replace(newURL);

  });


  // Helper Method: Format Date Time (YYYY-DD-MMTHH:mm)
  function FormatDateTime(dateTimeObject) {

    // Add 0's in front of single digits
    var month = (dateTimeObject.getUTCMonth() + 1);
    if (month < 10) {
      month = "0" + month;
    }

    var day = dateTimeObject.getUTCDate();
    if (day < 10) {
      day = "0" + day;
    }

    var minutes = dateTimeObject.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    var hours = dateTimeObject.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }

    // Format as YYYY-DD-MMTHH:mm
    var dateTime = dateTimeObject.getUTCFullYear() + "-" + month + "-" + day +
      "T" + hours + ":" + minutes;

    return dateTime;

  }


  // Helper Method: Get Doctor Id
  function GetDoctorId() {
    // Receptionist view, get from dropdown
    if (userType == 'r') {
      return doctorId = $("#select-doctor").val();
    }
    // Doctor view, get from params
    else {
      return userId;
    }
  }


  // Helper Method: Get Doctor Name
  function GetDoctorName() {
    // Receptionist view, get from dropdown
    if (userType == 'r') {
      return $("#select-doctor option:selected").text();
    }
    else {
      return $("#user-name").text();
    }
  }

});

