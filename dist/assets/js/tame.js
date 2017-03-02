angular.module("app.config", [])
.constant("Config", {"api":"https://tame-api.herokuapp.com/","facebookAppId":"1503484316624984","googleMapKey":"AIzaSyBpzQ8_m8SrgbbIk0X2o5NVTyg1XdFgSOk"});


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

  angular.module('app.controllers', [])

.factory('API', ['Restangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
         RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
    });
 }])
.controller('appCtrl', function($scope, Restangular, $state, $stateParams,$feathers) {

      $scope.sectorSplit= function(val){
        console.log(val)
        return val.name
      }
      var testQ = function(){
           var schemeService = $feathers.service('schemes')
           schemeService.find({
             query:{
               $populate:{
                           path: 'sectors',
                           select: 'name -_id',
                           options: { limit: 5 }
                         },
               'sectors':'58b7eb8aba090a00118dfc6e'
             }
           }).then(function(schemes){
             console.log('testq schemes',schemes)
           }).catch(function(err){
             console.log(err)
           })
      }
      testQ()
     var schemeService = $feathers.service('schemes')
      schemeService.find({
        query:{
            $populate:{
                        path: 'sectors',
                        select: 'name -_id',
                        options: { limit: 5 }
                      }
        }
      }).then(function(schemes){
        if(schemes.data.length){
          console.log(schemes.data)
          $scope.$apply(function(){
            $scope.persons  =schemes.data
          })
        }
      }).catch(function(err){
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
        onAnimationComplete: function () {
            this.showTooltip(this.segments, true);
        },
    };

    $scope.quantity = 3;

	$scope.search = function() {
        if ($scope.searchKeyword){
          var schemeService = $feathers.service('schemes')
           schemeService.find({
             query:{
                $text: { $search: $scope.searchKeyword },
                $populate:{
                            path: 'sectors',
                            select: 'name -_id',
                            options: { limit: 5 }
                          } }
           }).then(function(schemes){
          //   console.log('showing search schemes',schemes)
               $scope.total = schemes.total
               $scope.schemes  =schemes.data
               $scope.notFound = false

           }).catch(function(err){
             $scope.error = err
           })



            $state.go('results', {query: $scope.searchKeyword})
        }
    }

    $scope.showResult = function(person) {
        $state.go('entity', {query: person._id})
    }

    $scope.showProject = function(project) {
        Restangular.one('project', project.id).get().then(function(response){
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
.controller('schemeCtrl',function($scope,$state,$stateParams,$feathers){
  console.log($stateParams.sector)
  var schemeService = $feathers.service('schemes')
   schemeService.find({
     query:{
         $populate:{
                     path: 'sectors',
                     select: 'name -_id',
                     options: { limit: 5 }
                   },
                   sectors:$stateParams.sector
     }
   }).then(function(schemes){
     if(schemes.data.length){
       console.log(schemes.data)
       $scope.$apply(function(){
         $scope.persons  =schemes.data
       })
     }
   }).catch(function(err){
     console.log(err)
   })
       $scope.quantity = 6;
   $scope.showResult = function(person) {
       $state.go('entity', {query: person._id})
   }

})
.controller('ratingsCtrl',function($scope,$state,$stateParams,$feathers){

$scope.showEffect = false
   $scope.showResult = function(person) {
       $state.go('entity', {query: person._id})
   }
   $scope.search = function() {
       var address = $scope.rating.name;
       var inputMin = 1;

       if ($scope.rating.sector && $scope.rating.sector.length >= inputMin) {
         var sectorService = $feathers.service('sectors')
         sectorService.find({

         }).then(function(sectors){

           if(sectors.data.length){
             console.log('showing sectors',sectors.data)
             $scope.$apply(function(){
               $scope.searching = true;
               $scope.results = sectors.data

             })
           }
         }).catch(function(err){
           console.log(err)
              $scope.searching = false;
         })

       } else {
           $scope.searching = false;
         }
       }

           $scope.addSector = function(result) {
               $scope.rating.sectorId = result._id;

               $scope.rating.sector = result.name;
               $scope.searching = false;
                $scope.showScheme()
             }

           $scope.showScheme = function(){
             var groupService = $feathers.service('groups')
             groupService.find({

             }).then(function(groups){

               if(groups.data.length){
                 console.log('showing groups',groups.data)
                 $scope.$apply(function(){
                    $scope.schemeTypes = groups.data

                 })
               }
             }).catch(function(err){
               console.log(err)
                  $scope.searching = false;
             })
           }
           $scope.loadEffect = function(){
             $scope.showEffect = true
             var storyService = $feathers.service('stories')
             storyService.find({
             }).then(function(stories){

               if(stories.data.length){
                 console.log('showing stories',stories.data)
                 $scope.$apply(function(){
                    $scope.schemeEffects = stories.data

                 })
               }
             }).catch(function(err){
               console.log(err)
                  $scope.searching = false;
             })
           }
           $scope.rating = 0;
           $scope.ratings = [{
               current: 1,
               max: 5
           }];

           $scope.getSelectedRating = function (rating) {
               $scope.rating.rate = rating;
           }
           $scope.addRating = function(){
             console.log('final rating', $scope.rating)
           }
})
.controller('sectorCtrl',function($scope,$state,$stateParams,$feathers){
  $scope.sectorFnc= function(){
     $scope.searching = true;
    var sectorService = $feathers.service('sectors')
    sectorService.find({ query: {active: true}}).then(function(sectors){
      console.log('show sectos', sectors)
      $scope.$apply(function(){
        $scope.searching =false
        $scope.total = sectors.total
        $scope.sectors  = sectors.data,
         $scope.notFound = false
      })
    }).catch(function(err){
         $scope.error = err
    })
  }
  $scope.sectorFnc()
  $scope.showResult = function(sector) {
    console.log('scheme result called',sector)
      $state.go('scheme', { sector: sector._id})
  }
})
.controller('resultCtrl', function($scope, Restangular, $state, $stateParams,$feathers) {
	$scope.searchKeyword = $stateParams.query;
  console.log($scope)
    $scope.search = function() {

    	if ($scope.searchKeyword){
          //  $state.go('results', {query: $scope.searchKeyword})
             $scope.searching = true;
            var schemeService = $feathers.service('schemes')
             schemeService.find({
               query:{
                  $text: { $search: $scope.searchKeyword },
                  $populate: {
                              path: 'sectors',
                              select: 'name -_id',
                              options: { limit: 5 }
                            }
                           }
             }).then(function(schemes){
               console.log('showing search schemes',schemes)

                 $scope.$apply(function () {
                   $scope.searching = false;

                   $scope.total = schemes.total
                   $scope.schemes  =schemes.data
                   $scope.notFound = false
             });

             }).catch(function(err){
               $scope.error = err
             })


    	}
    }

    $scope.search();

    $scope.showResult = function(person) {
        $state.go('entity', {query: person._id})
    }

    $scope.showProject = function(project) {
        Restangular.one('project', project._id).get().then(function(response){
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

.controller('entityCtrl', function($scope, Restangular, $state, $stateParams,$feathers) {
    $scope.searchedEntity = $stateParams.query;

    $scope.search = function() {
        if ($scope.searchKeyword){
            $state.go('results', {query: $scope.searchKeyword})
            $scope.searching = true;
            Restangular.one('search').get({query: $scope.searchKeyword}).then(function(response){
                $scope.searching = false;
                if (response.person == '' && response.project == '') {
                    $scope.notFound = true;
                } else {
                    $scope.results = response;
                    $scope.persons = $scope.results.person;
                    $scope.projects = $scope.results.project;
                    $scope.total =  parseInt($scope.results.person.length) +  parseInt($scope.results.project.length);
                }
             }, function(error){
                $scope.searching = false;
                $scope.error = error;
            });
        }
    }

    $scope.viewEntity = function() {
        if ($scope.searchedEntity){
            $scope.searching = true;
            var schemeService = $feathers.service('schemes')
            schemeService.get($scope.searchedEntity , { query:
            { $populate: {
                        path: 'sectors',
                        select: 'name -_id',
                        options: { limit: 5 }
                      }
            }}).then(function(scheme){
              console.log('showing scheme data',scheme)
              $scope.$apply(function(){
                $scope.searching = false;
                $scope.entity = scheme;
                $scope.searchKeyword = scheme.name;
                $scope.sectors = scheme.sectors;

              })
            }).catch(function(err){
              $scope.$apply(function(){
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


    $scope.compare = function (contract) {
        $scope.compareProjects = true;
        $scope.contract = contract;
    }

    $scope.compareProject = function () {
        $scope.closeModal();
        $scope.searching = true;
        console.log($scope.contract);
        Restangular.one('project', $scope.contract.id).get({category: $scope.category})
            .then(function (response) {
                $scope.searching = false;
                $scope.showComparison = true;
                $scope.similarProjects = response.relatedProjects;
        })
    }

    $scope.closeComparison = function () {
        $scope.showComparison = false;
    }
    $scope.closeModal = function () {
        $scope.compareProjects = false;
    }
})

.controller('compareCtrl', function ($scope, Restangular, $state, $stateParams) {
    Restangular.one('project').get({matched: false}).then(function(response) {
        $scope.projects = response;
    })

    $scope.selectProject = function () {
        $scope.project = $scope.match.project.district.state.id;
        Restangular.one('person').get({state: $scope.project}).then(function (response) {
            $scope.persons = response;
        }, function(error){
        })
    }

    $scope.matchProject = function () {
        $scope.match.project = $scope.match.project.id;
        $scope.match.person = $scope.match.person.id;
        // console.log($scope.match)
        Restangular.all('match-project').post($scope.match).then(function (response) {
            console.log('matched')
            $state.reload();
        })
    }
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
