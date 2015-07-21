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

.controller('shotsCtrl', function($http, $scope, $state, $timeout, $ionicLoading, $ionicPopup) {
  if(window.localStorage.getItem("access_token") !== null) {

    $scope.current_page = 0;
    $scope.shots = [];

    $scope.loadMoreShots = function() {
      $http({
        method: 'GET',
        url: 'https://api.dribbble.com/v1/shots',
        params: {
          access_token: window.localStorage.getItem("access_token"),
          page: $scope.current_page
        }
      }).success(function(data) {
        $ionicLoading.hide();
        $scope.shots.push.apply($scope.shots, data);
        window.localStorage["shots"] = JSON.stringify($scope.shots);
        $scope.moreShots = data;
        $scope.current_page += 1;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }).error(function(){
        $ionicLoading.hide();
        $scope.shots = JSON.parse(window.localStorage["shots"]);
        $ionicPopup.alert({
          title: "网络连接发生错误",
        });
      });
    };

    $scope.loadMoreShots();

    $scope.moreShotsCanBeLoaded = function() {
      if ($scope.moreShots && $scope.moreShots.length != 0) {
        return true;
      }
      else {
        return false;
      }
    }

    // pull to refresh
    $scope.shotsRefresh = function() {
      $timeout(function() {
        $scope.current_page = 1;
        $scope.shots = [];
        $http({
          method: 'GET',
          url: 'https://api.dribbble.com/v1/shots',
          params: {
            access_token: window.localStorage.getItem("access_token"),
            page: $scope.current_page
          },
          timeout: 3000
        }).success(function(data) {
          $scope.shots.push.apply($scope.shots, data);
          window.localStorage["shots"] = JSON.stringify($scope.shots);
          $scope.current_page += 1;
        }).error(function(){
          $scope.shots = JSON.parse(window.localStorage["shots"]);
          $ionicPopup.alert({
            title: "网络连接发生错误",
          });
        })
        //Stop the ion-refresher from spinning
        .finally(function() {
          $scope.$broadcast('scroll.refreshComplete');
        })
      }, 1000);
    };
  }
  else {
    $state.go('login');
  }
})
