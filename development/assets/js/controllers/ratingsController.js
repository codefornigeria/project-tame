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
                      _id:user.independentEntities,
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
              console.log('search sector called')
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