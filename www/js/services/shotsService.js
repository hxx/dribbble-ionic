dribbble.factory('Shots', ['$resource', function($resource){
  var Shots = $resource('https://api.dribbble.com/v1/shots',
    {
      access_token: window.localStorage.getItem("access_token"),
      per_page: 6
    }
  );
  return Shots;
}])
