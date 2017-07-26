     angular.module('app.controllers')
     .controller('viewRatingModalCtrl', function($uibModalInstance, rating ,$scope) {
            
             console.log('new scope', $scope)
             $scope.theRating = rating
            

      })