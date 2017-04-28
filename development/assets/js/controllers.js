  angular.module('app.controllers', [])

      .factory('API', ['Restangular', function(Restangular) {
          return Restangular.withConfig(function(RestangularConfigurer) {
              RestangularConfigurer.setBaseUrl('https://sahara-datakit-api.herokuapp.com/');
          });
      }])
      .controller('appCtrl', function(user, $scope, $rootScope, Restangular, $state, $stateParams, $feathers) {

          $scope.sectorSplit = function(val) {
            //  console.log(val)
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
          var ratingsService = $feathers.service('ratings')
          ratingsService.find({
              query: {
                  $populate: {
                      path: 'schemes entity',
                      select: 'name  _id',
                      options: {
                          limit: 5
                      }
                  }
              }
          }).then(function(ratings) {
              if (ratings.data.length) {
                  console.log('test ratings', ratings.data)
                  $scope.$apply(function() {
                      $scope.ratings = ratings.data
                  })
              }
          }).catch(function(err) {
              console.log(err)
          })

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
            $scope.schemes= [];
              if ($scope.searchKeyword) {
                  //  $state.go('results', {query: $scope.searchKeyword})
                  $scope.searching = true;
                  var schemeService = $feathers.service('schemes')
                  var entityService = $feathers.service('entities')
                  var sectorService = $feathers.service('sectors')
                var ratingService = $feathers.service('ratings')
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


          $scope.showResult = function(person) {
              $state.go('entity', {
                  query: person._id
              })
          }
          $scope.showRagResult = function(rating){
            $state.go('entityrating',{
              query: rating._id
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
      .controller('independentRatingsCtrl', function(user, $rootScope, $scope, $state, $stateParams, $feathers) {

          $rootScope.user = user
          console.log('show user', user)
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
                          domains: user.email,
                          assessmentType:'independent'
                      }
                  }).then(function(entities) {
                      console.log('returnd entity')
                      if (entities.data.length) {
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
                     $scope.schemerater = []
                    schemes.data.map(function (scheme){
                        schemes.antidote.map(function(antidote){
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
          $scope.rateScheme = function(scheme, type) {
                      (type) ? item.score = 3: item.score = 0


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
      .controller('publicRatingsCtrl', function($rootScope, $scope, $state, $stateParams, $feathers) {


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
      .controller('sectorCtrl', function($scope, $state, $stateParams, $feathers) {
          // $scope.sectorFnc = function() {
          //     $scope.searching = true;
          //     var sectorService = $feathers.service('sectors')
          //     sectorService.find({
          //         query: {
          //             active: true
          //         }
          //     }).then(function(sectors) {
          //         console.log('show sectos', sectors)
          //         $scope.$apply(function() {
          //             $scope.searching = false
          //             $scope.total = sectors.total
          //             $scope.sectors = sectors.data,
          //                 $scope.notFound = false
          //         })
          //     }).catch(function(err) {
          //         $scope.error = err
          //     })
          // }
          // $scope.sectorFnc()
          $scope.showResult = function(sector) {
              console.log('scheme result called', sector)
              $state.go('scheme', {
                  sector: sector._id
              })
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

      .controller('entityRatingCtrl', function($scope, Restangular, $state, $stateParams, $feathers,$rootScope) {
          $scope.searchedEntity = $stateParams.query;
          $scope.ratin = {
              schemes: []
          };
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








                          ///////////////////////////////////////////////

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
                  var ratingService = $feathers.service('ratings')
                  ratingService.get($scope.searchedEntity, {
                      query: {
                          $populate: {
                              path: 'entity , schemes',
                              options: {
                                  limit: 5
                              }
                          }
                      }
                  }).then(function(rating) {
                      console.log('showing rating data', rating)
                      $scope.$apply(function() {
                          $scope.searching = false;
                          $scope.entity = rating;
                          $scope.searchKeyword = rating.name;
                        //  $scope.sectors = scheme.sectors;

                        $scope.loadSchemes = function(assessmentData) {
                            // load schemes based on assessment data
                            console.log(assessmentData);
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
                          };

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
                          };

                          $scope.rateScheme = function(scheme, antidote, type) {
                              _.map(scheme.antidotes, function(item) {
                                  if (item == antidote) {
                                      (type) ? item.score = 3: item.score = 0
                                  }
                              })

                          };
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
                          };
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
                          };
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
                          };
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
                          };
                          $scope.rating = 0;
                          $scope.ratings = [{
                              current: 1,
                              max: 5
                          }];

                          $scope.getSelectedRating = function(rating) {
                              $scope.rating.rate = rating;
                          };
                          $scope.addRating = function() {
                              console.log('final rating', $scope.rating)
                              $state.go('scheme')
                          };
                      //////////
                    });
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
          $scope.userRegistered = false

          $scope.checkPassword = function(){
            if ($scope.signup_data.password != $scope.signup_data.cpassword){
                  $scope.passwordError = {
                      type: 'danger',
                      message: 'Ensure You Confirm Your Password'
                  };
                  $scope.registerForm.cpassword.$invalid = false;
                  console.log($scope.registerForm);
            }else {
                  $scope.registerForm.cpassword.$invalid = true;
            }
          }
          $scope.register = function() {

              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);
                  $scope.$apply(function() {
                      $scope.registerData = res
                      $scope.userRegistered = true
                  })

              }).catch(function(err) {
                  $scope.userRegistered = false
                   console.error('Error authenticating!', err)
                   console.log(typeof err);
                   console.log(Object.keys(err));
                   console.log(err.code);

                   if (err.code == 409) {
                     $scope.$apply(function() {
                         $scope.error = {
                             type: 'danger',
                             message: 'Email has been taken. Please use another email address'
                         }
                     })
                   }
                  // console.log(err.match(/Error: E11000 duplicate key error index\d\i/));
              })
          }
      })

      .controller('loginCtrl', function(user, $scope, $rootScope, $state, $stateParams, $feathers, $auth,LocalService) {
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
          };

          $scope.authenticate = function(provider) {
            if (provider == 'facebook') {
              $auth.authenticate(provider).then(function(response){
                console.log('response ===' , response);
                //LocalService.set('satellizer_token' , response.!#access_toke)
                LocalService.set(feathers-jwt ,response["!#access_token"])
                $feathers.authenticate({
                      strategy: 'facebook-token',
                      access_token: response["!#access_token"]
                  }).then(function(response){
                    console.log('facebook token response', response)
                  }).catch(function(err){
                    console.log('facebook token error', err)
                  })
              }).catch (function(error){
                console.log(error);
              });
            }

            if (provider == 'linkedin') {
              $auth.authenticate(provider).then(function(response){
                console.log('response===' ,response);
              }).catch(function(error){
                console.log(error);
              });
            };

            if (provider == 'twitter') {
              $auth.authenticate(provider).then(function(response){
                console.log('response ===' + response);
              }).catch(function(error){
                console.log(error);
              })
            }

            // if (provider == '')
          };

          $scope.login = function() {
              $scope.alert = false;
              $scope.user.type = 'local'
              $feathers.authenticate($scope.user).then(function(res) {
                  console.log(res);

                  $scope.$apply(function() {
                      $scope.error = false
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
                      $scope.error = {
                          type: 'danger',
                          message: 'Email or password is not correct'
                      }
                  })
              })
          };

          $scope.register = function() {
            console.log(' sogin',$scope.signup_data)
            return
              AuthService.signUp($scope.signup_data).then(function(res) {
                  console.log(res);

              }).catch(function(err) {

                  console.log(err);

              })
          }
      })
      .controller('verifyCtrl', function($scope, $state, $stateParams, $feathers) {

      })
