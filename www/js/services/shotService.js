dribbble.factory('Shot', ['$resource', function($resource) {
  var Shot = $resource('https://api.dribbble.com/v1/shots/:shotId',
    {
      access_token: window.localStorage.getItem("access_token")
    }
  );
  return Shot;
}])

.factory('Comments', ['$resource', function($resource){
  var Comments = $resource('https://api.dribbble.com/v1/shots/:shotId/comments',
    {
      access_token: window.localStorage.getItem("access_token"),
    }
  );
  return Comments;
}])
