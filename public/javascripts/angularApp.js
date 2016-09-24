var app = angular.module('kokonatsu', ['ui.router']);

app.factory('macros', ['$http', function($http){
    var o = {
        macros: []
    };

    o.getAll = function(){
        return $http.get('/macros').success(function(data){
            data.forEach(function(macro){
                macro.links.forEach(function(link, i){
                    console.log( typeof(link));
                    if(String(link).endsWith("gifv")){
                        macro.links[i] = link.replace("gifv", "mp4");
                    }
                });
            });

            angular.copy(data, o.macros);
        });
    };

    return o;
}]);

app.controller('MainCtrl', [
'$sce',
'$scope',
'macros',
function($sce, $scope, macros){
    $scope.macros = macros.macros;

    $scope.gfycat = function(link) {
        if(link.includes("gfycat.com")) return true;
        return false;
    }
    
    $scope.gfycatDataID = function(link) {
        var index = link.lastIndexOf("/");
        return link.substring(index+1);
    }
    
    $scope.video = function(link){
        if(link.endsWith("mp4")) return true;
        return false;
    };

    $scope.img = function(link){
        if(link.endsWith("mp4") || link.includes("gfycat.com")) return false;
        return true;
    };

    $scope.trustAsResourceUrl = $sce.trustAsResourceUrl;
}]);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        macroPromise: ['macros', function(macros){
          return macros.getAll();
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);