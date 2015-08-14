dribbble.controller('shotsCtrl',
 ['$scope',
  '$state',
  '$timeout',
  '$ionicLoading',
  '$ionicPopup',
  'Shots',
  function($scope, $state, $timeout, $ionicLoading, $ionicPopup, Shots) {
  if(window.localStorage.getItem("access_token") !== null) {
    $ionicLoading.show({
      template: 'Loading...',
    });

    $scope.current_page = 1;
    $scope.shots = [];

    $scope.loadMoreShots = function() {
      Shots.query(
        { page: $scope.current_page }
      )
      .$promise.then(
        function(value){
          $ionicLoading.hide();
          $scope.shots.push.apply($scope.shots, value);
          window.localStorage["shots"] = JSON.stringify($scope.shots);
          $scope.moreShots = value;
          $scope.current_page += 1;
          $scope.$broadcast('scroll.infiniteScrollComplete');
        },
        function(error){
          $ionicLoading.hide();
          $scope.shots = JSON.parse(window.localStorage["shots"]);
          $ionicPopup.alert({
            title: "网络连接发生错误",
          });
        }
      );
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
        Shots.query(
          { page: $scope.current_page }
        )
        .$promise.then(
          function(value){
            $scope.shots.push.apply($scope.shots, value);
            window.localStorage["shots"] = JSON.stringify($scope.shots);
            $scope.current_page += 1;
          },
          function(error){
            $scope.shots = JSON.parse(window.localStorage["shots"]);
            $ionicPopup.alert({
              title: "网络连接发生错误",
            });
          }
        )
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

  $scope.setMarginTop = function(index) {
    return (index * 16) + 'px';
  }
}])
