angular.module('app.controllers')
  .controller('verifyCtrl', function (verifyStatus,
    $scope, $rootScope, $state, $stateParams,
    $feathers, $auth, AuthService, LocalService, $anchorScroll, $location, toastr) {

    console.log($stateParams)
    $scope.action = 0
    if ($stateParams.action == "1") {
      console.log('active called')
      $scope.action = 1
    }
    if (verifyStatus) {

      toastr.success('Your account has been verified please login now.');
    }


    $scope.resetToken = $stateParams.token;
    $scope.active = $stateParams.token == 'newaccount' ? 1 : 0
    $scope.user = {}
    $scope.signup_data = {}
    $scope.registered = false
    var authManagement = new AuthManagement($feathers)

    $scope.logout = function () {
      $feathers.logout().then(function (params) {
        console.log(params);
        console.log("Logged out!!")
        $state.go('home')
      });
    };

    $scope.authenticate = function (provider) {
      if (provider == 'facebook') {
        $auth.authenticate(provider).then(function (response) {
          console.log('response ===', response);
          LocalService.set(feathers - jwt, response["!#access_token"])
          $feathers.authenticate({
            strategy: 'facebook-token',
            access_token: response["!#access_token"]
          }).then(function (response) {
            console.log('facebook token response', response)
          }).catch(function (err) {
            console.log('facebook token error', err)
          })
        }).catch(function (error) {
          console.log(error);
        });
      }

      if (provider == 'linkedin') {
        $auth.authenticate(provider).then(function (response) {
          console.log('response===', response);
        }).catch(function (error) {
          console.log(error);
        });
      };

      if (provider == 'twitter') {
        $auth.authenticate(provider).then(function (response) {
          console.log('response ===' + response);
        }).catch(function (error) {
          console.log(error);
        })
      }

      // if (provider == '')
    };

    $scope.login = function () {
      console.log(' the user', $scope.user)
      $scope.alert = false;
      $scope.user.strategy = 'local'
      console.log(' the user', $scope.user)
      authManagement.authenticate($scope.user.email, $scope.user.password, (err, res) => {
        console.log('the error', err.message)
        console.log('theresponse', res)
        if (err) {
          $scope.$apply(function () {
            if (err.code) {
              toastr.error('Incorrect username and/or password');

            } else {
              toastr.error(err.message);

            }

            $scope.error = {
              type: 'danger',
              message: err.message
            }
          })
        }


        if (res) {
          console.log('user is verified')
          $state.go('dashboard')
        }
      })

    };

    $scope.register = function () {
      console.log(' sogin', $scope.signup_data)

      AuthService.signUp($scope.signup_data).then(function (res) {
        console.log(res);
        $scope.$apply(function () {
          $scope.registered = true
        })
      }).catch(function (err) {
        $scope.$apply(function () {
          $scope.registered = false
        })
        console.log(err.toJSON());

      })
    }

    $scope.forgotPassword = function (valid) {

      if (!valid) {
        return // confirm email is entered
      }

    }

    $scope.confirmPassword = function () {

    }
  })