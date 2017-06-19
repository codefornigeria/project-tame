angular.module('app.controllers')
    .controller('appCtrl', function (user, $scope, $rootScope, Restangular, $state, $stateParams, $feathers) {
         $scope.showRater=false
         $scope.ratin={}
         $rootScope.user = user
         $scope.searchKeyword ={};
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
        var entityService = $feathers.service('entity')
        entityService.find({
           
        }).then(function (entities) {
            if (entities.data.length) {
                console.log('test entities', entities.data)
                $scope.$apply(function () {
                    $scope.entities = entities.data
                })
            }
        }).catch(function (err) {
            console.log(err)
        })
        
         var schemeService = $feathers.service('scheme')
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
        }).then(function (schemes) {
            if (schemes.data.length) {
                console.log('test schemes', schemes.data)
                $scope.$apply(function () {
                    $scope.schemes = schemes.data
                })
            }
        }).catch(function (err) {
            console.log(err)
        })
        
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
   $scope.ratingFunc()

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
            console.log('entites', entity)
            $scope.currentEntity= entity
                $scope.ratin.entity = entity._id
            $scope.ratin.ratingType ="public-assessor"
            $scope.ratin.schemes = _.pluck($scope.schemes, '_id')
                       
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