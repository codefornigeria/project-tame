angular.module('app.filters', [])

.filter('asessorType', function () {
    return function (assessor) {
        var txt = 'Public Assessment';
        switch (assessor){
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
        console.log('data',data)
        data.map(rating=>{
            rating.antidotes.map(antidote =>{
                antidoteCount++
            })
        })

        return antidoteCount
      
    };
})


