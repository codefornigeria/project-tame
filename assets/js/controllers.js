angular.module('app.controllers', [])

.controller('appCtrl', function($scope, Restangular, $state, $stateParams, NgMap, $http, Upload, $timeout, $location) {

    //Services
    Restangular.all('person').getList().then(function(response){
        $scope.menuItems = response;
    });

    $scope.setActive = function(menuItem) {
        $scope.activeMenu = menuItem;
    }

    $scope.addNewService = function() {
        $scope.services.push ({name: $scope.track.newService});
        Restangular.all('service').post({name: $scope.track.newService}).then(function(response) {
            $scope.track.service = $scope.track.newService;
            $scope.track.newService = '';
        }), function(error){
            $scope.error = error;
            console.log(error)
        };
    }

    $scope.openOverlay = function() {
        $scope.submitted = true;
        $scope.overlay = true;
    }
    $scope.close = function() {
        $scope.overlay = false;
        $state.reload();
    }

    $scope.steps = [
        'Step 1',
        'Step 2',
        'Step 3',
        'Step 4',
        'Step 5',
        'Step 6',
        'Step 7',
        'Step 8'
    ];
    $scope.selection = $scope.steps[0];

    $scope.getCurrentStepIndex = function(){
        // Get the index of the current step given selection
        return _.indexOf($scope.steps, $scope.selection);
    };

      // Go to a defined step index
    $scope.goToStep = function(index) {
        if ( !_.isUndefined($scope.steps[index]) )
        {
          $scope.selection = $scope.steps[index];
        }
    };

    $scope.hasNextStep = function(){
        var stepIndex = $scope.getCurrentStepIndex();
        var nextStep = stepIndex + 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[nextStep]);
    };

    $scope.hasPreviousStep = function(){
        var stepIndex = $scope.getCurrentStepIndex();
        var previousStep = stepIndex - 1;
        // Return true if there is a next step, false if not
        return !_.isUndefined($scope.steps[previousStep]);
    };

    $scope.incrementStep = function() {
        if ( $scope.hasNextStep() )
        {
          var stepIndex = $scope.getCurrentStepIndex();
          var nextStep = stepIndex + 1;
          $scope.selection = $scope.steps[nextStep];
        }
    };

    $scope.decrementStep = function() {
        if ( $scope.hasPreviousStep() )
        {
          var stepIndex = $scope.getCurrentStepIndex();
          var previousStep = stepIndex - 1;
          $scope.selection = $scope.steps[previousStep];
        }
    };
})

