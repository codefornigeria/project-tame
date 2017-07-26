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

.directive('schemeCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-card.html"
    }
})
.directive('ratingCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/directives/ratingcard.html",
       replace:true,
        link:function(scope,elem,attrs){
            console.log(scope)
        }
    }
})
.directive('ratingBadge' , function(){
  return {
    restrict: 'EA',
    replace:true,
       templateUrl: "modules/directives/ratingcard.html",
     scope:{
      rating:'='
    },
    link:function(scope, elem, attrs){
        console.log('bbadge', scope.rating)
      if(scope.rating.score <= 0.49){
        scope.badge = "red"
      }
        if(scope.rating.score > 0.49 && scope.rating.score <=0.69 ){
        scope.badge = "amber-red"
      }
      
      if(scope.rating.score == 0.70 ){
        scope.badge = "amber"
      }
        if(scope.rating.score > 0.70 && scope.rating.score <=0.84 ){
        scope.badge = "amber-green"
      }
        if(scope.rating.score > 0.85){
            scope.badge = "green"
        }
        }
    }
    })
.directive('entityBadge' , function(){
  return {
    restrict: 'EA',
    replace:true,
       templateUrl: "modules/directives/entitycard.html",
    
    link:function(scope, elem, attrs){
        
    }
  }
})
.directive('bootstrapWizard', function(){
    return {
        restrict:'EA',
     replace:true,
       templateUrl: "modules/directives/ratingwizard.html",
        link: function(scope,elem, attrs){
            // $timeout(function(){
            //     console.log('timeout called', 4000)
            // })
            console.log('the firective', scope)
             scope.$watchCollection('schemerater',function(newVal,oldVal){
                console.log('oldval', oldVal)
                console.log('newval', newVal)
                if(newVal.length){
                 elem.bootstrapWizard({onTabShow: function(tab, navigation, index) {
            var $total = navigation.find('li').length;
            var $current = index+1;
            var $percent = ($current/$total) * 100;
            elem.find('.bar').css({width:$percent+'%'});
          }})
          
                }
            })
        }
    }
})
.directive('starDisplayRating', function () {
    return {
        restrict: 'EA',
        template:'<div class="rating-point">'+
                 '<button class="button" type="button" id="star1">1</button>'+
                 '<button class="button" type="button" id="star2">2</button>'+
                 '<button class="button" type="button" id="star3">3</button>'+
                 '<button class="button" type="button"  id="star4">4</button>'+
                 '<button class="button" type="button" id="star5">5</button>'+
               '</div>',
      
       
        link: function (scope, elem, attrs) {
            console.log('showing star display', scope)
            var ratingValue = scope.theRating.score *5
            switch (ratingValue){
                case 1:
                    $('#star1').siblings().removeClass('active')
                $('#star1').addClass('active')
                break;
                  case 2:
                    $('#star2').siblings().removeClass('active')
                $('#star2').addClass('active')
                break;
                  case 3:
                    $('#star3').siblings().removeClass('active')
                $('#star3').addClass('active')
                break;
                  case 4:
                    $('#star4').siblings().removeClass('active')
                $('#star4').addClass('active')
                break;
                case '5':
                    $('#star5').siblings().removeClass('active')
                $('#star5').addClass('active')
                break;

            }
           

            scope.setValue = function (index) {
                   elem.bind('click', function(e){
                scope.ratin.score = index;
                  $(e.target).siblings().removeClass('active')
                $(e.target).addClass('active')
                // scope.onRatingSelected({
                //     rating: index + 1
                // });
            })

               
            scope.$watch('ratingValue', function (oldVal, newVal) {
                console.log('star old', oldVal);
                console.log('star new', newVal)
            });
          
        
    }
        }
    }
})
.directive('starRating', function () {
    return {
        restrict: 'EA',
        template:'<div class="rating-point">'+
                 '<button class="button" type="button"  ng-click=setValue(1)>1</button>'+
                 '<button class="button" type="button" ng-click=setValue(2)>2</button>'+
                 '<button class="button" type="button" ng-click=setValue(3)>3</button>'+
                 '<button class="button" type="button"  ng-click=setValue(4)>4</button>'+
                 '<button class="button" type="button" ng-click=setValue(5)>5</button>'+
               '</div>',
      
       
        link: function (scope, elem, attrs) {
            console.log('showing', scope)
            var updateStars = function () {
                scope.stars = [];
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push({
                        filled: i < scope.ratingValue
                    });
                }
            };

            scope.setValue = function (index) {
                   elem.bind('click', function(e){
                scope.ratin.score = index;
                  $(e.target).siblings().removeClass('active')
                $(e.target).addClass('active')
                // scope.onRatingSelected({
                //     rating: index + 1
                // });
            })

               
            
          
        
    }
        }
    }
}).directive('userType', function(){
    return {
        restrict:'EA',
         templateUrl: "modules/directives/usertype.html",
         link: function(scope,elem,attrs){
             elem.bind('click', function(e){
                 console.log('data', $(e.target).data('usertype'))
                 $(e.target).siblings().removeClass('btn-primary').addClass('btn-secondary')
                 if( $(e.target).hasClass('btn-secondary')){
                     
                      $(e.target).removeClass('btn-secondary').addClass('btn-primary')
                 }else  if( $(e.target).hasClass('btn-primary')){
                      $(e.target).removeClass('btn-primary').addClass('btn-secondary')
                 }
                 scope.$apply(function(){
                     scope.signup_data.userType = $(e.target).data('usertype')
                 })
               })
         
         }
    }
})
.directive('entityCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/entity-card.html"
    }
})
.directive('schemeEntityCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-entity-card.html"
    }
})
.directive('schemeAntidoteCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-antidote-card.html"
    }
})
.directive('schemeEffectCard', function () {
    return {
        restrict: 'EA',
        templateUrl: "modules/scheme-effect-card.html"
    }
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
