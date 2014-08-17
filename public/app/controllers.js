(function(){

  var restClient = angular.module('restClient');

  restClient.controller('LoginController', ['$scope', '$location', 'loginService',  function($scope, $location, loginService){

    $scope.flashMessage = '';
    $scope.name = 'hobbit';
    $scope.pass = '1234';

    $scope.login = function(){

      loginService.login($scope.name, $scope.pass).then(
        function(result) {

          if(result) {

            $location.path('/main');

          } else {

            $scope.flashMessage = 'Nope!';
          }
        },
        function(reason) {

          $scope.flashMessage = reason;
        }
      );
    };
  }]);

  restClient.controller('MainController', ['$scope', '$location', 'loginService', 'storageService', 
    function($scope, $location, loginService, storageService) {

      if (!loginService.isLoged()) {

        $location.path('/login');
        return;
      }

      var token = loginService.getToken();

      $scope.newVal = null;
      $scope.objects = storageService.findAll({ token: token });

      $scope.add = function() {

        var data = storageService.add({ token: token, val: $scope.newVal }, function(){

          $scope.objects.push({ key: data.key, val: data.val });

        });
        $scope.newVal = '';
      };

      $scope.showUpdateForm = function(idx) {

         $scope.objects[idx].formShowed = true;
      };

      $scope.update = function(idx) {
        
        delete $scope.objects[idx].formShowed;
        storageService.update({ token: token, key: $scope.objects[idx].key, val: $scope.objects[idx].val });
      };

      $scope.remove = function(idx) {
        
        storageService.delete({ token: token, key: $scope.objects[idx].key });
        $scope.objects.splice(idx, 1);
      };

      $scope.logout = function() {

        loginService.logout();
        $location.path('/login');
      };
    }
  ]);

  restClient.controller('DetailController', ['$scope', '$routeParams', '$location',  'loginService', 'storageService',
    function($scope, $routeParams, $location, loginService, storageService){
    
      if (!loginService.isLoged()) {

        $location.path('/login');
        return;
      }

      $scope.object = storageService.find({ token: loginService.getToken(), key: $routeParams.key });
    }
  ]);

})();