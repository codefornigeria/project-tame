angular.module('app.controllers', [])

.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}])

.controller('appCtrl', function($scope, Restangular, $state, $stateParams, NgMap, $http, Upload, $timeout) {

    //Services
    Restangular.all('service').getList().then(function(response){
        $scope.services = response;
    });

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

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'https://sahara-health-api.herokuapp.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $scope.image = response.data.response.data.fileUrl;
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        }   
    }
})

