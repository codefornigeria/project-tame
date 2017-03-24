  angular.module('app.services', [])
  .factory('AuthService', function($q, $feathers, $rootScope){
  return {
    login: function(user) {
      return $feathers.authenticate({
        type: 'local',
        email: user.username,
        password: user.password
      })

    },
    signUp: function(signUpData){
        console.log(signUpData);
      var userService = $feathers.service('users')
      return userService.create(signUpData)
    },
    facebookLogin: function() {

    },
    googleLogin: function() {

    }

  }
}).factory('LocalService', function () {
    return {
        get: function (key) {
            return localStorage.getItem(key);
        },
        set: function (key, val) {
            return localStorage.setItem(key, val);
        },
        unset: function (key) {
            return localStorage.removeItem(key);
        }
    }
})
