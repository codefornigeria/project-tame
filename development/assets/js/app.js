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
                    controller: 'resultCtrl'
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
