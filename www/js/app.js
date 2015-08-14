angular.module('dribbble', ['ionic', 'ionic-material', 'ngCordova', 'ngResource'])

.run(function($ionicPlatform, $http) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.localStorage.getItem("access_token") === null) {
      window.localStorage.setItem("access_token", "c4226c87da1275663814e68660c62509c7b66d572880f10cd276320d21a09e0e");
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'appCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('app.shots', {
    url: "/shots",
    views: {
      'menuContent': {
        templateUrl: "templates/shots.html",
        controller: 'shotsCtrl'
      }
    }
  })
  .state('app.shot', {
    url: '/shots/:shotId',
    views: {
      'menuContent': {
        templateUrl: 'templates/shot.html',
        controller: 'shotCtrl'
      }
    }
  })

  .state('app.user', {
    url: "/users/:userId",
    views: {
      'menuContent': {
        templateUrl: 'templates/user.html',
        controller: 'userCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/shots');
});

var dribbble = angular.module('dribbble')
