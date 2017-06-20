  angular.module('app.controllers')
     .controller('ratingsResultCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {
            $scope.ratin = $stateParams.rating
          $rootScope.user = user
          $scope.schemerater =[]
         $rootScope.isLoggedIn  = $rootScope.user ? true:false
         $scope.showRatingPage =false
         $schemeLoaded=false
         console.log('show rootScope', $rootScope)
         console.log('show rating', $scope.ratin)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: []
          }
          $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
        }
      
    
      })