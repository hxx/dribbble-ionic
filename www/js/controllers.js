angular.module('dribbble.controllers', ['ngCordova'])

.controller('AppCtrl', function($ionicPopover, $scope, $http, $state, $ionicHistory, $timeout, ionicMaterialInk, ionicMaterialMotion, $cordovaToast) {

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  // https://blog.nraboy.com/2014/07/using-oauth-2-0-service-ionicframework
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  
  $scope.login = function() {
    var ref = window.open('https://dribbble.com/oauth/authorize?client_id=93c9bdb5ceed7bc87f6974c7355a78cc9293bb606eca27f369739c80536a8f18', '_blank', 'location=no');

    ref.addEventListener('loadstart', function(event) {
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
          $cordovaToast.show('登录成功！', 'short', 'bottom');
        }).error(function(data, status) {
          $ionicPopup.alert({
            title: "网络连接发生错误",
          });
        });
        ref.close();
        $http({
          method: 'GET',
          url: 'https://api.dribbble.com/v1/user',
          params: {
            access_token: window.localStorage.getItem("access_token")
          }
        }).success(function(data) {
          $scope.user = data;
          window.localStorage.setItem("user", data);
        }).error(function(data, status) {
          $ionicPopup.alert({
            title: "网络连接发生错误",
          });
        });
      }
    });
  
    if (typeof String.prototype.startsWith != 'function') {
      String.prototype.startsWith = function(str) {
        return this.indexOf(str) == 0;
      };
    }
  };

  $scope.logout = function() {
    $scope.popover.hide();
    window.localStorage.setItem("access_token", "c4226c87da1275663814e68660c62509c7b66d572880f10cd276320d21a09e0e");
    $scope.user = null;
    $cordovaToast.show('您已退出登录', 'short', 'bottom');
  };

  if (window.localStorage.getItem("access_token") !== null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go("app.shots");
    if (window.localStorage.getItem("access_token") !== "c4226c87da1275663814e68660c62509c7b66d572880f10cd276320d21a09e0e") {
      $http({
        method: 'GET',
        url: 'https://api.dribbble.com/v1/user',
        params: {
          access_token: window.localStorage.getItem("access_token")
        }
      }).success(function(data) {
        $scope.user = data;
        window.localStorage.setItem("user", data);
      }).error(function(data, status) {
        $ionicPopup.alert({
          title: "网络连接发生错误",
        });
      });
    }
  }

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  // Set Motion
  ionicMaterialMotion.ripple();
})

.controller('shotsCtrl', function($http, $scope, $state, $timeout, $ionicLoading, $ionicPopup) {
  if(window.localStorage.getItem("access_token") !== null) {
    $ionicLoading.show({
      template: 'Loading...',
    });

    $scope.current_page = 1;
    $scope.shots = [];

    $scope.loadMoreShots = function() {
      $http({
        method: 'GET',
        url: 'https://api.dribbble.com/v1/shots',
        params: {
          access_token: window.localStorage.getItem("access_token"),
          page: $scope.current_page,
          per_page: 6
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
            page: $scope.current_page,
            per_page: 6
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

.controller('shotCtrl', function($ionicLoading, $http, $scope, $stateParams) {
  $ionicLoading.show({
    template: 'Loading...',
  });

  $http({
    method: "GET",
    url: 'https://api.dribbble.com/v1/shots/' + $stateParams.shotId,
    params: {
      access_token: window.localStorage.getItem("access_token")
    },
    timeout: 3000
  }).success(function(data) {
    $ionicLoading.hide();
    $scope.shot = data;
    window.localStorage["shot-" + $stateParams.shotId] = JSON.stringify($scope.shot);
  }).error(function() {
    $ionicLoading.hide();
    $scope.shot = JSON.parse(window.localStorage["shot-" + $stateParams.shotId]);
    $ionicPopup.alert({
      title: "网络连接发生错误",
    });
  });

  $http({
    method: "GET",
    url: 'https://api.dribbble.com/v1/shots/' + $stateParams.shotId + '/comments',
    params: {
      access_token: window.localStorage.getItem("access_token")
    },
    timeout: 3000
  }).success(function(data) {
    $ionicLoading.hide();
    $scope.comments = data;
    window.localStorage["shot-" + $stateParams.shotId + "-comments"] = JSON.stringify($scope.comments);
  }).error(function() {
    $ionicLoading.hide();
    $scope.comments = JSON.parse(window.localStorage["shot-" + $stateParams.shotId + "-comments"]);
    $ionicPopup.alert({
      title: "网络连接发生错误",
    });
  });
})

.controller('userCtrl', function($ionicLoading, $http, $scope, $stateParams) {
  $ionicLoading.show({
    template: 'Loading...',
  });

  $http({
    method: "GET",
    url: 'https://api.dribbble.com/v1/users/' + $stateParams.userId,
    params: {
      access_token: window.localStorage.getItem("access_token")
    },
    timeout: 3000
  }).success(function(data) {
    $ionicLoading.hide();
    $scope.user = data;
    window.localStorage["user-" + $stateParams.userId] = JSON.stringify($scope.user);
  }).error(function() {
    $ionicLoading.hide();
    $scope.user = JSON.parse(window.localStorage["user-" + $stateParams.userId]);
    $ionicPopup.alert({
      title: "网络连接发生错误",
    });
  });
})
