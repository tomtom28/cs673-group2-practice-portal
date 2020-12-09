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
    type: "GET",
    url: INTERNAL_API + "/session",
    data: {
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
        url: INTERNAL_API + "/patient-info",
        data: {
          "patientId" : res1.patient_id
        },
        success: function (res2) {
          console.log(res2)
          var patientName = res2.patient_first_name + " " + res2.patient_last_name;
          $("#patientInfo-Name").val(patientName);
          $("#patientInfo-Sex").val(res2.patient_sex);
          $("#patientInfo-Birthday").val(res2.patient_dob);
          $("#patientInfo-Insurance").val(res2.patient_insurance_id);
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
  $("#BillingCode-Submit").on('click', function() {
    // Get Codes
    var listOfCodes = $("#BillingCode-List").val();

    if (listOfCodes.length == 0) {
      alert("Please add a list of billing codes!");
      return false;
    }

    // Submit to API
    $.ajax({
       type:"POST",
       url: INTERNAL_API + "/billing-codes",
       data:{
        "appointmentId" : queries.appointmentId,
        "billingCodes": listOfCodes
       },
       success: function(res) {
         alert("Billing Codes have been submitted.");
         // Update colors to user
         $("#BillingCode-Submit").removeClass("btn-primary");
         $("#BillingCode-Submit").addClass("btn-secondary");
       },
       error: function(error) {
         console.log(error);
         alert("Error. Unable to submit billing codes!");
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
    var form = new FormData();
    form.append("files_count", 1);
    form.append("file1", file);

    console.log(form.get("file1"))

    $.ajax({
      type: "POST",
      url: INTERNAL_API + "/chart-notes?appointmentId="+appointmentId,
      data: form,
      processData: false,
      contentType: false,
      success: function (res) {
        alert("Success. Chart Notes Uploaded.");
        // Update CSS for button
        $("#ChartNotes-Submit").removeClass("btn-primary")
        $("#ChartNotes-Submit").addClass("btn-secondary");
        console.log(res)
      },
      error: function (err) {
        console.log(err);
        alert("Error. Unable to submit Chart Notes!");
      }
    });
    return false;
  });


//   var fd = new FormData();
// fd.append( 'file', input.files[0] );
//
// $.ajax({
//   url: 'http://example.com/script.php',
//   data: fd,
//   processData: false,
//   contentType: false,
//   type: 'POST',
//   success: function(data){
//     alert(data);
//   }
// });

  // Submit Consultation Summary
  // $("#ConsultationSummary-Submit").on('click', function() {
    // // Get appointmentId & text field
    // var appointmentId = queries.appointmentId;
    // var consultationSummary = $("#ConsultationSummary-File").val();
    //
    // var file = $("#ConsultationSummary-File").prop('files')[0];
    //
    // // AJAX Call to Submit
    // var formdata = new FormData();
    // formdata.append("file", file);
    // formdata.append("files_count", 1); // only 1 file
    // $.ajax({
    //   type: "POST",
    //   url: INTERNAL_API + "/consultation-summary?appointmentId=" + appointmentId,
    //   data: {
    //     formdata
    //   },
    //   processData: false,
    //   contentType: false,
    //   success: function (res) {
    //     alert("Success. Consultation Summary Uploaded.");
    //     // Update CSS for button
    //     $("#ConsultationSummary-Submit").removeClass("btn-primary")
    //     $("#ConsultationSummary-Submit").addClass("btn-secondary");
    //     console.log(res)
    //   },
    //   error: function (err) {
    //     console.log(err);
    //     alert("Error. Unable to submit Consultation Summary!");
    //   }
    // });
    // return false;




    // todo remove...........................
  //   // AJAX Call to Submit
  //   $.ajax({
  //     type: "POST",
  //     url: UI_HELPER_API + "/consultation-summary",
  //     data: {
  //       "appointmentId" : appointmentId,
  //       "consultationSummary" : consultationSummary
  //     },
  //     success: function (res) {
  //       alert("Success. Consultation Summary Uploaded.");
  //       // Update CSS for button
  //       $("#ConsultationSummary-Submit").removeClass("btn-primary")
  //       $("#ConsultationSummary-Submit").addClass("btn-secondary");
  //     },
  //     error: function (err) {
  //       console.log(err);
  //       alert("Error. Unable to submit Consultation Summary!");
  //     }
  //   });
  //   return false;
  // });


  // OLD CODE FOR CONSULATION SUMMARY THAT WAS TEXT BASED, NOT A FILE
  // Submit Consultation Summary
  $("#ConsultationSummary-Submit").on('click', function() {
    // Get appointmentId & text field
    var appointmentId = queries.appointmentId;
    var consultationSummary = $("#ConsultationSummary-Notes").val();
    // AJAX Call to Submit
    $.ajax({
      type: "POST",
      url: INTERNAL_API + "/consultation-summary",
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


});