
    
$(document).ready( function(){
  // Initialize Google Sign-in API
  // gapi.load('auth2', function() {
  //   gapi.auth2.init()
  // })

  // function onSignIn(googleUser) {
  //   // Useful data for your client-side scripts:
  //   var profile = googleUser.getBasicProfile();
  //   console.log("ID: " + profile.getId()); // Don't send this directly to your server!
  //   console.log('Full Name: ' + profile.getName());
  //   console.log('Given Name: ' + profile.getGivenName());
  //   console.log('Family Name: ' + profile.getFamilyName());
  //   console.log("Image URL: " + profile.getImageUrl());
  //   console.log("Email: " + profile.getEmail());

  //   // The ID token you need to pass to your backend:
  //   var id_token = googleUser.getAuthResponse().id_token;
  //   console.log("ID Token: " + id_token);
  // };

  // Firebase auth
  var provider = new firebase.auth.GoogleAuthProvider();



  // // ********* DEFINE FUNCTIONS ******************
  var updateTime = function () {
    currentTime = moment()
    timeFormat = 'hh:mm:ss a'

    console.log("CURRENT TIME inside function: " + moment(currentTime).format(timeFormat))
    $('#current-time').text(moment(currentTime).format(timeFormat))
  };

  // ************************* GENERAL ***********************
  // JS for NAV
  $('#menu-toggle').on('click',function(){
    $('.ui.sidebar').sidebar('toggle')
  })

  updateTime()
  setInterval(updateTime, 1000);

  // *********************** END General *********************
  
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDg-qFp1AOpFrnysfHIfHi7HOGvqBejonQ",
    authDomain: "trainsched-e64d0.firebaseapp.com",
    databaseURL: "https://trainsched-e64d0.firebaseio.com",
    projectId: "trainsched-e64d0",
    storageBucket: "trainsched-e64d0.appspot.com",
    messagingSenderId: "328545936910"
  };
  firebase.initializeApp(config);

    // Create a variable to reference the database
    var database = firebase.database()

    // Capture Button Click
    $("#add-user-button").on("click", function() {
      // Don't refresh the page!
      event.preventDefault();

      // YOUR TASK!!!
      // Code in the logic for storing and retrieving the most recent user.
      var trainName = $('#train-name-input').val().trim()
      var destination = $('#destination-input').val().trim() 
      var firstTime = $('#first-time-input').val().trim() 
      var frequency = $('#frequency-input').val().trim() 

      console.log('nameInput: ', trainName)
      console.log('roleInput: ', destination)
      console.log('rateInput: ', firstTime)
      console.log('startInput: ', frequency)

      // Don't forget to provide initial data to your Firebase database.
      // Save new value to Firebase
        database.ref().push({        // Set data inside database root
          trainName,
          destination,
          firstTime,
          frequency
        });
    });


    // Firebase watcher + initial loader HINT: .on("value")
    database.ref().orderByChild("dateAdded").on('child_added', function(childSnapshot) {
      var csTrainName = childSnapshot.val().trainName
      var csDestination = childSnapshot.val().destination
      var csFirstTime = childSnapshot.val().firstTime
      var csFrequency = childSnapshot.val().frequency
      var nextArrival = 0
      var minutesAway = 0

      if(!childSnapshot.val()) {
        return
      }
      

      // Print retrieved values
      console.log('')
      console.log('Get trainName: ', csTrainName)
      console.log('Get destination: ',csDestination)
      console.log('Get firstTime: ',csFirstTime)
      console.log('Get frequency: ',csFrequency)
      console.log('Get nextArrival', nextArrival) 
      console.log('Get minutesAway', minutesAway) 
      

      // Calculated fields
      // First Time
      var firstTimeConverted = moment(csFirstTime, "HH:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      //// Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
      //// Time apart (remainder)
      var tRemainder = diffTime % csFrequency;
      console.log(tRemainder);

      // Minute Until Train
      var tMinutesTillTrain = csFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm a"));

      nextArrival = nextTrain.format('hh:mm')
      minutesAway = tMinutesTillTrain

      
      // Create elements
      var tr = $('#train-schedule-table > tbody ').append('<tr>')
      // Option 1 (David Method):
      var td = [{
        htmlTag: 'td',
        value: csTrainName
      }, {
        htmlTag: 'td',
        value: csDestination
      },{
        htmlTag: 'td',
        value: csFrequency
      },{
        htmlTag: 'td',
        value: nextArrival
      },{
        htmlTag: 'td',
        value: minutesAway
      }]

      td.forEach(function(tag) {
        if(!tag.value) {
          console.log('NO MORE DATA')
          // Don't want to append empty values!
          return
        }

        var htmlTag = $(`<${tag.htmlTag}>`).text(tag.value)

        tr.append(htmlTag)
      })
      // Option 2 (Simple):
      // tr.append(`<td> ${csTrainName} </td> <td> ${csDestination} </td><td> ${csFrequency} </td><td> ${minutesAway} </td>`)
    },  // Create Error Handling
    function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  })



  
      
})
