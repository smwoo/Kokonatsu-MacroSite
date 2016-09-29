var app = angular.module('kokonatsu', ['ui.router','angularUtils.directives.dirPagination']);

app.factory('macros', ['$http', function($http){
    var o = {
        macros: []
    };

    o.getAll = function(){
        return $http.get('/macros').success(function(data){
            data.forEach(function(macro){
                macro.links.forEach(function(link, i){
                    var macroTemp = JSON.parse(JSON.stringify(macro));
                    if(String(link).endsWith("gifv")){
                        macro.links[i] = link.replace("gifv", "mp4");
                    }

                    macroTemp.links = [];

                    if(macro.links.length > 1)
                    {
                        macroTemp.index = i;
                    }

                    macroTemp.links.push(macro.links[i]);
                    o.macros.push(macroTemp);
                });
            });
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
    $scope.displayMacros = $scope.macros;

    $scope.alphabet = ["ALL","#","?","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    $scope.displayLetter;

    $scope.sortKey = 'macro';
    $scope.reverse = false;

    $scope.currentPage = 1;

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

    $scope.img = function(macro, link){
        if(link.endsWith("mp4") || link.includes("gfycat.com")) return false;
        return true;
    };

    $scope.trustAsResourceUrl = $sce.trustAsResourceUrl;

    $scope.reloadGfycat = function() {
        $scope.currentPage = 1;
        gfyCollection.init();
        console.log($scope.currentPage);
    }

    $scope.pageChanged = function() {
        setTimeout(function() {gfyCollection.init();}, 100);
    }

    $scope.filterAlphabet = function(letter){
        if(letter == "ALL"){
            $scope.displayMacros = $scope.macros;
        }
        else if(letter == "#"){
            $scope.displayMacros = [];
            $scope.macros.forEach(function(macro){
                if(!isNaN(parseInt(macro.macro[0]))){
                    $scope.displayMacros.push(macro);
                }
            });
        }
        else if(letter == "?"){
            $scope.displayMacros = [];
            $scope.macros.forEach(function(macro){
                var asciiCode = macro.macro.charCodeAt(0);
                if(!((asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122) || (asciiCode >= 48 && asciiCode <= 57))){
                    $scope.displayMacros.push(macro);
                }
            });
        }
        else{
            var startLetter = letter.toLowerCase();
            $scope.displayMacros = [];
            $scope.macros.forEach(function(macro){
                if(macro.macro.startsWith(startLetter)){
                    $scope.displayMacros.push(macro);
                }
            });
        }
        gfyCollection.init();
        $scope.currentPage = 1;
    }

    $scope.setSortKey = function(key){
        $scope.sortKey = key;
        if(key == 'macro') $scope.reverse = false;
        else if(key == 'usage') $scope.reverse = true;
        $scope.currentPage = 1;
    }
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

app.directive('controller', function() {
    return {
        link: function($scope, element, attrs) {
            // Trigger when number of children changes,
            // including by directives like ng-repeat
            var watch = $scope.$watch(function() {
                return element.children().length;
            }, function() {
                // Wait for templates to render
                $scope.$evalAsync(function() {
                    // Finally, directives are evaluated
                    // and templates are renderer here
                    setTimeout(function() {gfyCollection.init();}, 2000);
                });
            });
        },
    };
});