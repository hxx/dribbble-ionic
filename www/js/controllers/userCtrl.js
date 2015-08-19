dribbble.controller('userCtrl',
[
  '$window',
  '$scope',
  '$stateParams',
  '$ionicLoading',
  '$ionicPopup',
  'Users',
  function($window, $scope, $stateParams, $ionicLoading, $ionicPopup, Users) {
  $ionicLoading.show({
    template: 'Loading...',
  });

  Users.get(
    {
      userId: $stateParams.userId
    }
  )
  .$promise.then(
    function(value) {
      $ionicLoading.hide();
      $scope.user = value;
      $window.localStorage["user-" + $stateParams.userId] = JSON.stringify($scope.user);
    },
    function(error) {
      $ionicLoading.hide();
      $scope.user = JSON.parse($window.localStorage["user-" + $stateParams.userId]);
      $ionicPopup.alert({
        title: "网络连接发生错误",
      });
    }
  )
}])
