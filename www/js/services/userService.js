dribbble.factory('Users', ['$resource', function($resource) {
  var Users = $resource('https://api.dribbble.com/v1/users/:userId',
    {
      access_token: window.localStorage.getItem("access_token")
    }
  );
  return Users;
}])
