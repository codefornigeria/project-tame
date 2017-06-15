angular.module('app.controllers')
     .controller('loginCtrl', function(user,
      $scope, $rootScope, $state, $stateParams,
       $feathers, $auth,AuthService,LocalService,$anchorScroll , $location) {
         console.log('auth service', AuthService)
          if (user) {
              $state.go('ratings')
          }

          $scope.signup_data={}
          $rootScope.user = user
          $scope.registered=false
          var authManagement = new AuthManagement($feathers)
          console.log('auth', AuthManagement)
          $scope.gotoLogin = function() {
      // set the location.hash to the id of
      // the element you wish to scroll to.
      $location.hash('signin');

   
      $anchorScroll();
    };
       $scope.gotoSignup = function() {
    $location.hash('account');

   
      $anchorScroll();
    }
          $scope.logout = function() {
              $feathers.logout().then(function(params) {
                  console.log(params);
                  console.log("Logged out!!")
                  $state.go('home')
              });
          };

          $scope.authenticate = function(provider) {
            if (provider == 'facebook') {
              $auth.authenticate(provider).then(function(response){
                console.log('response ===' , response);
                LocalService.set(feathers-jwt ,response["!#access_token"])
                $feathers.authenticate({
                      strategy: 'facebook-token',
                      access_token: response["!#access_token"]
                  }).then(function(response){
                    console.log('facebook token response', response)
                  }).catch(function(err){
                    console.log('facebook token error', err)
                  })
              }).catch (function(error){
                console.log(error);
              });
            }

            if (provider == 'linkedin') {
              $auth.authenticate(provider).then(function(response){
                console.log('response===' ,response);
              }).catch(function(error){
                console.log(error);
              });
            };

            if (provider == 'twitter') {
              $auth.authenticate(provider).then(function(response){
                console.log('response ===' + response);
              }).catch(function(error){
                console.log(error);
              })
            }

            // if (provider == '')
          };

          $scope.login = function() {
            console.log(' the user',$scope.user)
              $scope.alert = false;
              $scope.user.strategy = 'local'
                console.log(' the user',$scope.user)
          
              $feathers.authenticate($scope.user).then(function(res) {
                  console.log(res);

                  $scope.$apply(function() {
                      $scope.error = false
                      $scope.alert = {
                          type: 'success',
                          message: 'Login successful'
                      };
                  })
                  if (res) {
                      // user logged in and user is verified
                      console.log('user is verified')
                      $state.go('ratings')
                  }
              }).catch(function(err) {
                  console.log(err);
                  $scope.$apply(function() {
                      $scope.error = {
                          type: 'danger',
                          message: 'Email or password is not correct'
                      }
                  })
              })
          };

          $scope.register = function() {
            console.log(' sogin',$scope.signup_data)
          
              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);
                    $scope.$apply(function() {
                  $scope.registered= true
                    })
              }).catch(function(err) {
                        $scope.$apply(function() {
                  $scope.registered= false
                    })
                  console.log(err.toJSON());

              })
          }
      })