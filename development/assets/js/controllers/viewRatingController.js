  angular.module('app.controllers')
     .controller('viewRatingCtrl', function(ratings,$uibModal, $rootScope, $scope, $state, $stateParams, $feathers) {
            
                $scope.ratings = ratings
                $scope.ratingValue =0 
          $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
        }
        $scope.setRating= function(rating){
          console.log('the rating', rating)
          $scope.theRating = rating
          if(rating.ratingType =='public-assessor'){
            $scope.ratingValue = rating.score
          }
          console.log('final scope',$scope)
        }
        $scope.showRating = function(rating){
          $uibModal.open({
            controller:'viewRatingModalCtrl',
            size:'lg',
            templateUrl:'modules/modals/publicrating.html',
            resolve:{
              rating: function(){
                return rating
              }
            }
          })
        }

      })