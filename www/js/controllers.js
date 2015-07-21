angular.module('dribbble.controllers', [])

.controller('AppCtrl', function($scope, $http, $state, $ionicHistory) {

  // https://blog.nraboy.com/2014/07/using-oauth-2-0-service-ionicframework
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  
  $scope.login = function() {
    var ref = window.open('https://dribbble.com/oauth/authorize?client_id=93c9bdb5ceed7bc87f6974c7355a78cc9293bb606eca27f369739c80536a8f18', '_blank', 'location=no');

    ref.addEventListener('loadstart', function(event) {
      alert("foobar");
      if((event.url).startsWith("http://localhost/callback")) {
        code = (event.url).split("code=")[1];
        $http({
          method: 'POST',
          url: 'https://dribbble.com/oauth/token',
          params: {
            client_id: '93c9bdb5ceed7bc87f6974c7355a78cc9293bb606eca27f369739c80536a8f18',
            client_secret: 'ea44e8487d8085a25bf836c9a9570cea67ea892f9377dbe8284f2cb70bad371d',
            code: code
          }
        }).success(function(data) {
          window.localStorage.setItem("access_token", data.access_token);
        }).error(function(data, status) {
          alert("ERROR: " + data);
        });
        ref.close();
      }
    });
  
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0;
      };
    }
  };

  if(window.localStorage.getItem("access_token") !== null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go("app.shots");
  }
})

})
