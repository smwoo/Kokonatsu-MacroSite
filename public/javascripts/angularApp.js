var app = angular.module('kokonatsu', ['ui.router']);

app.factory('macros', ['$http', function($http){
    var o = {
        macros: [
        //     {
        //         text: "https://media.giphy.com/media/10E0y3sVPdnGus/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     },
        //     {
        //         text: "https://media.giphy.com/media/zUebpNrzGZX68/giphy.gif",
        //         macro: "title"
        //     }
        ]
    };

    o.getAll = function(){
        return $http.get('/macros').success(function(data){
            data.forEach(function(macro){
                if(macro.text.endsWith("gifv")){
                    macro.text = macro.text.replace("gifv", "mp4");
                }
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

    $scope.video = function(link){
        if(link.endsWith("mp4")) return true;
        return false;
    };

    $scope.img = function(link){
        if(link.endsWith("mp4")) return false;
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