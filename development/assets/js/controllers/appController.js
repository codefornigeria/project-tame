angular.module('app.controllers')
    .controller('appCtrl', function (user, $scope, $rootScope, Restangular, $state, $stateParams, $feathers) {

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


         $scope.search = function() {
                 $scope.schemes=[]

                     if ($scope.searchKeyword) {
                         //  $state.go('results', {query: $scope.searchKeyword})
                         $scope.searching = true;
                         var schemeService = $feathers.service('scheme')
                         var entityService = $feathers.service('entity')
                         var sectorService = $feathers.service('sector')
                       var ratingService = $feathers.service('rating')
                       sectorService.find({
                         query:{
                           $text:{
                             $search : $scope.searchKeyword
                           }
                         }
                       }).then(function(sectors){
                         if(sectors.data.length){
                           var sectorIds =_.pluck(sectors.data, '_id')
                           console.log('sector ids',sectorIds)
                           schemeService.find({
                               query: {
                                   sectors: sectorIds,
                                   $populate: {
                                       path: 'sectors',
                                       select: 'name -_id',
                                       options: {
                                           limit: 5
                                       }
                                   }
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
                               $search: $scope.searchKeyword
                             }
                           }
                         }).then(function(entities){
                           console.log('showing search entities', entities)
                           if(entities.data.length){
                           var entityIds = _.pluck(entities.data , '_id')
                           console.log('entities ids',entityIds)
                             ratingService.find({
                               query:{
                                 entity : entityIds,
                                 $populate: {
                                     path: 'entity schemes',
                                     select: 'name -_id',
                                     options: {
                                         limit: 5
                                     }
                                 }

                               }
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
     

        
    })