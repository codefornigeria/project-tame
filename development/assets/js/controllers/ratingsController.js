  angular.module('app.controllers')
     .controller('ratingsCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {

          $rootScope.user = user
          console.log('show user', user)
          $scope.showEffect = false
          $scope.showAssessment = false
          $scope.ratingCompleted = false
          $scope.orgSearch = false;
          $scope.ratin = {
              schemes: []
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
              var inputMin = 1;
              $scope.ratin.organizationSelected = false

              if ($scope.ratin.organization && $scope.ratin.organization.length >= inputMin) {
                var entityService = $feathers.service('entities')
                var entityConfig;
                console.log('showing organization type', user)
                if(user.userType == 'independent-assessor'){
                  entityconfig ={
                      query: {
                          isSelfRated:true,
                          indieRated:false
                        },
                      userType: user.userType
                  }
                }else{
                  entityConfig ={
                      query: {
                          domains: user.email,
                        //  isSelfRated:false
                          userType: user.userType
                        },

                  }
                }
                  entityService.find(entityConfig).then(function(entities) {
                      console.log('returnd entit', entities)
                      if (entities.data.length) {
                          console.log('showing entities', entities.data)
                          $scope.$apply(function() {
                              $scope.orgSearch = true;
                              $scope.results = entities.data
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

              if(user.userType =='independent-assessor'){
                  //find  organization  rating ,
                console.log('showing assessor type', user)
                  var ratingService  = $feathers.service('ratings')
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
                         scheme.antidotes.map(function(antidote){
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


          }
          $scope.rateScheme = function(item, type) {

                      (type) ? item.score = 3: item.score = 0
                  }

          $scope.submitRating = function() {

              var ratingService = $feathers.service('ratings')
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