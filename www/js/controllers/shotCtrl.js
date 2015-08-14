dribbble.controller('shotCtrl',
 ['$scope',
  '$http',
  '$stateParams',
  '$ionicLoading',
  '$ionicPopup',
  'Shot',
  'Comments',
  function($scope, $http, $stateParams, $ionicLoading, $ionicPopup, Shot, Comments) {
  $ionicLoading.show({
    template: 'Loading...',
  });

  Shot.get(
    {
      shotId: $stateParams.shotId,
      timeout: 3000
    }
  )
  .$promise.then(
    function(value){
      console.log("foobar");
      $ionicLoading.hide();
      $scope.shot = value;
      window.localStorage["shot-" + $stateParams.shotId] = JSON.stringify($scope.shot);
    },
    function(error){
      $ionicLoading.hide();
      $scope.shot = JSON.parse(window.localStorage["shot-" + $stateParams.shotId]);
      $ionicPopup.alert({
        title: "网络连接发生错误",
      });
    }
  )

  Comments.query(
    {
      shotId: $stateParams.shotId,
      timeout: 3000
    }
  )
  .$promise.then(
    function(value){
      $ionicLoading.hide();
      $scope.comments = value;
      window.localStorage["shot-" + $stateParams.shotId + "-comments"] = JSON.stringify($scope.comments);
    },
    function(error){
      $ionicLoading.hide();
      $scope.comments = JSON.parse(window.localStorage["shot-" + $stateParams.shotId + "-comments"]);
      $ionicPopup.alert({
        title: "网络连接发生错误",
      });
    }
  )
}])
