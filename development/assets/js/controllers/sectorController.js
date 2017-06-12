    angular.module('app.controllers').controller('sectorCtrl', function($scope, $state, $stateParams, $feathers) {

          $scope.showResult = function(sector) {
              console.log('scheme result called', sector)
              $state.go('scheme', {
                  sector: sector._id
              })
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
          $scope.search = function() {
            $state.go('results', {
      query: $scope.searchKeyword
  })
    }
      })