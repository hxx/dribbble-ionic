dribbble.controller('shotCtrl', function($ionicLoading, $http, $scope, $stateParams, $ionicPopup) {
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
