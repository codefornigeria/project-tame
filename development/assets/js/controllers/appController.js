  angular.module('app.controllers')
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
          var ratingsService = $feathers.service('rating')
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
            $state.go('results', {
      query: $scope.searchKeyword
  })
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