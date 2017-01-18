angular.module('app.directives', [])

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        })
    };
})

.directive('personCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/person-card.html"
    }
})

.directive('projectCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/project-card.html"
    }
})

.directive('projectLoader', function () {
	return {
        restrict: 'EA',
		template: '<div class="overlay" ng-if="!project"><div class="spinner"><div class="spinner__item1"></div><div class="spinner__item2"></div><div class="spinner__item3"></div><div class="spinner__item4"></div></div></div>'
	}
})

.directive('loader', function () {
	return {
        restrict: 'EA',
		template: '<div class="overlay" ng-if="searching"><div class="spinner"><div class="spinner__item1"></div><div class="spinner__item2"></div><div class="spinner__item3"></div><div class="spinner__item4"></div></div></div>'
	}
})

.directive('starRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '=',
            onRatingSelected: '&'
        },
        link: function (scope, elem, attrs) {

            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.toggle = function (index) {
                scope.ratingValue = index + 1;
                scope.onRatingSelected({
                    rating: index + 1
                });
            };

            scope.$watch('ratingValue', function (oldVal, newVal) {
                if (newVal) {
                    updateStars();
                }
            });
        }
    }
})

.directive('healthRating', function () {
    return {
        restrict: 'A',
        template: '<ul class="rating">' +
            '<li ng-repeat="star in stars" ng-class="star">' +
            '\u2605' +
            '</li>' +
            '</ul>',
        scope: {
            ratingValue: '=',
            max: '='
        },
        link: function (scope, elem, attrs) {
            scope.stars = [];
            for (var i = 0; i < scope.max; i++) {
                scope.stars.push({
                    filled: i < scope.ratingValue
                });
            }
        }
    }
})

.run(['$rootScope', '$state',function($rootScope, $state){

  $rootScope.$on('$stateChangeStart',function(){
      $rootScope.stateIsLoading = true;
 });


  $rootScope.$on('$stateChangeSuccess',function(){
      $rootScope.stateIsLoading = false;
 });

}]);