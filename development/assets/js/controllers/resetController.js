angular.module('app.controllers')
    .controller('resetCtrl', function ($scope, $rootScope, $state, $stateParams, $feathers,
        $auth, LocalService, toastr, $timeout) {
            $scope.showNewPassword = false
        $scope.resetToken = $stateParams.token;
        console.log($scope)
        var authManagement = new AuthManagement($feathers)

        if ($scope.resetToken) {
            $scope.showNewPassword = true

        }
        console.log('auth', AuthManagement)

        $scope.resetPassword = function (valid) {
            if (!valid) {
                return
            }

            authManagement.sendResetPwd($scope.user,
                { preferredComm: 'email' }).then(function (result) {
                    console.log('reset result', result)
                    toastr.success('your password verification tokenhas been sent to your email address ')
                }).catch(function (err) {
                    console.log('reset error', err)
                    toastr.error(err.message);

                })
        }

        $scope.changePassword = function (valid) {
               if (!valid) {
                return
            }
           
            authManagement.resetPwdLong($scope.resetToken,
                $scope.newPassword).then(function (result) {
                    toastr.success('Your password reset was successful.')
                    $timeout(function () {
                        $scope.backToLogin()
                    }, 3000)
                }).catch(function (err) {
                    console.log(err)
                    toastr.error('Your password reset failed.')
                })

        }

        $scope.backToLogin = function () {
            $state.go('login')
        }


    })