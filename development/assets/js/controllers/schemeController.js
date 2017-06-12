   angular.module('app.controllers') .controller('schemeCtrl', function($scope, $state, $stateParams, $feathers) {
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