
angular.module('app', [
    'ui.router',
    'ngAnimate',
    'restangular',
    'ui.bootstrap',
    'app.controllers',
    'app.directives',
    'ngMap',
    'ngFileUpload'
    ])

.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider',
  function($stateProvider, $urlRouterProvider, RestangularProvider) {
  RestangularProvider.setBaseUrl('api');

  RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
      if (data.response && data.response.data) {
          var returnedData = data.response.data;
          return returnedData;
      } else {
          return data;
      };
  });
      
    $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'modules/reports.html',
      controller: 'appCtrl',
    })
    .state('reports', {
      url: '/reports/62462972349873',
      templateUrl: 'modules/report.html',
      controller: 'appCtrl',
    })

      
      $urlRouterProvider.otherwise('/home')  
  }])

.factory('locationService', ['$q',function($q) {
    return  {
        getLocation: function(){
            var deferred = $q.defer();

            if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                if(position){
                    var userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    deferred.resolve(userLocation);

                }else{
                   deferred.reject(false)
                }

               return userLocation;
            })
            } else {
                deferred.reject(false)
            }  
            return deferred.promise;
        }
    }
}])
