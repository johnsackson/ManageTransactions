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