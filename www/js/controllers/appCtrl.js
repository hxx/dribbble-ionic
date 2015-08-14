dribbble.controller('appCtrl',
[
  '$window',
  '$scope',
  '$http',
  '$state',
  '$timeout',
  '$ionicHistory',
  '$ionicPopover',
  '$cordovaToast',
  'ionicMaterialInk',
  'ionicMaterialMotion',
  'User',
  function($window, $scope, $http, $state, $timeout, $ionicHistory, $ionicPopover, $cordovaToast, ionicMaterialInk, ionicMaterialMotion, User) {
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  // https://blog.nraboy.com/2014/07/using-oauth-2-0-service-ionicframework
  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  $scope.login = function() {
    var ref = $window.open('https://dribbble.com/oauth/authorize?client_id=93c9bdb5ceed7bc87f6974c7355a78cc9293bb606eca27f369739c80536a8f18', '_blank', 'location=no');

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
          $window.localStorage.setItem("access_token", data.access_token);
          $cordovaToast.show('登录成功！', 'short', 'bottom');
        }).error(function(data, status) {
          $ionicPopup.alert({
            title: "网络连接发生错误",
          });
        });
        ref.close();
        User.get()
        .$promise.then(
          function(value) {
            $scope.user = value;
            $window.localStorage.setItem("user", $scope.user);
          },
          function(error) {
            $ionicPopup.alert({
              title: "网络连接发生错误",
            });
          }
        );
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
    $window.localStorage.setItem("access_token", "c4226c87da1275663814e68660c62509c7b66d572880f10cd276320d21a09e0e");
    $scope.user = null;
    $cordovaToast.show('您已退出登录', 'short', 'bottom');
  };

  if ($window.localStorage.getItem("access_token") !== null) {
    $ionicHistory.nextViewOptions({
      disableAnimate: true,
      disableBack: true
    });
    $state.go("app.shots");
    if ($window.localStorage.getItem("access_token") !== "c4226c87da1275663814e68660c62509c7b66d572880f10cd276320d21a09e0e") {
      User.get()
      .$promise.then(
        function(value) {
          $scope.user = value;
          $window.localStorage.setItem("user", $scope.user);
        },
        function(error) {
          $ionicPopup.alert({
            title: "网络连接发生错误",
          });
        }
      );
    }
  }

  // Activate ink for controller
  ionicMaterialInk.displayEffect();

  // Set Motion
  ionicMaterialMotion.ripple();
}])
