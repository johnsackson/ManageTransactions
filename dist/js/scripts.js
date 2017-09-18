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
//Load controller
angular.module('myApp')
   .controller('createTxnController', ['$scope', 'taskList', 'Envconfig', function ($scope, taskList, Envconfig) {
      //variable declarations
      $scope.createTransactionData = {
         amount: "",
         currency: "",
         txn_date: new Date().toISOString().slice(0, 10)
      };
      $scope.processing = false;
      
      //creates a new transaction
      $scope.creatTrans = function (isValid) {
         if(isValid) {
            $scope.processing = true;
            var email = $scope.userDetails[0].user;
            var urlQuery = Envconfig + email;
            taskList.createTransaction($scope.createTransactionData, urlQuery).then(function (response) {
               var id = response.data.id;
               urlQuery = Envconfig + $scope.userEmail + "/" + id;
               taskList.getTransaction(urlQuery).then(function (response) {
                  $scope.userDetails.push(response.data);
                  $scope.processing = false;
                  alert("Success, transaction created!");
                  $scope.createTransactionData = {amount:"",currency:"",txn_date:new Date().toISOString().slice(0, 10)};
               }, function (response) {
                  alert("Something went wrong, Please reload the page!");
               });
            }, function (response) {
               alert("Something went wrong, Please try again!");
            });
         } else {
            return;
         }         
      };

}]);
//Load controller
angular.module('myApp')
   .controller('MainController', ['$scope', '$filter', 'taskList', 'Envconfig', function ($scope, $filter, taskList, Envconfig) {
      
      //initialisation
      $scope.showResults = false;
      $scope.noResults = '';
      $scope.email = '';      
      $scope.detailExpanded = false;
      $scope.showBoxOne = false;
      $scope.processing = false;
      $scope.showData = false;
      
      //to get all transactions
      $scope.getAllTransactions = function (email, isValid) {
         if(isValid) {
            $scope.email = '' || 'priya@gmail.com';
            $scope.processing = true;
            var urlQuery = Envconfig + $scope.email;
            taskList.getUser(urlQuery).then(function (response) {
               $scope.userDetails = response.data;
               $scope.userEmail = response.data[0].user;
               $scope.numOfTxns = response.data.length;            
               angular.forEach($scope.userDetails, function (value) {
                  value.amount = parseFloat(value.amount);
                  value.id = parseInt(value.id);
               });
               $scope.processing = false;
               $scope.showData = true;
            }, function (response) {
               alert("Something went wrong, Please try again!");
            });
         } else {
            return;
         }
      };
      //$scope.getAllTransactions(); // to be removed
      
      //Get one transaction
      $scope.getTransaction = function (transactionId , j) {
         var id = parseInt(transactionId);
         var urlQuery = Envconfig + $scope.email + "/" + id;
         taskList.getTransaction(urlQuery).then(function (response) {
            $scope.transactionData = response.data;
         }, function (response) {
            alert("Something went wrong, Please try again!");
         });
      };
            
      $scope.saveTransaction = function(isValid, id) {
         if(isValid) {
            $scope.processing = true;
            var data = $filter('getById')($scope.userDetails, id);
            var urlQuery = Envconfig + data.user + "/" + data.id;
            taskList.updateTransaction(urlQuery, data).then(function (response) {
               var transData = response.data;
               $scope.processing = false;
               alert("Success");
            }, function (response) {
               alert("Something went wrong, Please try again!");
            });
         }
      };
      //$scope.creatTrans();
      
      //to delete one transaction
      $scope.deleteTrans = function (data) {
         var confirmDelete = confirm("Do you want to continue ?");
         if (confirmDelete == true) {
            $scope.processing = true;
            var newList = [];
            $scope.deleteItemId = data.id;
            var urlQuery = Envconfig + data.user + "/" + data.id;
            taskList.deleteTransaction(urlQuery)
               .then(function (response) {
                  $scope.transactionData = response.data;
                  angular.forEach($scope.userDetails, function (value) {
                     if (value.id !== $scope.deleteItemId) {
                        newList.push(value);
                     }
                  });
                  $scope.userDetails = newList;
                  $scope.processing = false;
                  alert("Successfully deleted");
               }, function (response) {
                  alert("Something went wrong, Please try again!");
               });
            return true;
         } else {
            return false;
         }
      };
      
      
      //sorting function
      $scope.sort = function (key) {
         $scope.sortKey = key; //set the sortKey to the param passed
         $scope.reverse = !$scope.reverse; //if true make it false and vice versa
      };

}]);
// restricts alphabets characters
angular.module('myApp')
   .directive('restrictAlphabets', function () { 
      return {
         restrict: 'A',
         require: 'ngModel',
         link: function (scope, element, attributes, ngModelCtrl) {
            function fromUser(text) {
               var transformedInput = text.replace(/[^0-9]/g, '');
               if (transformedInput !== text) {
                  ngModelCtrl.$setViewValue(transformedInput);
                  ngModelCtrl.$render();
               }
               return transformedInput;
            }
            ngModelCtrl.$parsers.push(fromUser);
         }
      };
   });
angular.module('myApp')
   .filter('getById', function() {
  return function(input, id) {
    var i=0, len=input.length;
    for (; i<len; i++) {
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return null;
  };
});
angular.module('myApp').service("taskList", function taskList($http, $q) {
   var taskList = {}; //list of tasks created 
   
   taskList.getUser = function (urlQuery) {
      var defer = $q.defer();
      var promise = defer.promise;

      $http({
         method: 'GET',
         url: urlQuery
      }).then(function (response) {
         defer.resolve(response);
      }, function (response) {
         defer.reject(response);
      });

      return promise;
   };
   
   taskList.createTransaction = function (data, urlQuery) {
      var defer = $q.defer();
      var promise = defer.promise;
      $http({
         method: 'POST',
         url: urlQuery,
         headers: {
            'Content-Type': "application/x-www-form-urlencoded"
         },
         data: data,
         transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
               str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
         }
      }).then(function (response) {
         defer.resolve(response);
      }, function (response) {
         defer.reject(response);
      });

      return promise;
   };
   
   taskList.getTransaction = function (urlQuery) {
      var defer = $q.defer();
      var promise = defer.promise;

      $http({
         method: 'GET',
         url: urlQuery
      }).then(function (response) {
         defer.resolve(response);
      }, function (response) {
         defer.reject(response);
      });

      return promise;
   };
   
   taskList.updateTransaction = function (urlQuery, data) {
      var defer = $q.defer();
      var promise = defer.promise;
      //var dataString = angular.toJson(data);
      /*var dataNew = {
        "id": "79",
        "user": "priya@gmail.com",
        "amount": "1236",
        "currency": "USD",
        "txn_date": "2017-08-07"
      };*/
      //var dataBnew = {&params={&amount=125,&currency="EUR",&txn_date="2017-08-07"}};
      
      $http({
         method: 'POST',
         url: urlQuery,
         headers: {
            'Content-Type': "application/x-www-form-urlencoded"
         },
         data: data,
         transformRequest: function (obj) {
            var str = [];
            for (var p in obj)
               str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
         }
      }).then(function (response) {
         defer.resolve(response);
      }, function (response) {
         defer.reject(response);
      });

      return promise;
   };
   
   taskList.deleteTransaction = function (urlQuery, data) {
      var defer = $q.defer();
      var promise = defer.promise;
      
      $http({
         method: 'DELETE',
         url: urlQuery,
         headers: {
            'Content-Type': "application/json;charset=utf-8"
         },
         data: data
      }).then(function (response) {
         defer.resolve(response);
      }, function (response) {
         defer.reject(response);
      });

      return promise;
   };

   return taskList;
});

/*angular.module('myApp').factory('taskList', function($rootScope, $http, $q){

    var taskList  = { 
        getUser: function(){
            var defer = $q.defer();
            var promise = defer.promise;

            $http.get("https://jointhecrew.in/api/txns/priya@gmail.com")
            .then(function(response){
               //task.taskList = response;
               defer.resolve(response);
            })
            .error(function(response){
               defer.reject(response);
            });
           
           return promise;
        }        
    };
    return taskList;
});*/