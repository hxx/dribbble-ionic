dribbble.factory('User', ['$resource', function($resource) {
  var User = $resource('https://api.dribbble.com/v1/user',
    {
      access_token: window.localStorage.getItem("access_token")
    }
  );
  return User;
}])
