dribbble.controller('userCtrl', function($ionicLoading, $http, $scope, $stateParams, $ionicPopup) {
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
