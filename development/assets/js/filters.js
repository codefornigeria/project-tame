angular.module('app.filters', [])

    .filter('asessorType', function () {
        return function (assessor) {
            var txt = 'Public Assessment';
            switch (assessor) {
                case 'public-assessor':
                    txt = 'Public Assessment'
                    break;
                case 'self-assessor':
                    txt = 'Self Assessment'
                    break;
                case 'independent-assessor':
                    txt = 'Independent Assessment'
                    break;
            }
            return txt;
        };
    })
    .filter('countAntidotes', function () {
        return function (data) {
            var antidoteCount = 0
            data.map(rating => {
                rating.antidotes.map(antidote => {
                    antidoteCount++
                })
            })

            return antidoteCount

        };
    })
    .filter('scoreFilter', function () {
        return function (data) {

            if (data <= 0.49) {
                return 'RED'
            }
            else if (data > 0.49 && data <= 0.69) {
                return 'AMBER RED'
            }else   if(data ==0.70) {
          return 'AMBER'
      } else if (data => 0.71 && data <=0.84) {
                return 'AMBER GREEN'
            } else if (data >= 0.85) {
                return ' GREEN'
            }
        }
        
    })

