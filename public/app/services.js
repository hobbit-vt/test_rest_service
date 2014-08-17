(function(){

  var restClient = angular.module('restClient');

  restClient.service('loginService', ['$q', '$http', function($q, $http) {

    var token = null;

    this.login = function(name, pass){

      var defer = $q.defer();

      $http.post('/login/' + name + '/' + pass)
        .then(
          function(result) {

            token = result.data.token;
            defer.resolve(token);
          },
          function(result) {

            defer.reject('service unavailable');
          }
        );

      return defer.promise;
    };

    this.logout = function(){

      $http.post('/logout/' + token);
    };

    this.isLoged = function(){

      return token !== null;
    }

    this.getToken = function() {

      return token;
    }
  }]);

  restClient.factory('storageService', ['$resource', function($resource) {

    return $resource('/storage/:key/:val/:token', {
      key: '@key',
      val: '@val',
      token: '@token'
    },
    {
      findAll: { method:'GET', isArray: true },
      find: { method: 'GET'},
      add: { method: 'POST' },
      update: { method: 'PUT' },
      delete: { method: 'DELETE' }
    });
  }]);

})();