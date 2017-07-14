  angular.module('app.controllers')
     .controller('ratingsResultCtrl', function(user,rating, $rootScope, $scope, $state, $stateParams, $feathers) {
          
           $scope.rating = rating
           console.log('show rating', rating)
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
      
         $scope.getRating = function(){
              var ratingService = $feathers.service('rating')
          ratingService.get($stateParams.rating).then(function(ratings) {
               console.log('get rating',ratings)
              if (ratings) {
             
                  $scope.$apply(function() {
                      $scope.rating = ratings
                  })
              }
          }).catch(function(err) {
              console.log(err)
          })
          
         }
     
      })