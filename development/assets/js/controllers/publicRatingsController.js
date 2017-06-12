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