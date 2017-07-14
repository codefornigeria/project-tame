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
          $scope.setScheme = function(scheme){
            $scope.theScheme = scheme
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

    