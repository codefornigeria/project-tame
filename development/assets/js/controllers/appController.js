angular.module('app.controllers')
    .controller('appCtrl', function (user, $scope, $rootScope, Restangular, $state, $stateParams, $feathers) {
         $scope.showRater=false
         $scope.ratin={}
        $scope.sectorSplit = function (val) {
            //  console.log(val)
            return val.name

        }

        $scope.checkUser = function () {
            console.log('checking if user is logged in')
        }
        $scope.logout = function () {
            console.log('logout clicked')
            $feathers.logout().then(function (params) {
                console.log(params);
                console.log("Logged out!!")
                $scope.user = null
                //$state.reload()

            });
        }
          $scope.search = function() {
            $state.go('results', {
      query: $scope.searchKeyword
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
        
        var ratingsService = $feathers.service('rating')
        ratingsService.find({
            query: {
                $populate: {
                    path: 'scheme entity',
                    select: 'name  _id',
                    options: {
                        limit: 5
                    }
                }
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
            $scope.ratin.organization = entity.name
            $scope.ratin.organizationId = entity._id
            $scope.ratin.ratingType ="public-assessor"
            $scope.showRater=true
        }
     

        
    })