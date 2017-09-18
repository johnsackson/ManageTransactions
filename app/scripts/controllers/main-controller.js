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