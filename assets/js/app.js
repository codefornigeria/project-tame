
angular.module('app', [
    'ui.router',
    'ngFeathers',
    'ngAnimate',
    'restangular',
    'ui.bootstrap',
    'app.controllers',
    'app.config',
    'app.directives',
    'chart.js',
    'angularUtils.directives.dirDisqus',
    'angular.filter'
    ])

.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'ChartJsProvider', '$locationProvider','$feathersProvider','Config',
  function($stateProvider, $urlRouterProvider, RestangularProvider, ChartJsProvider, $locationProvider,$feathersProvider,Config) {
    $feathersProvider.setEndpoint(Config.api)

   // You can optionally provide additional opts for socket.io-client
  //  $feathersProvider.setSocketOpts({
  //    path: '/ws/'
  //  })

   // true is default; set to false if you like to use REST
   $feathersProvider.useSocket(true)
      $locationProvider.hashPrefix('!');
      ChartJsProvider.setOptions({ colors : [ '#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
      RestangularProvider.setBaseUrl('https://budget-datakit-api.herokuapp.com/');

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
        url: '',
        templateUrl: 'modules/home.html',
        controller: 'appCtrl'
    })
    .state('sector', {
        url: '/sector',
        templateUrl: 'modules/sector.html',
        controller: 'sectorCtrl'
    })
    .state('scheme', {
        url: '/scheme?sector',
        templateUrl: 'modules/scheme.html',
        controller: 'schemeCtrl'
    })
    .state('ratings', {
        url: '/ratings',
        templateUrl: 'modules/ratings.html',
        controller: 'ratingsCtrl'
    })
      .state('results', {
          url: '/search?query',
          templateUrl: 'modules/search-result.html',
          controller: 'resultCtrl'
      })
      .state('entity', {
          url: '/entity?query',
          templateUrl: 'modules/entity.html',
          controller: 'entityCtrl'
      })
      .state('compare', {
          url: '/compare',
          templateUrl: 'modules/compare.html',
          controller: 'compareCtrl'
      })

      $urlRouterProvider.otherwise('/404')
  }])
