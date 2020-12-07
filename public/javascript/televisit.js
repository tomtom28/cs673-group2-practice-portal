var publisher;
var session;

// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {

  // Get params
  // https://stackoverflow.com/questions/4656843/get-querystring-from-url-using-jquery
  var queries = {};
  $.each(document.location.search.substr(1).split('&'),function(c,q){
    var i = q.split('=');
    queries[i[0].toString()] = i[1].toString();
  });

  // Call UI Helper API to get Tokens
  $.ajax({
    type: "POST",
    url: INTERNAL_API + "/televisit",
    data: {
      "doctorId" : queries.doctorId,
      "appointmentId" : queries.appointmentId
    },
    success: function (res) {
      // Get Tokens from API response

      var sessionId;
      var token;
      try {
        sessionId = res.session_id;
        token = res.doctor_token;
      } catch (err) {
        alert("Unable to Create TeleVisit Session! Invalid Credentials!");
      }

      // Open Tok Code Below...
      initializeSession();
      // Handling all of our errors here by alerting them
      function handleError(error) {
        if (error) {
          alert(error.message);
        }
      }
      function initializeSession() {
        session = OT.initSession(API_KEY, sessionId);

        // Create a publisher
        publisher = OT.initPublisher('publisher', {}, handleError);
        session.connect(token, function(err) {
           // publish publisher
           session.publish(publisher);
        });
        // Subscribe to a newly created stream
        session.on('streamCreated', function(event) {
           session.subscribe(event.stream, 'subscriber');
        });
      }
    } // end success
  }); // end ajax

  // Append Patient Info
  $.ajax({
    type: "GET",
    url: INTERNAL_API + "/appointment",
    data: {
      "appointmentId" : queries.appointmentId
    },
    success: function (res1) {
      $.ajax({
        type: "GET",
        url: INTERNAL_API + "/patientName",
        data: {
          "appointmentId" : queries.appointmentId
        },
        success: function (res2) {
          $("#patientInfo-Name").val(res2.patientName);
        },
        error: function(err) {
          console.log(err);
          $("#patientInfo-Name").val("Undefined");
        }
      })
    },
    error: function(err) {
      console.log(err);
      $("#patientInfo-Name").val("Undefined");
    }
  })


  // End Video Call
  $("#EndTelevisit-Btn").on('click', function() {
    // Get DoctorId
    var doctorId = queries.doctorId;
    // Re Direct to Appointments Calendar
    var newURL = window.location.origin + "/calendar?userType=d&userId="+doctorId;
    window.location.replace(newURL);
  });


  // Submit CPT Codes for Billing
  $("#BillingCode-Submit").removeClass("btn-primary")
  $("#BillingCode-Submit").addClass("btn-secondary");
  $("#BillingCode-Submit").on('click', function() {
    //  TODO - AJAX Call, if supported by Group 3 in future
    alert("Functionality currently not supported. \n" +
          "Please contact Billing Management to update CPT codes.");
    return false;
  })

  // Submit Consultation Summary
  $("#ConsultationSummary-Submit").on('click', function() {
    // Get appointmentId & text field
    var appointmentId = queries.appointmentId;
    var consultationSummary = $("#ConsultationSummary-Notes").val();
    // AJAX Call to Submit
    $.ajax({
      type: "POST",
      url: UI_HELPER_API + "/consultation-summary",
      data: {
        "appointmentId" : appointmentId,
        "consultationSummary" : consultationSummary
      },
      success: function (res) {
        alert("Success. Consultation Summary Uploaded.");
        // Update CSS for button
        $("#ConsultationSummary-Submit").removeClass("btn-primary")
        $("#ConsultationSummary-Submit").addClass("btn-secondary");
      },
      error: function (err) {
        console.log(err);
        alert("Error. Unable to submit Consultation Summary!");
      }
    });
    return false;
  });

  // Submit Chart Notes
  $("#ChartNotes-Submit").on('click', function() {

    // Ensure that a file was Uploaded
    if ($("#ChartNotes-File").prop('files').length == 0) {
      alert("Please upload a file!");
      return false;
    }

    // Get appointmentId & text field
    var appointmentId = queries.appointmentId;
    // https://wisdmlabs.com/blog/access-file-before-upload-using-jquery-ajax/
    var file = $("#ChartNotes-File").prop('files')[0];

    // AJAX Call to Submit
    var formdata = new FormData();
    formdata.append("chart-notes", file);
    $.ajax({
      type: "POST",
      url: UI_HELPER_API + "/chart-notes?appointmentId="+appointmentId,
      data: {
        formdata
      },
      processData: false,
      contentType: false,
      success: function (res) {
        alert("Success. Chart Notes Uploaded.");
        // Update CSS for button
        $("#ChartNotes-Submit").removeClass("btn-primary")
        $("#ChartNotes-Submit").addClass("btn-secondary");
      },
      error: function (err) {
        console.log(err);
        alert("Error. Unable to submit Chart Notes!");
      }
    });
    return false;
  });



});