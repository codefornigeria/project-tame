angular.module('app.controllers')
     .controller('resetCtrl', function( $scope, $rootScope, $state, $stateParams, $feathers, $auth,LocalService) {
       

        $scope.resetPassword = function() {
           
        }
        
        $scope.backToLogin = function(){
            $state.go('login')
        }  

          
      })