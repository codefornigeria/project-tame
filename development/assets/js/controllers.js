  angular.module('app.controllers', [])

      .factory('API', ['Restangular', function(Restangular) {
          return Restangular.withConfig(function(RestangularConfigurer) {
              RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
          });
      }])
     
    .controller('compareCtrl', function($scope, Restangular, $state, $stateParams) {
          Restangular.one('project').get({
              matched: false
          }).then(function(response) {
              $scope.projects = response;
          })

          $scope.selectProject = function() {
              $scope.project = $scope.match.project.district.state.id;
              Restangular.one('person').get({
                  state: $scope.project
              }).then(function(response) {
                  $scope.persons = response;
              }, function(error) {})
          }

          $scope.matchProject = function() {
              $scope.match.project = $scope.match.project.id;
              $scope.match.person = $scope.match.person.id;
              // console.log($scope.match)
              Restangular.all('match-project').post($scope.match).then(function(response) {
                  console.log('matched')
                  $state.reload();
              })
          }
      })
      .controller('registerCtrl', function($scope, $state, $stateParams, $feathers, AuthService, LocalService) {
          $scope.userRegistered = false

          $scope.checkPassword = function(){
            if ($scope.signup_data.password != $scope.signup_data.cpassword){
                  $scope.passwordError = {
                      type: 'danger',
                      message: 'Ensure You Confirm Your Password'
                  };
                  $scope.registerForm.cpassword.$invalid = false;
                  console.log($scope.registerForm);
            }else {
                  $scope.registerForm.cpassword.$invalid = true;
            }
          }
          $scope.register = function() {

              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);
                  $scope.$apply(function() {
                      $scope.registerData = res
                      $scope.userRegistered = true
                  })

              }).catch(function(err) {
                  $scope.userRegistered = false
                   console.error('Error authenticating!', err)
                   console.log(typeof err);
                   console.log(Object.keys(err));
                   console.log(err.code);

                   if (err.code == 409) {
                     $scope.$apply(function() {
                         $scope.error = {
                             type: 'danger',
                             message: 'Email has been taken. Please use another email address'
                         }
                     })
                   }
                  // console.log(err.match(/Error: E11000 duplicate key error index\d\i/));
              })
          }
      })

      .controller('loginCtrl', function(user, $scope, $rootScope, $state, $stateParams, $feathers, $auth,LocalService) {
          if (user) {
              $state.go('ratings')
          }
          $rootScope.user = user

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
                //LocalService.set('satellizer_token' , response.!#access_toke)
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
              $scope.alert = false;
              $scope.user.type = 'local'
              $feathers.authenticate($scope.user).then(function(res) {
                  console.log(res);

                  $scope.$apply(function() {
                      $scope.error = false
                      $scope.alert = {
                          type: 'success',
                          message: 'Login successful'
                      };
                  })
                  if (res && res.data.isVerified) {
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
            return
              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);

              }).catch(function(err) {

                  console.log(err);

              })
          }
      })
      .controller('verifyCtrl', function($scope, $state, $stateParams, $feathers) {

      })
