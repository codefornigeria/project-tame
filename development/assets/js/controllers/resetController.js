angular.module('app.controllers')
     .controller('resetCtrl', function( $scope, $rootScope, $state, $stateParams, $feathers, $auth,LocalService,toastr) {
       
   var authManagement = new AuthManagement($feathers)
          console.log('auth', AuthManagement)
    
        $scope.resetPassword = function(valid) {
            if(!valid){
                return
            }
            
            authManagement.sendResetPwd($scope.user,
                    {preferredComm: 'email'}).then(function(result){
                        console.log('reset result',result)
                    }).catch(function(err){
                        console.log('reset error',err)
                             toastr.error(err.message);

                    })
        }
        
        $scope.backToLogin = function(){
            $state.go('login')
        }  

          
      })