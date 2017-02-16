
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
      url: '/',
      templateUrl: 'modules/reports.html',
      controller: 'appCtrl',
    })
    .state('search', {
      url: '/search',
      templateUrl: 'modules/search.html',
      controller: 'appCtrl',
    })

      
      $urlRouterProvider.otherwise('/')  
  }])

