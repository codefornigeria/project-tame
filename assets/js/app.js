
angular.module('app', [
    'ui.router',
    'ngFeathers',
    'ngAnimate',
    'restangular',
    'ui.bootstrap',
    'app.controllers',
    'app.services',
    'app.config',
    'app.directives',
    'chart.js',
    'angularUtils.directives.dirDisqus',
    'angular.filter',
    'angular-carousel'

    ])
    .run(function ($rootScope, $state, $stateParams, $location, $window, LocalService) {
              $rootScope.currentUser = {
                  isLoggedIn: LocalService.get('feathers-jwt')
              }
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
          //         $("#ui-view").html("");
          //         $(".page-preloading").removeClass('hidden');
          // //code state routing
          //   // If it's a parent state, redirect to it's child
          //         if (toState.redirectTo) {
          //             event.preventDefault();
          //             var params = toParams;
          //             if (!_.isEmpty(fromParams)) _.extend(toParams, $location.search());
          //             $state.go(toState.redirectTo, params);
          //             return;
          //         }
        })
        $rootScope.$on('$stateChangeSuccess', function() {
        //  $(".page-preloading").addClass('hidden');
        });
          $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams) {
              event.preventDefault();
              // console.log(event);
              // console.log(toState);
              // console.log(toParams);
              // console.log(fromState);
              // console.log(fromParams);

              // $(".page-preloading").addClass('hidden');
          });
    })
.config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'ChartJsProvider', '$locationProvider','$feathersProvider','Config',
  function($stateProvider, $urlRouterProvider, RestangularProvider, ChartJsProvider, $locationProvider,$feathersProvider,Config) {
    $feathersProvider.setEndpoint(Config.api)

   // You can optionally provide additional opts for socket.io-client
   $feathersProvider.setSocketOpts({
     transports: ['websocket']
   })

   // true is default; set to false if you like to use REST
   $feathersProvider.useSocket(false)
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
        controller: 'appCtrl',
        resolve:{
          user: function($q,$feathers,$state,LocalService){
              //  authManagement  :
            //  var token = LocalService.get('feathers-jwt')
            return   $feathers.authenticate().then(function(res){
                console.log('auth success', res)
                return res.data
              }).catch(function(err){
                console.log('non user', err)
                return false

              })

          }
        },

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
        resolve:{
          user: function($q,$feathers,$state,LocalService){
              //  authManagement  :
            //  var token = LocalService.get('feathers-jwt')
            return   $feathers.authenticate().then(function(res){
                console.log('auth success', res)
                return res.data
              }).catch(function(err){
                return null

              })

          }
        },
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
      .state('login', {
          url: '/login',
          templateUrl: 'modules/login.html',
          resolve:{
            user: function($q,$feathers,$state,LocalService){
                //  authManagement  :
              //  var token = LocalService.get('feathers-jwt')
              return   $feathers.authenticate().then(function(res){
                  console.log('auth success', res)
                  return res.data
                }).catch(function(err){
                  return null

                })

            }
          },
          controller: 'loginCtrl'
      })
      .state('logout', {
          url: '/logout',
          templateUrl: 'modules/login.html',
          resolve:{
            user:function($q, $feathers){
              return $feathers.logout().then(function(res){
                console.log('--logging out user----')
                return null
              })
            }
          },
          controller: 'loginCtrl'
      })

      .state('verify-user', {
          url: '/verify?token',
          templateUrl: 'modules/login.html',
          controller: 'loginCtrl' ,
          resolve:{
            verifyStatus: function($stateParams , $feathers){
                var authManagementService = $feathers.service('authManagement')
                  return authManagementService.create({
                    action:'verifySignupLong',
                    value: $stateParams.token
                  }).then(function(verified){
                    console.log('showing verified status', verified)
                    return  verified
                  })

            }
          }
      })

      .state('register', {
          url: '/register',
          templateUrl: 'modules/register.html',
          controller: 'registerCtrl'
      })


      $urlRouterProvider.otherwise('/404')
  }])
