   angular.module('app.controllers').controller('entityRatingCtrl', function($scope, Restangular, $state, $stateParams, $feathers,$rootScope) {
        console.log('entity ratings page')
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

          $scope.viewEntity()

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