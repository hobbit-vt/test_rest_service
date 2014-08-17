(function(){

  var restClient = angular.module('restClient', ['ngRoute', 'ngResource']);

  restClient.config(['$routeProvider', function($routeProvider){

    $routeProvider
      .when('/login', {
        templateUrl: '/templates/login.html',
        controller: 'LoginController'
      })
      .when('/main', {
        templateUrl: '/templates/main.html',
        controller: 'MainController'
      })
      .when('/detail/:key', {
        templateUrl: '/templates/detail.html',
        controller: 'DetailController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
})();