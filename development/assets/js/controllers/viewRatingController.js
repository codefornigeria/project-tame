  angular.module('app.controllers')
     .controller('viewRatingCtrl', function(ratings, $rootScope, $scope, $state, $stateParams, $feathers) {

                $scope.ratings = ratings
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