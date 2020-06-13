// Set the url based on the window URL and port - used across all calls
var urlPrefix = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port;
var serverUrl = 'http://localhost:3001'

// Start an angularjs app
var app = angular.module('gymBookingApp', ['ngRoute']);

// Set routes
app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "gyms.html"
    })
    .when("/admin", {
      templateUrl: "admin.html"
    })
    .when("/removeBooking", {
      templateUrl: "removeBooking.html"
    })
    .when("/gym/:gymId", {
      templateUrl: "gym.html"
    })
    .when('/*', {
      templateUrl: "notFound.html"
    });
})

app.controller('gymsController', function ($scope, $http) {
  $scope.selectedGym = null;
  $scope.selectedHourView = null;

  $http.get(serverUrl + '/gyms')
    .then(function (response) {
      console.log(response.data);
      $scope.gyms = response.data;
    });

  $scope.viewGym = function viewGym() {
    $scope.gymName = $scope.selectedGym.name;
    $scope.gymAddress = $scope.selectedGym.address;
    $scope.hoursView = Object.keys($scope.selectedGym.hours);
    $scope.gymId = $scope.selectedGym._id;
  }

  $scope.viewHours = function viewHours() {
    $scope.totalHour = $scope.selectedGym.hours[$scope.selectedHourView].total;
    $scope.currentHour = $scope.selectedGym.hours[$scope.selectedHourView].current;
  }

  $scope.bookHour = function bookHour() {
    const bookingData = {
      name: $scope.bookingName,
      email: $scope.bookingEmail,
      phoneNumber: $scope.bookingPhoneNumber,
      hour: $scope.selectedHourView
    }

    const httpConfig = {
      headers: {
        'Content-Type': 'application/json'
      }
    };


    $http.post(serverUrl + '/gyms/' + $scope.selectedGym._id, bookingData, httpConfig).then(function (response) {
      $scope.bookingId = response.data;
    });
  }
});

app.controller('adminController', function ($scope, $http) {
  let gym = null;
  let username = null;
  let password = null;

  $scope.login = function login() {
    username = $scope.loginUsername;
    password = $scope.loginPassword;

    //login stuff and get gymId, get full gym details, and get all bookings
    $scope.gymId = "5edd07bc9432d7ad226b9fdb";
    $http.get(serverUrl + '/gyms/' + $scope.gymId)
      .then(function (response) {
        gym = response.data;
        $scope.gymName = gym.name;
        $scope.gymAddress = gym.address;
        $scope.hoursView = Object.keys(gym.hours);
      });

    $scope.viewHours = function viewHours() {
      $scope.totalHour = gym.hours[$scope.selectedHourView].total;
      $scope.currentHour = gym.hours[$scope.selectedHourView].current;
    }

    $scope.updateCapacity = function updateCapacity() {
      const postData = {
        newCapacity: $scope.newCapacity,
        username,
        password,
      }

      const httpConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post(serverUrl + '/gyms/' + gym._id, postData, httpConfig).then(function (response) {
        console.log(response.data);
      });
    }

    $scope.updateTotal = function updateTotal() {
      const postData = {
        newCapacity: $scope.newCapacity,
        username,
        password,
      }

      const httpConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post(serverUrl + '/gyms/' + gym._id, postData, httpConfig).then(function (response) {
        console.log(response.data);
      });
    }

    $scope.updateCurrent = function updateCurrent() {
      const postData = {
        newCurrent: $scope.newCurrent,
        total: `${gym.hours[$scope.selectedHourView].total}`,
        hour: $scope.selectedHourView,
        username,
        password,
      }

      const httpConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post(serverUrl + '/gyms/' + gym._id, postData, httpConfig).then(function (response) {
        console.log(response.data);
      });
    }

    $scope.updateCurrentPlus = function updateCurrentPlus() {
      const postData = {
        current: `${gym.hours[$scope.selectedHourView].current + 1}`,
        total: `${gym.hours[$scope.selectedHourView].total}`,
        hour: $scope.selectedHourView,
        username,
        password,
      }

      const httpConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post(serverUrl + '/gyms/' + gym._id, postData, httpConfig).then(function (response) {
        console.log(response.data);
      });
    }

    $scope.updateCurrentMinus = function updateCurrentMinus() {
      const postData = {
        current: `${gym.hours[$scope.selectedHourView].current - 1}`,
        total: `${gym.hours[$scope.selectedHourView].total}`,
        hour: $scope.selectedHourView,
        username,
        password,
      }

      const httpConfig = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      $http.post(serverUrl + '/gyms/' + gym._id, postData, httpConfig).then(function (response) {
        console.log(response.data);
      });
    }

    $scope.getBookings = function getBookings() {
      console.log('hi');
      $scope.bookings = [{
          "gymId": "5edd07bc9432d7ad226b9fdb",
          "name": "a",
          "email": "a",
          "phoneNumber": "a",
          "hour": "11",
          "currentTime": 1591551506486.0
        },
        {
          "gymId": "5edd07bc9432d7ad226b9fdb",
          "name": "a",
          "email": "a",
          "phoneNumber": "a",
          "hour": "11",
          "currentTime": 1591551506486.0
        }
      ]
      console.log($scope.bookings);

      dataSet1 = $scope.bookings;

      $('#example').DataTable({
        data: dataSet1,
        columns: [{
            data: "name"
          },
          {
            data: "email"
          },
          {
            data: "phoneNumber"
          },
          {
            data: "hour"
          }
        ]
      });

      // $http.get(serverUrl + '/bookings/' + gym.id)
      //   .then(function (response) {
      //     $scope.bookings = response.data;
      //   });
    }

  }
});

app.controller('gymController', function ($scope, $http) {
  let gymId = window.location.href;
  gymId = gymId.substring(gymId.indexOf('gym/') + 4);

  let selectedGym = null;

  var dt = new Date();
  let currentHour = dt.getHours();

  $scope.viewHours = function viewHours() {
    $scope.totalHour = selectedGym.hours[$scope.selectedHourView].total;
    $scope.currentHour = selectedGym.hours[$scope.selectedHourView].current;
  }

  $http.get(serverUrl + '/gyms/' + gymId)
    .then(function (response) {
      selectedGym = response.data;
      $scope.gymName = selectedGym.name;
      $scope.gymAddress = selectedGym.address;
      $scope.hoursView = Object.keys(selectedGym.hours);
      $scope.selectedHourView = currentHour;
      $scope.currentHour = currentHour;
      $scope.viewHours();
    });
    function flipTo(digit, n){
      var current = digit.attr('data-num');
      digit.attr('data-num', n);
      digit.find('.front').attr('data-content', current);
      digit.find('.back, .under').attr('data-content', n);
      digit.find('.flap').css('display', 'block');
      setTimeout(function(){
        digit.find('.base').text(n);
        digit.find('.flap').css('display', 'none');
      }, 350);
    }
    
    function jumpTo(digit, n){
      digit.attr('data-num', n);
      digit.find('.base').text(n);
    }
    
    function updateGroup(group, n, flip){
      var digit1 = $('.ten'+group);
      var digit2 = $('.'+group);
      n = String(n);
      if(n.length == 1) n = '0'+n;
      var num1 = n.substr(0, 1);
      var num2 = n.substr(1, 1);
      if(digit1.attr('data-num') != num1){
        if(flip) flipTo(digit1, num1);
        else jumpTo(digit1, num1);
      }
      if(digit2.attr('data-num') != num2){
        if(flip) flipTo(digit2, num2);
        else jumpTo(digit2, num2);
      }
    }
    
    function setTime(flip){
      var t = new Date();
      updateGroup('hour', t.getHours(), flip);
      updateGroup('min', t.getMinutes(), flip);
      updateGroup('sec', t.getSeconds(), flip);
    }
    
    $(document).ready(function(){
      
      setTime(false);
      setInterval(function(){
        setTime(true);
      }, 1000);
      
    });
});