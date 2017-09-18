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