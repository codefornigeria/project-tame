angular.module('app.controllers')
  .controller('requestCtrl', function (user,entities,
    $scope, $rootScope, $state, $stateParams,
    $feathers, $auth, AuthService, LocalService, $anchorScroll, $location, toastr) {

    console.log($stateParams)
    $scope.requestType = $stateParams.type
    $scope.request = {assessorType:$stateParams.type}

  
    
    if(!user){
             $state.go('login')
         }
          $rootScope.user = user
         $rootScope.isLoggedIn  = $rootScope.user ? true:false
    $scope.entities = entities
    $scope.registered = false
    var authManagement = new AuthManagement($feathers)

    $scope.logout = function () {
      $feathers.logout().then(function (params) {
        console.log(params);
        console.log("Logged out!!")
        $state.go('home')
      });
    };
   
          $scope.submitRequest = function() {
              console.log('request data', $scope.request)
              // var requestService = $feathers.service('request')
              //   requestService.create($scope.request).then(function(requestResult) {
              //         $scope.$apply(function() {
              //             console.log('result from rating', requestResult)
              //             $scope.requestResult = requestResult

              //             $scope.requestCompleted = true
              //         })
              //     }).catch(function(err) {
              //          $scope.requestCompleted = false
              //         console.log('ratin error', err)
              //     })
                
          }
          
  
  })