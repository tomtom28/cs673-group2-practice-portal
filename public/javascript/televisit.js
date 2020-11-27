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
    url: UI_HELPER_API + "/televisit",
    data: {
      "doctorId" : queries.doctorId,
      "appointmentId" : queries.appointmentId
    },
    success: function (res) {

      // Get Tokens from API response
      console.log(res);
      var apiKey;
      var sessionId;
      var token;
      try {
        apiKey = res.apiKey;
        sessionId = res.sessionId;
        token = res.token;
      } catch (err) {
        alert("Unable to Create TeleVisit Session! Invalid Credentials!")
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
        session = OT.initSession(apiKey, sessionId);

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



  // End Video Call
  $("#EndTelevisit-Btn").on('click', function() {

    // Get DoctorId
    var doctorId = queries.doctorId;

    // Re Direct to Appointments Calendar
    var newURL = window.location.origin + "/calendar?userType=d&userId="+doctorId;
    window.location.replace(newURL);
        
  });

});