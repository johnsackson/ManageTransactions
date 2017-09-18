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