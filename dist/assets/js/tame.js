angular.module("app.config", [])
.constant("Config", {"api":"http://tame-api.herokuapp.com/","facebookAppId":"1503484316624984","googleMapKey":"AIzaSyBpzQ8_m8SrgbbIk0X2o5NVTyg1XdFgSOk"});


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

  angular.module('app.controllers', [])

      .factory('API', ['Restangular', function(Restangular) {
          return Restangular.withConfig(function(RestangularConfigurer) {
              RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
          });
      }])
      .controller('appCtrl', function(user, $scope, $rootScope, Restangular, $state, $stateParams, $feathers) {

          $scope.sectorSplit = function(val) {
              console.log(val)
              return val.name

          }

          $scope.checkUser = function() {
              console.log('checking if user is logged in')
          }
          $scope.logout = function() {
              console.log('logout clicked')
              $feathers.logout().then(function(params) {
                  console.log(params);
                  console.log("Logged out!!")
                  $scope.user = null
                  //$state.reload()

              });
          }
          var testQ = function() {
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
                      'sectors': '58b7eb8aba090a00118dfc6e'
                  }
              }).then(function(schemes) {
                  console.log('testq schemes', schemes)
              }).catch(function(err) {
                  console.log(err)
              })
          }
          testQ()
          var schemeService = $feathers.service('schemes')
          schemeService.find({
              query: {
                  $populate: {
                      path: 'sectors antidotes',
                      select: 'name description _id',
                      options: {
                          limit: 5
                      }
                  }
              }
          }).then(function(schemes) {
              if (schemes.data.length) {
                  console.log('test schemes', schemes.data)
                  $scope.$apply(function() {
                      $scope.persons = schemes.data
                  })
              }
          }).catch(function(err) {
              console.log(err)
          })
          // Restangular.all('project').getList().then(function(response){
          //
          //     $scope.projects = response;
          // })
          //
          // Restangular.all('person').getList().then(function(response){
          //     $scope.persons = response;
          //     console.log(response.plain())
          // })
          $scope.options = {
              tooltipEvents: [],
              showTooltips: true,
              tooltipCaretSize: 0,
              onAnimationComplete: function() {
                  this.showTooltip(this.segments, true);
              },
          };

          $scope.quantity = 3;

          $scope.search = function() {
              if ($scope.searchKeyword) {
                  var schemeService = $feathers.service('schemes')
                  schemeService.find({
                      query: {
                          $text: {
                              $search: $scope.searchKeyword
                          },
                          $populate: {
                              path: 'sectors',
                              select: 'name -_id',
                              options: {
                                  limit: 5
                              }
                          }
                      }
                  }).then(function(schemes) {
                      //   console.log('showing search schemes',schemes)
                      $scope.total = schemes.total
                      $scope.schemes = schemes.data
                      $scope.notFound = false

                  }).catch(function(err) {
                      $scope.error = err
                  })



                  $state.go('results', {
                      query: $scope.searchKeyword
                  })
              }
          }

          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }

          $scope.showProject = function(project) {
              Restangular.one('project', project.id).get().then(function(response) {
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
      .controller('schemeCtrl', function($scope, $state, $stateParams, $feathers) {
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
      .controller('ratingsCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {

          $rootScope.user = user
          console.log('show user', user)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;

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
                          domains: user.email

                      }
                  }).then(function(entities) {
                      console.log('returnd entit')
                      if (entities.data.length) {
                          console.log('showing entities', entities.data)
                          $scope.$apply(function() {
                              $scope.orgSearch = true;
                              $scope.results = entities.data

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
          $scope.completeRating = function(ratin) {

            // var ratingService = $feathers.service('ratings')
            // ratingService.create(ratin).then(function(storedRating){
            //   $scope.$apply(function(){
            //     $scope.ratingResult = storedRating
            //   })
            // })

            console.log('rating data',ratin)
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
      .controller('sectorCtrl', function($scope, $state, $stateParams, $feathers) {
          $scope.sectorFnc = function() {
              $scope.searching = true;
              var sectorService = $feathers.service('sectors')
              sectorService.find({
                  query: {
                      active: true
                  }
              }).then(function(sectors) {
                  console.log('show sectos', sectors)
                  $scope.$apply(function() {
                      $scope.searching = false
                      $scope.total = sectors.total
                      $scope.sectors = sectors.data,
                          $scope.notFound = false
                  })
              }).catch(function(err) {
                  $scope.error = err
              })
          }
          $scope.sectorFnc()
          $scope.showResult = function(sector) {
              console.log('scheme result called', sector)
              $state.go('scheme', {
                  sector: sector._id
              })
          }
      })
      .controller('resultCtrl', function($scope, Restangular, $state, $stateParams, $feathers) {
          $scope.searchKeyword = $stateParams.query;
          console.log($scope)
          $scope.search = function() {

              if ($scope.searchKeyword) {
                  //  $state.go('results', {query: $scope.searchKeyword})
                  $scope.searching = true;
                  var schemeService = $feathers.service('schemes')
                  schemeService.find({
                      query: {
                          $text: {
                              $search: $scope.searchKeyword
                          },
                          $populate: {
                              path: 'sectors',
                              select: 'name -_id',
                              options: {
                                  limit: 5
                              }
                          }
                      }
                  }).then(function(schemes) {
                      console.log('showing search schemes', schemes)

                      $scope.$apply(function() {
                          $scope.searching = false;

                          $scope.total = schemes.total
                          $scope.schemes = schemes.data
                          $scope.notFound = false
                      });

                  }).catch(function(err) {
                      $scope.error = err
                  })


              }
          }

          $scope.search();

          $scope.showResult = function(person) {
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

          $scope.viewEntity();


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
          $scope.register = function() {
              //  console.log ($scope.signup_data)
              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);

              }).catch(function(err) {

                  console.log(err);
              })
          }
      })

      .controller('loginCtrl', function(user, $scope, $rootScope, $state, $stateParams, $feathers) {
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
          }
          $scope.login = function() {
              $scope.alert = false;
              $scope.user.type = 'local'
              $feathers.authenticate($scope.user).then(function(res) {
                  console.log(res);
                  $scope.$apply(function() {
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
                      $scope.alert = {
                          type: 'danger',
                          message: err.message || 'Invalid login parameters'
                      }
                  })
              })
          };

          $scope.register = function() {
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
.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
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
