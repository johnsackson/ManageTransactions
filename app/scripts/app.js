//angular app declaration
var myApp = angular.module('myApp', ['ngRoute', 'angularUtils.directives.dirPagination'])
   .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
         //$locationProvider.hashPrefix('!');
         // routes
         $routeProvider
            .when("/", {
               templateUrl: "./partials/home.html",
               controller: "MainController"
            })
            .when("/sample", {
               templateUrl: "./partials/sample.html",
               controller: "SampleController"
            })
            .otherwise({
               redirectTo: '/'
            });
         $locationProvider.html5Mode(true);
    }
  ]);


angular.module('myApp')
   .constant("Envconfig", "https://jointhecrew.in/api/txns/"); //url is set here so that we could access it in any controller

//To demonstrate how routing works in angular
angular.module('myApp')
   .controller('SampleController', ['$scope', function ($scope) {
      //variable declarations
      $scope.test = "hello...";

}]);