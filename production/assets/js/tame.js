angular.module("app.config", [])
.constant("Config", {"api":"https://tame-api.herokuapp.com","facebookAppId":"1503484316624984","googleMapKey":"AIzaSyBpzQ8_m8SrgbbIk0X2o5NVTyg1XdFgSOk"});

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
    'angular-carousel',
    'angular-loading-bar',
    'toastr',
    'satellizer'
])
    .run(function ($rootScope, $state, $stateParams, $location, $window, LocalService) {
        $rootScope.currentUser = {
            isLoggedIn: LocalService.get('feathers-jwt')
        }
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
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
        $rootScope.$on('$stateChangeSuccess', function () {
            //  $(".page-preloading").addClass('hidden');
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
            event.preventDefault();
            // console.log(event);
            // console.log(toState);
            // console.log(toParams);
            // console.log(fromState);
            // console.log(fromParams);

            // $(".page-preloading").addClass('hidden');
        });
    })
    .config(function (toastrConfig) {
        angular.extend(toastrConfig, {
            autoDismiss: true,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: true,
            positionClass: 'toast-top-center',
            preventDuplicates: true,
            preventOpenDuplicates: true,
            target: 'div.login-wrap'
        });
    }).config(['$stateProvider', '$urlRouterProvider', 'RestangularProvider', 'ChartJsProvider', '$locationProvider', '$feathersProvider', 'Config', 'cfpLoadingBarProvider', '$authProvider',
        function ($stateProvider, $urlRouterProvider, RestangularProvider, ChartJsProvider, $locationProvider, $feathersProvider, Config, cfpLoadingBarProvider, $authProvider) {
            // cfpLoadingBarProvider.includeBar = true;
            cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
            //  cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Custom Loading Message...</div>';

            $feathersProvider.setEndpoint(Config.api)

            // You can optionally provide additional opts for socket.io-client
            $feathersProvider.setSocketOpts({
                transports: ['websocket']
            })

            // true is default; set to false if you like to use REST
            $feathersProvider.useSocket(false)
            $locationProvider.hashPrefix('!');
            ChartJsProvider.setOptions({
                colors: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']
            });
            RestangularProvider.setBaseUrl('https://budget-datakit-api.herokuapp.com/');

            RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
                if (data.response && data.response.data) {
                    var returnedData = data.response.data;
                    return returnedData;
                } else {
                    return data;
                };
            });

            // $authProvider.loginUrl = '/auth/login';
            $authProvider.facebook({
                // clientId: '1294347140661397',
                clientId: '643775069155130',
                responseType: "token",
                authorizationEndpoint: 'https://www.facebook.com/v2.9/dialog/oauth',
                popupOptions: {
                    width: 580,
                    height: 400
                },
                url: 'https://tame-api.herokuapp.com/auth/facebook',
                //  redirectUri: 'http://local.test.com:3000/#!/login',
            });

            $authProvider.linkedin({
                clientId: '77cexhoj2v08em',
                url: '/auth/linkedin',
                authorizationEndpoint: 'https://www.linkedin.com/oauth/v2/authorization',
                redirectUri: 'http://local.test.com:4930/'
            });

            $authProvider.twitter({
                clientId: 'wsxw36KBg1QqbVd3RDcGSYw6h',
                url: '/auth/twitter',
                authorizationEndpoint: 'https://api.twitter.com/oauth/authenticate',
                redirectUri: window.location.origin,
                oauthType: '1.0',
                popupOptions: {
                    width: 495,
                    height: 645
                }
            });

            $stateProvider
                .state('home', {
                    url: '',
                    templateUrl: 'modules/home.html',
                    controller: 'appCtrl',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(response => {
                                console.log('Authenticated!', response);
                                return $feathers.passport.verifyJWT(response.accessToken);
                            })
                                .then(payload => {
                                    console.log('JWT Payload', payload);
                                    return $feathers.service('users').get(payload.userId);
                                })
                                .then(user => {
                                    return user
                                })
                                .catch(function (error) {
                                    console.error('Error authenticating!', error);
                                });

                        },
                        schemes: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            return $feathers.service('scheme').find({
                              
                            }).then(function (schemes) {
                                if (schemes.data.length) {
                                    console.log('test schemes', schemes.data)
                                    return schemes.data
                                }
                            }).catch(function (err) {
                                console.log(err)
                            })
                        },

                        entities: function ($q, $feathers, $state, LocalService) {
                            return $feathers.service('entity').find({

                            }).then(function (entities) {
                                if (entities.data.length) {
                                    console.log('test entities', entities.data)
                                    return entities.data

                                }
                            }).catch(function (err) {
                                console.log(err)
                            })

                        },

                        ratings: function ($q, $feathers, $state, LocalService) {
                            return $feathers.service('rating').find({
                                query: {
                                    $populate: {
                                        path: 'scheme entity',
                                        select: 'name  _id',
                                        options: {
                                            limit: 5
                                        },

                                    },
                                    $limit: 5
                                }
                            }).then(function (ratings) {
                                if (ratings.data.length) {
                                    console.log('test ratings', ratings.data)
                                    return ratings.data

                                }
                            }).catch(function (err) {
                                console.log(err)
                            })
                        }



                    },

                })
                .state('index', {
                    url: '/',
                    templateUrl: 'modules/home.html',
                    controller: 'appCtrl',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(response => {
                                console.log('Authenticated!', response);
                                return $feathers.passport.verifyJWT(response.accessToken);
                            })
                                .then(payload => {
                                    console.log('JWT Payload', payload);
                                    return $feathers.service('users').get(payload.userId);
                                })
                                .then(user => {
                                    return user
                                })
                                .catch(function (error) {
                                    console.error('Error authenticating!', error);
                                });

                        },
                        schemes: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            return $feathers.service('scheme').find({
                                query: {
                                   
                                }
                            }).then(function (schemes) {
                                if (schemes.data.length) {
                                    console.log('test schemes', schemes.data)
                                    return schemes.data
                                }
                            }).catch(function (err) {
                                console.log(err)
                            })
                        },

                        entities: function ($q, $feathers, $state, LocalService) {
                            return $feathers.service('entity').find({

                            }).then(function (entities) {
                                if (entities.data.length) {
                                    console.log('test entities', entities.data)
                                    return entities.data

                                }
                            }).catch(function (err) {
                                console.log(err)
                            })

                        },

                        ratings: function ($q, $feathers, $state, LocalService) {
                            return $feathers.service('rating').find({
                                query: {
                                    $populate: {
                                        path: 'scheme entity',
                                        select: 'name  _id',
                                        options: {
                                            limit: 5
                                        },

                                    },
                                    $limit: 5
                                }
                            }).then(function (ratings) {
                                if (ratings.data.length) {
                                    console.log('test ratings', ratings.data)
                                    return ratings.data

                                }
                            }).catch(function (err) {
                                console.log(err)
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
                    url: '/ratings?ratingType',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(response => {
                                console.log('Authenticated!', response);
                                return $feathers.passport.verifyJWT(response.accessToken);
                            })
                                .then(payload => {
                                    console.log('JWT Payload', payload);
                                    return $feathers.service('users').get(payload.userId);
                                })
                                .then(user => {
                                    return user
                                })
                                .catch(function (error) {
                                    console.error('Error authenticating!', error);
                                });

                        }
                    },
                    templateUrl: 'modules/ratings.html',
                    controller: 'ratingsCtrl'
                })
                .state('request', {
                    url: '/request?action&requestId',
                    resolve:{
                        requestStatus:function($q,$feathers, $state, $stateParams){
                            console.log('state params',$stateParams )
                            return $feathers.service('request').get($stateParams.requestId ,{query:{action:$stateParams.action}}).then(result =>{
                                console.log('the result',result)
                                return result
                                    
                            })
                        }
                    },
                    templateUrl:'modules/request-result.html',
                    controller: 'requestResultCtrl'
                })
                 .state('view-ratings', {
                    url: '/view-ratings',
                    resolve: {
                        
                        ratings: function ($q, $feathers, $state, LocalService) {
                            return $feathers.service('rating').find({
                               
                            }).then(function (ratings) {
                                if (ratings.data.length) {
                                    console.log('view ratings', ratings.data)
                                    return ratings.data

                                }
                            }).catch(function (err) {
                                console.log(err)
                            })
                    }
                    },
                    templateUrl: 'modules/view-ratings.html',
                    controller: 'viewRatingCtrl'
                })
                .state('rating-result', {
                    url: '/rating-result?rating',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(response => {
                                console.log('Authenticated!', response);
                                return $feathers.passport.verifyJWT(response.accessToken);
                            })
                                .then(payload => {
                                    console.log('JWT Payload', payload);
                                    return $feathers.service('users').get(payload.userId);
                                })
                                .then(user => {
                                    return user
                                })
                                .catch(function (error) {
                                    console.error('Error authenticating!', error);
                                });

                        },

                        rating: function ($q, $feathers, $state, $stateParams) {
                            console.log('params', $stateParams.rating)
                            return $feathers.service('rating').get($stateParams.rating)
                                .then(function (ratings) {
                                    console.log('get rating', ratings)
                                    if (ratings) {

                                        return ratings
                                    }
                                    return null
                                }).catch(function (err) {
                                    console.log(err)
                                    return null
                                })
                        }
                    },
                    templateUrl: 'modules/rating-result.html',
                    controller: 'ratingsResultCtrl'
                })
                .state('public-ratings', {
                    url: '/public-ratings',
                    templateUrl: 'modules/public-ratings.html',
                    controller: 'publicRatingsCtrl'
                })
                .state('results', {
                    url: '/search?query',
                    templateUrl: 'modules/search-result.html',
                    controller: 'resultCtrl',
                    resolve:{
                        schemes: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            return $feathers.service('scheme').find({
                                query: {
                                    $populate: {
                                        path: 'sectors antidotes',
                                        select: 'name description _id',
                                        options: {
                                            limit: 5
                                        }
                                    }
                                }
                            }).then(function (schemes) {
                                if (schemes.data.length) {
                                    console.log('test schemes', schemes.data)
                                    return schemes.data
                                }
                            }).catch(function (err) {
                                console.log(err)
                            })
                        },
                    }

                })
                .state('entity', {
                    url: '/entity?query',
                    templateUrl: 'modules/entity.html',
                    controller: 'entityCtrl'
                })
                .state('entityrating', {
                    url: '/entityrating?query',
                    templateUrl: 'modules/entityrating.html',
                    controller: 'entityRatingCtrl'
                })
                .state('compare', {
                    url: '/compare',
                    templateUrl: 'modules/compare.html',
                    controller: 'compareCtrl'
                })
                .state('login', {
                    url: '/login?action',
                    templateUrl: 'modules/login.html',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(function (res) {
                                console.log('auth success again', res)
                                return res.data
                            }).catch(function (err) {
                                return null

                            })

                        }
                    },
                    controller: 'loginCtrl'
                })
                .state('forgotpassword', {
                    url: '/forgotpassword?token',
                    templateUrl: 'modules/forgotpassword.html',

                    controller: 'resetCtrl'
                })
                .state('facebook_auth', {
                    url: '/facebook-auth',
                    controller: 'loginCtrl',

                })
                .state('logout', {
                    url: '/logout',
                    templateUrl: 'modules/login.html',
                    resolve: {
                        user: function ($q, $feathers) {
                            return $feathers.logout().then(function (res) {
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
                    controller: 'verifyCtrl',
                    resolve: {
                        verifyStatus: function ($stateParams, $feathers) {
                            var authManagementService = $feathers.service('authManagement')
                            return authManagementService.create({
                                action: 'verifySignupLong',
                                value: $stateParams.token
                            }).then(function (verified) {
                                console.log('showing verified status', verified)
                                return verified
                            })

                        }
                    }
                })
                .state('request-assessor', {
                    url: '/request-assessor?type',
                    templateUrl: 'modules/request.html',
                    controller: 'requestCtrl',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(response => {
                                console.log('Authenticated!', response);
                                return $feathers.passport.verifyJWT(response.accessToken);
                            })
                                .then(payload => {
                                    console.log('JWT Payload', payload);
                                    return $feathers.service('users').get(payload.userId);
                                })
                                .then(user => {
                                    return user
                                })
                                .catch(function (error) {
                                    console.error('Error authenticating!', error);
                                });

                        },
                        entities: function ($q, $feathers, $state, LocalService) {
                            return $feathers.service('entity').find({

                            }).then(function (entities) {
                                if (entities.data.length) {
                                    console.log('test entities', entities.data)
                                    return entities.data

                                }
                            }).catch(function (err) {
                                console.log(err)
                            })

                        },
                    }
                })
                .state('register', {
                    url: '/register',
                    templateUrl: 'modules/register.html',
                    controller: 'registerCtrl'
                })
                .state('dashboard', {
                    url: '/dashboard',
                    templateUrl: 'modules/dashboard.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        user: function ($q, $feathers, $state, LocalService) {
                            //  authManagement  :
                            //  var token = LocalService.get('feathers-jwt')
                            return $feathers.authenticate().then(response => {
                                console.log('Authenticated!', response);
                                return $feathers.passport.verifyJWT(response.accessToken);
                            })
                                .then(payload => {
                                    console.log('JWT Payload', payload);
                                    return $feathers.service('users').get(payload.userId);
                                })
                                .then(user => {
                                    return user
                                })
                                .catch(function (error) {
                                    console.error('Error authenticating!', error);
                                });

                        },
                    }
                })


            $urlRouterProvider.otherwise('/404')
        }
    ])

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
          
              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);

              }).catch(function(err) {

                  console.log(err);

              })
          }
      })
      .controller('verifyCtrl', function($scope, $state, $stateParams, $feathers) {

      })

angular.module('app.directives', [])

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        })
    };
})

.directive('schemeCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-card.html"
    }
})
.directive('ratingCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/directives/ratingcard.html",
       replace:true,
        link:function(scope,elem,attrs){
            console.log(scope)
        }
    }
})
.directive('ratingBadge' , function(){
  return {
    restrict: 'EA',
    replace:true,
       templateUrl: "modules/directives/ratingcard.html",
     scope:{
      rating:'='
    },
    link:function(scope, elem, attrs){
        console.log('bbadge', scope.rating)
      if(scope.rating.score <= 2.5){
        scope.badge = "red"
      }
      if(scope.rating.score > 2.5 && scope.rating.score <=4){
        scope.badge = "amber"
      }
      if(scope.rating.score > 4){
        scope.badge = "green"
      }
    }
  }
})
.directive('entityBadge' , function(){
  return {
    restrict: 'EA',
    replace:true,
       templateUrl: "modules/directives/entitycard.html",
    
    link:function(scope, elem, attrs){
        console.log('the scope',scope)
    }
  }
})
.directive('bootstrapWizard', function(){
    return {
        restrict:'EA',
     replace:true,
       templateUrl: "modules/directives/ratingwizard.html",
        link: function(scope,elem, attrs){
            // $timeout(function(){
            //     console.log('timeout called', 4000)
            // })
            console.log('the firective', scope)
             scope.$watchCollection('schemerater',function(newVal,oldVal){
                console.log('oldval', oldVal)
                console.log('newval', newVal)
                if(newVal.length){
                 elem.bootstrapWizard({onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;
            var $percent = ($current/$total) * 100;
            elem.find('.bar').css({width:$percent+'%'});
          }})
          
                }
            })
        }
    }
})
.directive('starRating', function () {
    return {
        restrict: 'EA',
        template:'<div class="rating-point">'+
                 '<button type="button"  ng-click=setValue(1)>1</button>'+
                 '<button type="button" ng-click=setValue(2)>2</button>'+
                 '<button type="button" ng-click=setValue(3)>3</button>'+
                 '<button type="button"  ng-click=setValue(4)>4</button>'+
                 '<button type="button" ng-click=setValue(5)>5</button>'+
               '</div>',
      
       
        link: function (scope, elem, attrs) {
            console.log('showing', scope)
            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.setValue = function (index) {
                   elem.bind('click', function(e){
                scope.ratin.score = index;
                  $(e.target).siblings().removeClass('active')
                $(e.target).addClass('active')
                // scope.onRatingSelected({
                //     rating: index + 1
                // });
            })
               

            // scope.$watch('ratingValue', function (oldVal, newVal) {
            //     if (newVal) {
            //         updateStars();
            //     }
            // });
        
    }
        }
    }
}).directive('userType', function(){
    return {
        restrict:'EA',
         templateUrl: "modules/directives/usertype.html",
         link: function(scope,elem,attrs){
             elem.bind('click', function(e){
                 console.log('data', $(e.target).data('usertype'))
                 $(e.target).siblings().removeClass('btn-primary').addClass('btn-secondary')
                 if( $(e.target).hasClass('btn-secondary')){
                     
                      $(e.target).removeClass('btn-secondary').addClass('btn-primary')
                 }else  if( $(e.target).hasClass('btn-primary')){
                      $(e.target).removeClass('btn-primary').addClass('btn-secondary')
                 }
                 scope.$apply(function(){
                     scope.signup_data.userType = $(e.target).data('usertype')
                 })
               })
         
         }
    }
})
.directive('entityCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/entity-card.html"
    }
})
.directive('schemeEntityCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-entity-card.html"
    }
})
.directive('schemeAntidoteCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-antidote-card.html"
    }
})
.directive('schemeEffectCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-effect-card.html"
    }
})
.directive('personCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/person-card.html"
    }
})
.directive('projectCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/project-card.html"
    }
})

.directive('projectLoader', function () {
	return {
        restrict: 'EA',
		template: '<div class="overlay" ng-if="!project"><div class="spinner"><div class="spinner__item1"></div><div class="spinner__item2"></div><div class="spinner__item3"></div><div class="spinner__item4"></div></div></div>'
	}
})

.directive('loader', function () {
	return {
        restrict: 'EA',
		template: '<div class="overlay" ng-if="searching"><div class="spinner"><div class="spinner__item1"></div><div class="spinner__item2"></div><div class="spinner__item3"></div><div class="spinner__item4"></div></div></div>'
	}
})

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

angular.module('app.controllers')
    .controller('appCtrl', function (user,schemes,entities, ratings ,$scope, $rootScope, Restangular, $state, $stateParams, $feathers) {
         $scope.showRater=false
         $scope.ratin={ratingType:'public-assessor'}
         $rootScope.user = user
         $scope.searchKeyword ={};
         $scope.schemes = schemes
         $scope.entities = entities
         $scope.ratings = ratings
        $scope.sectorSplit = function (val) {
            //  console.log(val)
            return val.name

        }
        console.log('the user', user)
        $rootScope.isLoggedIn  = $rootScope.user ? true:false
        $scope.checkUser = function () {
            console.log('checking if user is logged in')
        }
         console.log('the scope', $scope)
       
        $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
        }
          $scope.search = function() {
              console.log('keywords',$scope.searchKeyword)
            
            $state.go('results', {
        query: $scope.searchKeyword.keyword
  })
          }
       
      $scope.toResult = function(){
            $scope.showRater=false
        }
   $scope.ratingFunc =function(){
            var ratingsService = $feathers.service('rating')
        ratingsService.find({
            query: {
                $populate: {
                    path: 'scheme entity',
                    select: 'name  _id',
                    options: {
                        limit: 5
                    },
            
                },
                      $limit:5  
            }
        }).then(function (ratings) {
            if (ratings.data.length) {
                console.log('test ratings', ratings.data)
                $scope.$apply(function () {
                    $scope.ratings = ratings.data
                })
            }
        }).catch(function (err) {
            console.log(err)
        })
   }
  

        $scope.options = {
            tooltipEvents: [],
            showTooltips: true,
            tooltipCaretSize: 0,
            onAnimationComplete: function () {
                this.showTooltip(this.segments, true);
            },
        };


        $scope.showResult = function (person) {
            $state.go('entity', {
                query: person._id
            })
        }
        $scope.showRagResult = function (rating) {
            $state.go('entityrating', {
                query: rating._id
            })
        }
        $scope.ratingValue={}
        $scope.publicRating= function(entity){
          
        
                       
            $scope.showRater=true
        }
     
        $scope.submitRating= function(valid){
            if(!valid){
                return
            }
              $scope.showRater=false
                  var ratingService = $feathers.service('rating')
                
                      ratingService.create($scope.ratin).then(function(ratinResult) {
                          $scope.$apply(function() {
                             $scope.ratingFunc()
                            
                          })
                      }).catch(function(err) {
                          console.log('ratin error', err)
                      })
                
        }
        
    })
  angular.module('app.controllers')
     .controller('dashboardCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {

         if(!user){
             $state.go('login')
         }
          $rootScope.user = user
          $scope.schemerater =[]
         $rootScope.isLoggedIn  = $rootScope.user ? true:false
         $scope.showRatingPage =false
         $schemeLoaded=false
         console.log('show rootScope', $rootScope)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: [],
              creator : user._id
          }
          $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
        }
          console.log('showing organization type', user)
          $scope.nextSlideU = function(scheme, slide, schemeLength , index) {
            console.log('scheme length', schemeLength)
            console.log('ndec' , index)
              var errorState = false

                  if (scheme.score >= 0) {
                      scheme.error = false

                  } else {
                      scheme.error = true,
                          errorState = true
                  }

                  console.log('showing scheme state', scheme )
              if (!errorState && schemeLength !=(index+1)) {
                  slide()
              }
          }
          $scope.canSubmit = true
          $scope.prevSlideU = function(slide) {
              slide()
          }
          if (!user) {
              $state.go('login')
              return
          }


          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }
          $scope.searchOrganization = function() {
              $scope.sectorsearching = false;
                 $scope.orgsearching = true;
          
             var inputMin = 1;
              $scope.ratin.organizationSelected = false

              if ($scope.ratin.organization && $scope.ratin.organization.length >= inputMin) {
                var entityService = $feathers.service('entity')
                var entityConfig;
                console.log('showing organization type', user)
                if(user.userType == 'independent-assessor'){
                  entityconfig ={
                   }
                }else{
                  entityConfig ={
                
                  }
                }
                  entityService.find(entityConfig).then(function(entities) {
                      console.log('returnd entit', entities)
                      if (entities.data.length) {
                          console.log('showing entities', entities.data)
                          $scope.$apply(function() {
                              $scope.orgSearch = true;
                            $scope.orgs = entities.data



                          })
                      }
                  }).catch(function(err) {
                      console.log('entity search error',err)
                      $scope.orgSearch = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }

          $scope.searchSector = function() {
              var inputMin = 1;
                $scope.sectorsearching = true;
                   $scope.orgsearching = false;
              console.log('search sector called')
              if ($scope.ratin.sector && $scope.ratin.sector.length >= inputMin) {
                  $scope.ratin.sectorSelected = false

                  var sectorService = $feathers.service('sector')
                  sectorService.find({

                  }).then(function(sectors) {

                      if (sectors.data.length) {
                          console.log('showing sectors', sectors.data)
                          $scope.$apply(function() {
                              $scope.searching = true;
                              $scope.results = sectors.data


                          })
                      }
                  }).catch(function(err) {
                      console.log(err)
                      $scope.searching = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }
          $scope.addSector = function(result) {
              $scope.ratin.sectorId = result._id;

              $scope.ratin.sector = result.name;
              $scope.ratin.sectorSelected = true
              //  $scope.results = []
              $scope.searching = false;
              $scope.sectorsearching =false
        }
          $scope.addOrganization = function(result) {
              console.log('rating now',$scope.ratin)
              $scope.ratin.organizationId = result._id;
                $scope.ratin.entity = result._id;

              $scope.ratin.organization = result.name;
              $scope.orgSearch = false;
              $scope.ratin.organizationSelected = true
              $scope.orgsearching=false

          }
          $scope.loadSchemes = function(assessmentData) {
              // load schemes based on assessment data
              console.log('show ratin', $scope.ratin)
             console.log('show user', user)
              $scope.showAssessment = true
             
              if(user.userType =='independent-assessor'){
                  //find  organization  rating ,
                console.log('showing assessor type', user)
                  var ratingService  = $feathers.service('rating')
                  ratingService.find({
                    query:{
                      entity :$scope.ratin.organizationId
                    }
                  }).then(function(rating){
                    console.log('showing rating', rating)
                    if(rating.data.length){
                      // there is an existing rating for this organization
                      $scope.$apply(function(){
                        console.log('rating data' , rating.data[0].ratingData )
                        $scope._rating_id = rating.data[0]._id
                        $scope.ratin = rating.data[0].ratingData
                      })
                    }
                  }).catch(function(err){
                    console.log('rating error', err)
                  })
              }else{
                var schemeService = $feathers.service('scheme')
                schemeService.find({
                    query: {
                        $populate: {
                            path: 'sectors antidotes',
                            select: 'name description _id',
                            options: {
                                limit: 10
                            }
                        },
                        'sectors': $scope.ratin.sectorId,

                    }
                }).then(function(schemes) {
                    console.log('testq schemes', schemes)
                    var raterArray =[]
                     schemes.data.map(function (scheme){
                         scheme.antidotes.map(function(antidote){
                           var rateData ={
                             scheme: scheme.name,
                             schemeId: scheme._id ,
                             antidoteName: antidote.name,
                             antidoteDesc : antidote.description,
                             antidoteId:antidote._id
                           }
                           raterArray.push(rateData)
                         })
                     })
                    $scope.$apply(function() {
                    
                    $scope.schemerater = raterArray
                       $scope.ratin.schemes = schemes.data
                    })
                }).catch(function(err) {
                    console.log(err)
                })
              }


          }
          $scope.rateScheme = function(item, type) {

                      (type) ? item.score = 3: item.score = 0
                      console.log('current item', item)
                  }

          $scope.submitRating = function() {

              var ratingService = $feathers.service('rating')
                if(user.userType =='independent-assessor'){
                  ratingService.create($scope.ratin).then(function(ratinResult) {
                      $scope.$apply(function() {
                          console.log('result from rating', ratinResult)
                          $scope.ratinResult = ratinResult

                          $scope.ratingCompleted = true
                      })
                  }).catch(function(err) {
                      console.log('ratin error', err)
                  })
                }else{
                  console.log('rating data'  , $scope.schemerater)
                  console.log('ratin ' , $scope.ratin)
                  $scope.ratin.ratingData = $scope.schemerater
                  console.log('ratings status ' , $scope.ratin)
                  ratingService.create($scope.ratin).then(function(ratinResult) {
                      $scope.$apply(function() {
                          console.log('result from rating', ratinResult)
                          $scope.ratinResult = ratinResult

                          $scope.ratingCompleted = true
                      })
                  }).catch(function(err) {
                      console.log('ratin error', err)
                  })
                }

          }
          $scope.viewRating = function(){
             $state.go('rating-result',{
                 rating : $scope.ratinResult._id
             })
          }
          $scope.completeRating = function(ratin) {

              // var ratingService = $feathers.service('ratings')
              // ratingService.create(ratin).then(function(storedRating){
              //   $scope.$apply(function(){
              //     $scope.ratingResult = storedRating
              //   })
              // })

              console.log('rating data', ratin)
              $scope.ratingCompleted = true
              $scope.showAssessment = false
          }
          $scope.showScheme = function() {
              var groupService = $feathers.service('groups')
              groupService.find({

              }).then(function(groups) {

                  if (groups.data.length) {
                      console.log('showing groups', groups.data)
                      $scope.$apply(function() {
                          $scope.schemeTypes = groups.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.loadEffect = function() {
              $scope.showEffect = true
              var storyService = $feathers.service('stories')
              storyService.find({}).then(function(stories) {

                  if (stories.data.length) {
                      console.log('showing stories', stories.data)
                      $scope.$apply(function() {
                          $scope.schemeEffects = stories.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.rating = 0;
          $scope.ratings = [{
              current: 1,
              max: 5
          }];

          $scope.getSelectedRating = function(rating) {
              $scope.rating.rate = rating;
          }
          $scope.addRating = function() {
              console.log('final rating', $scope.rating)
              $state.go('scheme')
          }
      })
   angular.module('app.controllers').controller('entityRatingCtrl', function($scope, Restangular, $state, $stateParams, $feathers,$rootScope) {
        console.log('entity ratings page')
          $scope.searchedEntity = $stateParams.query;
          $scope.ratin = {
              schemes: []
          };
          $scope.search = function() {
              if ($scope.searchKeyword) {
                  $state.go('results', {
                      query: $scope.searchKeyword
                  })
                  $scope.searching = true;
                  Restangular.one('search').get({
                      query: $scope.searchKeyword
                  }).then(function(response) {
                      $scope.searching = false;
                      if (response.person == '' && response.project == '') {
                          $scope.notFound = true;
                      } else {
                          $scope.results = response;
                          $scope.persons = $scope.results.person;
                          $scope.projects = $scope.results.project;
                          $scope.total = parseInt($scope.results.person.length) + parseInt($scope.results.project.length);








                          ///////////////////////////////////////////////

                      }
                  }, function(error) {
                      $scope.searching = false;
                      $scope.error = error;
                  });
              }
          }



          $scope.viewEntity = function() {
              if ($scope.searchedEntity) {
                  $scope.searching = true;
                  var ratingService = $feathers.service('ratings')
                  ratingService.get($scope.searchedEntity, {
                      query: {
                          $populate: {
                              path: 'entity , schemes',
                              options: {
                                  limit: 5
                              }
                          }
                      }
                  }).then(function(rating) {
                      console.log('showing rating data', rating)
                      $scope.$apply(function() {
                          $scope.searching = false;
                          $scope.entity = rating;
                          $scope.searchKeyword = rating.name;
                        //  $scope.sectors = scheme.sectors;

                      })
                  }).catch(function(err) {
                      $scope.$apply(function() {
                          $scope.searching = false;

                      })
                  })
                  // Restangular.one('person', $scope.searchedEntity).get().then(function(response){
                  //     $scope.searching = false;
                  //     $scope.entity = response;
                  //     $scope.searchKeyword = response.name;
                  //     $scope.contracts = response.projects;
                  //     $scope.total =  $scope.contracts.length;
                  //  }, function(error){
                  //     $scope.searching = false;
                  //     $scope.error = error;
                  //     console.log(error)
                  // });
              }
          }

          $scope.viewEntity()

          $scope.compare = function(contract) {
              $scope.compareProjects = true;
              $scope.contract = contract;
          }

          $scope.compareProject = function() {
              $scope.closeModal();
              $scope.searching = true;
              console.log($scope.contract);
              Restangular.one('project', $scope.contract.id).get({
                      category: $scope.category
                  })
                  .then(function(response) {
                      $scope.searching = false;
                      $scope.showComparison = true;
                      $scope.similarProjects = response.relatedProjects;
                  })
          }

          $scope.closeComparison = function() {
              $scope.showComparison = false;
          }
          $scope.closeModal = function() {
              $scope.compareProjects = false;
          }
      })
  angular.module('app.controllers').controller('independentRatingsCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {

          $rootScope.user = user
          console.log('show user', user)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: []
          }
          $scope.nextSlideU = function(scheme, slide) {
              var errorState = false
              scheme.antidotes.map(function(antidote) {
                  if (antidote.score >= 0) {
                      antidote.error = false

                  } else {
                      antidote.error = true,
                          errorState = true
                  }
                  return antidote
              })
              if (!errorState) {
                  slide()
              }
          }
          $scope.canSubmit = true
          $scope.prevSlideU = function(slide) {
              slide()
          }
          if (!user) {
              $state.go('login')
              return
          }


          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }
          $scope.searchOrganization = function() {
              var inputMin = 1;
              $scope.ratin.organizationSelected = false

              if ($scope.ratin.organization && $scope.ratin.organization.length >= inputMin) {
                  var entityService = $feathers.service('entities')
                  entityService.find({
                      query: {
                          domains: user.email,
                          assessmentType:'independent'
                      }
                  }).then(function(entities) {
                      console.log('returnd entity')
                      if (entities.data.length) {
                              $scope.$apply(function() {
                              $scope.orgSearch = true;
                              $scope.results = entities.data
                              $scope.orgs = entities.data
                              })
                      }
                  }).catch(function(err) {
                      console.log(err)
                      $scope.orgSearch = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }

          $scope.searchSector = function() {
              var inputMin = 1;
              console.log('search sector called')
              if ($scope.ratin.sector && $scope.ratin.sector.length >= inputMin) {
                  $scope.ratin.sectorSelected = false

                  var sectorService = $feathers.service('sectors')
                  sectorService.find({

                  }).then(function(sectors) {

                      if (sectors.data.length) {
                          console.log('showing sectors', sectors.data)
                          $scope.$apply(function() {
                              $scope.searching = true;
                              $scope.results = sectors.data


                          })
                      }
                  }).catch(function(err) {
                      console.log(err)
                      $scope.searching = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }
          $scope.addSector = function(result) {
              $scope.ratin.sectorId = result._id;

              $scope.ratin.sector = result.name;
              $scope.ratin.sectorSelected = true
              //  $scope.results = []
              $scope.searching = false;
              $scope.searchOrganization()

          }
          $scope.addOrganization = function(result) {
              $scope.ratin.organizationId = result._id;

              $scope.ratin.organization = result.name;
              $scope.orgSearch = false;
              $scope.ratin.organizationSelected = true

          }
          $scope.loadSchemes = function(assessmentData) {
              // load schemes based on assessment data

              $scope.showAssessment = true
              var schemeService = $feathers.service('schemes')
              schemeService.find({
                  query: {
                      $populate: {
                          path: 'sectors antidotes',
                          select: 'name description _id',
                          options: {
                              limit: 10
                          }
                      },
                      'sectors': assessmentData.sectorId,

                  }
              }).then(function(schemes) {
                  console.log('testq schemes', schemes)
                  $scope.$apply(function() {
                     $scope.schemerater = []
                    schemes.data.map(function (scheme){
                        schemes.antidote.map(function(antidote){
                          var rateData ={
                            scheme: scheme.name,
                            schemeId: scheme._id ,
                            antidoteName: antidote.name,
                            antidoteDesc : antidote.description,
                            antidoteId:antidote._id
                          }
                          $scope.schemerater.push(rateData)
                        })
                    })
                    console.log('showing scheme rater', $scope.schemerater)
                      $scope.ratin.schemes = schemes.data
                  })
              }).catch(function(err) {
                  console.log(err)
              })

          }
          $scope.rateScheme = function(scheme, type) {
                      (type) ? item.score = 3: item.score = 0


          }
          $scope.submitRating = function() {
              var ratingService = $feathers.service('ratings')
              ratingService.create($scope.ratin).then(function(ratinResult) {
                  $scope.$apply(function() {
                      console.log('result from rating', ratinResult)
                      $scope.ratinResult = ratinResult

                      $scope.ratingCompleted = true
                  })
              }).catch(function(err) {
                  console.log('ratin error', err)
              })
          }
          $scope.completeRating = function(ratin) {

              // var ratingService = $feathers.service('ratings')
              // ratingService.create(ratin).then(function(storedRating){
              //   $scope.$apply(function(){
              //     $scope.ratingResult = storedRating
              //   })
              // })

              console.log('rating data', ratin)
              $scope.ratingCompleted = true
              $scope.showAssessment = false
          }
          $scope.showScheme = function() {
              var groupService = $feathers.service('groups')
              groupService.find({

              }).then(function(groups) {

                  if (groups.data.length) {
                      console.log('showing groups', groups.data)
                      $scope.$apply(function() {
                          $scope.schemeTypes = groups.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.loadEffect = function() {
              $scope.showEffect = true
              var storyService = $feathers.service('stories')
              storyService.find({}).then(function(stories) {

                  if (stories.data.length) {
                      console.log('showing stories', stories.data)
                      $scope.$apply(function() {
                          $scope.schemeEffects = stories.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.rating = 0;
          $scope.ratings = [{
              current: 1,
              max: 5
          }];

          $scope.getSelectedRating = function(rating) {
              $scope.rating.rate = rating;
          }
          $scope.addRating = function() {
              console.log('final rating', $scope.rating)
              $state.go('scheme')
          }
      })
angular.module('app.controllers')
  .controller('loginCtrl', function (user,
    $scope, $rootScope, $state, $stateParams,
    $feathers, $auth, AuthService, LocalService, $anchorScroll, $location, toastr) {

    console.log($stateParams)
    if ($stateParams.action == "1") {
      console.log('active called')
      $scope.action = 1
    }

    if (user) {
      $state.go('ratings')
    }

    $scope.resetToken = $stateParams.token;
    $scope.active = $stateParams.token == 'newaccount' ? 1 : 0
    $scope.user = {}
    $scope.signup_data = {}
    $rootScope.user = user
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
      authManagement.authenticate($scope.user.email, $scope.user.password)
        .then((res) => {
          if (res) {
            $state.go('dashboard')
          }
        }).catch((err) => {
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
   angular.module('app.controllers').controller('publicRatingsCtrl', function($rootScope, $scope, $state, $stateParams, $feathers) {


          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: []
          }
          $scope.nextSlideU = function(scheme, slide) {
              var errorState = false
              scheme.antidotes.map(function(antidote) {
                  if (antidote.score >= 0) {
                      antidote.error = false

                  } else {
                      antidote.error = true,
                          errorState = true
                  }
                  return antidote
              })
              if (!errorState) {
                  slide()
              }
          }
          $scope.canSubmit = true
          $scope.prevSlideU = function(slide) {
              slide()
          }

          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }
          $scope.searchOrganization = function() {
              var inputMin = 1;
              $scope.ratin.organizationSelected = false

              if ($scope.ratin.organization && $scope.ratin.organization.length >= inputMin) {
                  var entityService = $feathers.service('entities')
                  entityService.find({
                      query: {
                          domains: user.email,
                          assessorType: ''

                      }
                  }).then(function(entities) {
                      console.log('returnd entit')
                      if (entities.data.length) {
                          console.log('showing entities', entities.data)
                          $scope.$apply(function() {
                              $scope.orgSearch = true;
                              $scope.results = entities.data
                              $scope.orgs = entities.data



                          })
                      }
                  }).catch(function(err) {
                      console.log(err)
                      $scope.orgSearch = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }

          $scope.searchSector = function() {
              var inputMin = 1;
              console.log('search sector called')
              if ($scope.ratin.sector && $scope.ratin.sector.length >= inputMin) {
                  $scope.ratin.sectorSelected = false

                  var sectorService = $feathers.service('sectors')
                  sectorService.find({

                  }).then(function(sectors) {

                      if (sectors.data.length) {
                          console.log('showing sectors', sectors.data)
                          $scope.$apply(function() {
                              $scope.searching = true;
                              $scope.results = sectors.data


                          })
                      }
                  }).catch(function(err) {
                      console.log(err)
                      $scope.searching = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }
          $scope.addSector = function(result) {
              $scope.ratin.sectorId = result._id;

              $scope.ratin.sector = result.name;
              $scope.ratin.sectorSelected = true
              //  $scope.results = []
              $scope.searching = false;
              $scope.searchOrganization()

          }
          $scope.addOrganization = function(result) {
              $scope.ratin.organizationId = result._id;

              $scope.ratin.organization = result.name;
              $scope.orgSearch = false;
              $scope.ratin.organizationSelected = true

          }
          $scope.loadSchemes = function(assessmentData) {
              // load schemes based on assessment data

              $scope.showAssessment = true
              var schemeService = $feathers.service('schemes')
              schemeService.find({
                  query: {
                      $populate: {
                          path: 'sectors antidotes',
                          select: 'name description _id',
                          options: {
                              limit: 10
                          }
                      },
                      'sectors': assessmentData.sectorId,

                  }
              }).then(function(schemes) {
                  console.log('testq schemes', schemes)
                  $scope.$apply(function() {
                      $scope.ratin.schemes = schemes.data
                  })
              }).catch(function(err) {
                  console.log(err)
              })

          }
          $scope.rateScheme = function(scheme, antidote, type) {
              _.map(scheme.antidotes, function(item) {
                  if (item == antidote) {
                      (type) ? item.score = 3: item.score = 0
                  }
              })

          }
          $scope.submitRating = function() {
              var ratingService = $feathers.service('ratings')
              ratingService.create($scope.ratin).then(function(ratinResult) {
                  $scope.$apply(function() {
                      console.log('result from rating', ratinResult)
                      $scope.ratinResult = ratinResult

                      $scope.ratingCompleted = true
                  })
              }).catch(function(err) {
                  console.log('ratin error', err)
              })
          }
          $scope.completeRating = function(ratin) {


              console.log('rating data', ratin)
              $scope.ratingCompleted = true
              $scope.showAssessment = false
          }
          $scope.showScheme = function() {
              var groupService = $feathers.service('groups')
              groupService.find({

              }).then(function(groups) {

                  if (groups.data.length) {
                      console.log('showing groups', groups.data)
                      $scope.$apply(function() {
                          $scope.schemeTypes = groups.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.loadEffect = function() {
              $scope.showEffect = true
              var storyService = $feathers.service('stories')
              storyService.find({}).then(function(stories) {

                  if (stories.data.length) {
                      console.log('showing stories', stories.data)
                      $scope.$apply(function() {
                          $scope.schemeEffects = stories.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.rating = 0;
          $scope.ratings = [{
              current: 1,
              max: 5
          }];

          $scope.getSelectedRating = function(rating) {
              $scope.rating.rate = rating;
          }
          $scope.addRating = function() {
              console.log('final rating', $scope.rating)
              $state.go('scheme')
          }
      })
  angular.module('app.controllers')
     .controller('ratingsCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {

         if(!user){
             $state.go('login')
         }
          $rootScope.user = user
          $scope.schemerater =[]
         $rootScope.isLoggedIn  = $rootScope.user ? true:false
         $scope.showRatingPage =false
         $schemeLoaded=false
         console.log('show rootScope', $rootScope)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: [],
              creator : user._id
          }
          $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
        }
          console.log('showing organization type', user)
          $scope.nextSlideU = function(scheme, slide, schemeLength , index) {
            console.log('scheme length', schemeLength)
            console.log('ndec' , index)
              var errorState = false

                  if (scheme.score >= 0) {
                      scheme.error = false

                  } else {
                      scheme.error = true,
                          errorState = true
                  }

                  console.log('showing scheme state', scheme )
              if (!errorState && schemeLength !=(index+1)) {
                  slide()
              }
          }
          $scope.canSubmit = true
          $scope.prevSlideU = function(slide) {
              slide()
          }
          if (!user) {
              $state.go('login')
              return
          }


          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }
          $scope.searchOrganization = function() {
              $scope.sectorsearching = false;
                 $scope.orgsearching = true;
          
             var inputMin = 1;
              $scope.ratin.organizationSelected = false

              if ($scope.ratin.organization && $scope.ratin.organization.length >= inputMin) {
                var entityService = $feathers.service('entity')
                var entityConfig;
                console.log('showing organization type', user)
                console.log('params', $stateParams)
                if($stateParams.ratingType == 'independent'){
                  entityConfig ={
                        query:{
                       sectors : $scope.ratin.sectorId
                        }
                   }
                }else{
                  entityConfig ={
                      query:{
                         _id: user.selfEntities,
                         sectors : $scope.ratin.sectorId
                      }
                   
                  }
                }
                console.log('entity config',entityConfig)
                  entityService.find(entityConfig).then(function(entities) {
                      console.log('returnd entit', entities)
                      if (entities.data.length) {
                          console.log('showing entities', entities.data)
                          $scope.$apply(function() {
                              $scope.orgSearch = true;
                            $scope.orgs = entities.data



                          })
                      }
                  }).catch(function(err) {
                      console.log('entity search error',err)
                      $scope.orgSearch = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }

          $scope.searchSector = function() {
              var inputMin = 1;
                $scope.sectorsearching = true;
                   $scope.orgsearching = false;
                 if ($scope.ratin.sector && $scope.ratin.sector.length >= inputMin) {
                  $scope.ratin.sectorSelected = false

                  var sectorService = $feathers.service('sector')
                  sectorService.find({
                    query: {
                        _id:"58ae8c5b561deb07e1dc1d37"
                    }
                  }).then(function(sectors) {

                      if (sectors.data.length) {
                          console.log('showing sectors', sectors.data)
                          $scope.$apply(function() {
                              $scope.searching = true;
                              $scope.results = sectors.data


                          })
                      }
                  }).catch(function(err) {
                      console.log(err)
                      $scope.searching = false;
                  })

              } else {
                  $scope.searching = false;
              }
          }
          $scope.addSector = function(result) {
              $scope.ratin.sectorId = result._id;

              $scope.ratin.sector = result.name;
              $scope.ratin.sectorSelected = true
              //  $scope.results = []
              $scope.searching = false;
              $scope.sectorsearching =false
        }
          $scope.addOrganization = function(result) {
              console.log('rating now',$scope.ratin)
              $scope.ratin.organizationId = result._id;
                $scope.ratin.entity = result._id;

              $scope.ratin.organization = result.name;
              $scope.orgSearch = false;
              $scope.ratin.organizationSelected = true
              $scope.orgsearching=false

          }
          $scope.loadSchemes = function(assessmentData) {
              // load schemes based on assessment data
              console.log('assess', assessmentData)
              if(!assessmentData){
                  return
              }
              console.log('show ratin', $scope.ratin)
             console.log('show user', user)
              $scope.showAssessment = true
             
              if(user.userType =='independent-assessor'){
                  //find  organization  rating ,
                console.log('showing assessor type', user)
                  var ratingService  = $feathers.service('rating')
                  ratingService.find({
                    query:{
                      entity :$scope.ratin.organizationId
                    }
                  }).then(function(rating){
                    console.log('showing rating', rating)
                    if(rating.data.length){
                      // there is an existing rating for this organization
                      $scope.$apply(function(){
                        console.log('rating data' , rating.data[0].ratingData )
                        $scope._rating_id = rating.data[0]._id
                        $scope.ratin = rating.data[0].ratingData
                      })
                    }
                  }).catch(function(err){
                    console.log('rating error', err)
                  })
              }else{
                var schemeService = $feathers.service('scheme')
                schemeService.find({
                    query: {
                        $populate: {
                            path: 'sectors antidotes',
                            select: 'name description _id',
                            options: {
                                limit: 10
                            }
                        },
                        'sectors': $scope.ratin.sectorId,

                    }
                }).then(function(schemes) {
                    console.log('testq schemes', schemes)
                    var raterArray =[]
                     schemes.data.map(function (scheme){
                         scheme.antidotes.map(function(antidote){
                           var rateData ={
                             scheme: scheme.name,
                             schemeId: scheme._id ,
                             antidoteName: antidote.name,
                             antidoteDesc : antidote.description,
                             antidoteId:antidote._id
                           }
                           raterArray.push(rateData)
                         })
                     })
                    $scope.$apply(function() {
                    
                    $scope.schemerater = raterArray
                       $scope.ratin.schemes = schemes.data
                    })
                }).catch(function(err) {
                    console.log(err)
                })
              }


          }
          $scope.rateScheme = function(item, type) {

                      (type) ? item.score = 3: item.score = 0
                      console.log('current item', item)
                  }

          $scope.submitRating = function() {

              var ratingService = $feathers.service('rating')
                if(user.userType =='independent-assessor'){
                  ratingService.create($scope.ratin).then(function(ratinResult) {
                      $scope.$apply(function() {
                          console.log('result from rating', ratinResult)
                          $scope.ratinResult = ratinResult

                          $scope.ratingCompleted = true
                      })
                  }).catch(function(err) {
                      console.log('ratin error', err)
                  })
                }else{
                  console.log('rating data'  , $scope.schemerater)
                  console.log('ratin ' , $scope.ratin)
                  $scope.ratin.ratingData = $scope.schemerater
                  console.log('ratings status ' , $scope.ratin)
                  ratingService.create($scope.ratin).then(function(ratinResult) {
                      $scope.$apply(function() {
                          console.log('result from rating', ratinResult)
                          $scope.ratinResult = ratinResult

                          $scope.ratingCompleted = true
                      })
                  }).catch(function(err) {
                      console.log('ratin error', err)
                  })
                }

          }
          $scope.viewRating = function(){
             $state.go('rating-result',{
                 rating : $scope.ratinResult._id
             })
          }
          $scope.completeRating = function(ratin) {

              // var ratingService = $feathers.service('ratings')
              // ratingService.create(ratin).then(function(storedRating){
              //   $scope.$apply(function(){
              //     $scope.ratingResult = storedRating
              //   })
              // })

              console.log('rating data', ratin)
              $scope.ratingCompleted = true
              $scope.showAssessment = false
          }
          $scope.showScheme = function() {
              var groupService = $feathers.service('groups')
              groupService.find({

              }).then(function(groups) {

                  if (groups.data.length) {
                      console.log('showing groups', groups.data)
                      $scope.$apply(function() {
                          $scope.schemeTypes = groups.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.loadEffect = function() {
              $scope.showEffect = true
              var storyService = $feathers.service('stories')
              storyService.find({}).then(function(stories) {

                  if (stories.data.length) {
                      console.log('showing stories', stories.data)
                      $scope.$apply(function() {
                          $scope.schemeEffects = stories.data

                      })
                  }
              }).catch(function(err) {
                  console.log(err)
                  $scope.searching = false;
              })
          }
          $scope.rating = 0;
          $scope.ratings = [{
              current: 1,
              max: 5
          }];

          $scope.getSelectedRating = function(rating) {
              $scope.rating.rate = rating;
          }
          $scope.addRating = function() {
              console.log('final rating', $scope.rating)
              $state.go('scheme')
          }
      })
  angular.module('app.controllers')
     .controller('ratingsResultCtrl', function(user,rating, $rootScope, $scope, $state, $stateParams, $feathers) {
          
           $scope.rating = rating
          $rootScope.user = user
          $scope.schemerater =[]
         $rootScope.isLoggedIn  = $rootScope.user ? true:false
         $scope.showRatingPage =false
         $schemeLoaded=false
         console.log('show rootScope', $rootScope)
         console.log('show rating', $scope.ratin)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: []
          }
          $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
            
        }
      
         $scope.getRating = function(){
              var ratingService = $feathers.service('rating')
          ratingService.get($stateParams.rating).then(function(ratings) {
               console.log('get rating',ratings)
              if (ratings) {
             
                  $scope.$apply(function() {
                      $scope.rating = ratings
                  })
              }
          }).catch(function(err) {
              console.log(err)
          })
          
         }
     
      })
angular.module('app.controllers')
  .controller('requestCtrl', function (user,entities,
    $scope, $rootScope, $state, $stateParams,
    $feathers, $auth, AuthService, LocalService, $anchorScroll, $location, toastr) {

    console.log($stateParams)
    $scope.requestType = $stateParams.type
    $scope.request = {assessorType:$stateParams.type , user: user._id}

  
    
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
   
          $scope.submitRequest = function(valid) {
            if(!valid){
              return
            }
              console.log('request data', $scope.request)
              var requestService = $feathers.service('request')
                requestService.create($scope.request).then(function(requestResult) {
                      $scope.$apply(function() {
                          console.log('result from request', requestResult)
                          $scope.requestResult = requestResult

                          $scope.requestCompleted = true
                      })
                  }).catch(function(err) {
                       $scope.requestCompleted = false
                      console.log('ratin error', err)
                 })
                
          }
          
  
  })
angular.module('app.controllers')
  .controller('requestResultCtrl', function (requestStatus,
    $scope, $rootScope, $state, $stateParams,
    $feathers, $auth, AuthService, LocalService, $anchorScroll, $location, toastr) {
      $scope.requestData =requestStatus
    console.log($stateParams)
  
        
 
          
          
  
  })
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
   angular.module('app.controllers').controller('resultCtrl', function(schemes,$scope, Restangular, $state, $stateParams, $feathers) {
               
               $scope.searchKeyword={}
               $scope.searchKeyword.keyword = $stateParams.query;
               $scope.allSchemes = schemes
               $scope.showRagResult = function(rating){
                 $state.go('entityrating',{
                   query: rating._id
                 })
               }
               $scope.search = function() {
                   
                 $scope.schemes=[]
                 
                     if ($scope.searchKeyword.keyword) {
                         //  $state.go('results', {query: $scope.searchKeyword})
                         $scope.searching = true;
                         var schemeService = $feathers.service('scheme')
                         var entityService = $feathers.service('entity')
                         var sectorService = $feathers.service('sector')
                       var ratingService = $feathers.service('rating')
                       sectorService.find({
                         query:{
                           $text:{
                             $search : $scope.searchKeyword.keyword
                           }
                         }
                       }).then(function(sectors){
                           console.log('the sectors', sectors)
                         if(sectors.data.length){
                           var sectorIds =_.pluck(sectors.data, '_id')
                           console.log('sector ids',sectorIds)
                           schemeService.find({
                               query: {
                                   sectors: sectorIds,
                                   
                               }
                           }).then(function(schemes) {
                               console.log('showing ssearch schemes', schemes)

                               $scope.$apply(function() {
                                   $scope.searching = false;

                                   $scope.total = schemes.total
                                 schemes.data.map(function(scheme){
                                   $scope.schemes.push(scheme)
                                 })
                                   $scope.notFound = false
                               });

                           }).catch(function(err) {
                               $scope.error = err
                           })
                         }

                       })
                         entityService.find({
                           query:{
                             $text:{
                               $search: $scope.searchKeyword.keyword
                             }
                           }
                         }).then(function(entities){
                           console.log('showing search entities', entities)
                            $scope.$apply(function(){
                                 $scope.entities = entities.data
                               })
                           if(entities.data.length){

                           var entityIds = _.pluck(entities.data , '_id')
                           console.log('entities ids',entityIds)
                             ratingService.find({
                               query:{
                                 entity : entityIds,
                                 

                               },
                               $limit: 5
                             }).then(function(ratings){
                               console.log( 'show ratings', ratings)

                               $scope.$apply(function(){
                                 $scope.ratings = ratings.data
                               })
                             })
                           }

                         })

                         schemeService.find({
                             query: {
                                 $text: {
                                     $search: $scope.searchKeyword.keyword
                                 },
                                 
                             }
                         }).then(function(schemes) {
                             console.log('showing search schemes', schemes)

                             $scope.$apply(function() {
                                 $scope.searching = false;

                                 $scope.total = schemes.total
                                 schemes.data.map(function(scheme){
                                   $scope.schemes.push(scheme)
                                 })
                                 $scope.notFound = false
                             });

                         }).catch(function(err) {
                             $scope.error = err
                         })


                     }


               }

               $scope.search();
               $scope.publicRating= function(entity){
                $scope.currentEntity = entity
                console.log('show entity', $scope)
                       
            $scope.showRater=true
        }
        $scope.toResult = function(){
            $scope.showRater=false
        }
               $scope.showResult = function(person) {
                 console.log(person);
                   $state.go('entity', {
                       query: person._id
                   })
               }

               $scope.showProject = function(project) {
                   Restangular.one('project', project._id).get().then(function(response) {
                       $scope.entity = response;
                       console.log($scope.entity.plain());
                   })
                   $scope.projectNode = true;
               }

               $scope.close = function() {
                   $scope.personNode = false;
                   $scope.projectNode = false;
               }
           })

           .controller('entityCtrl', function($scope, Restangular, $state, $stateParams, $feathers) {
               $scope.searchedEntity = $stateParams.query;

               $scope.search = function() {
                   if ($scope.searchKeyword) {
                       $state.go('results', {
                           query: $scope.searchKeyword.keyword
                       })
                  
                   }
               }
                $scope.submitRating= function(valid){
            if(!valid){
                return
            }
              $scope.showRater=false
                  var ratingService = $feathers.service('rating')
                
                      ratingService.create($scope.ratin).then(function(ratinResult) {
                          $scope.$apply(function() {
                             $scope.ratingFunc()
                            
                          })
                      }).catch(function(err) {
                          console.log('ratin error', err)
                      })
                
        }
               $scope.viewEntity = function() {
                   if ($scope.searchedEntity) {
                       $scope.searching = true;
                       var schemeService = $feathers.service('schemes')
                         schemeService.get($scope.searchedEntity, {
                           query: {
                               $populate: {
                                   path: 'sectors',
                                   select: 'name -_id',
                                   options: {
                                       limit: 5
                                   }
                               }
                           }
                       }).then(function(scheme) {
                           console.log('showing scheme data', scheme)
                           $scope.$apply(function() {
                               $scope.searching = false;
                               $scope.entity = scheme;
                               $scope.searchKeyword = scheme.name;
                               $scope.sectors = scheme.sectors;

                           })
                       }).catch(function(err) {
                           $scope.$apply(function() {
                               $scope.searching = false;

                           })
                       })
                      
                   }
               }
             })

    
   angular.module('app.controllers') .controller('schemeCtrl', function($scope, $state, $stateParams, $feathers) {
          console.log($stateParams.sector)
          var schemeService = $feathers.service('schemes')
          schemeService.find({
              query: {
                  $populate: {
                      path: 'sectors',
                      select: 'name -_id',
                      options: {
                          limit: 5
                      }
                  },
                  sectors: $stateParams.sector
              }
          }).then(function(schemes) {
              if (schemes.data.length) {
                  console.log(schemes.data)
                  $scope.$apply(function() {
                      $scope.persons = schemes.data
                  })
              }
          }).catch(function(err) {
              console.log(err)
          })
          $scope.quantity = 6;
          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }

      })
    angular.module('app.controllers').controller('sectorCtrl', function($scope, $state, $stateParams, $feathers) {

          $scope.showResult = function(sector) {
              console.log('scheme result called', sector)
              $state.go('scheme', {
                  sector: sector._id
              })
          }



          $scope.compare = function(contract) {
              $scope.compareProjects = true;
              $scope.contract = contract;
          }

          $scope.compareProject = function() {
              $scope.closeModal();
              $scope.searching = true;
              console.log($scope.contract);
              Restangular.one('project', $scope.contract.id).get({
                      category: $scope.category
                  })
                  .then(function(response) {
                      $scope.searching = false;
                      $scope.showComparison = true;
                      $scope.similarProjects = response.relatedProjects;
                  })
          }

          $scope.closeComparison = function() {
              $scope.showComparison = false;
          }
          $scope.closeModal = function() {
              $scope.compareProjects = false;
          }
          $scope.search = function() {
            $state.go('results', {
      query: $scope.searchKeyword
  })
    }
      })
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
      authManagement.authenticate($scope.user.email, $scope.user.password)
        .then((res) => {
          if (res) {
            $state.go('dashboard')
          }
        }).catch((err) => {
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
  angular.module('app.controllers')
     .controller('viewRatingCtrl', function(ratings, $rootScope, $scope, $state, $stateParams, $feathers) {

                $scope.ratings = ratings
          $rootScope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $rootScope.user = null
                $state.reload()

            });
        }
        

      })