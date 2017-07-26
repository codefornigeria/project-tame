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
     data.map(rating=>{
            rating.antidotes.map(antidote =>{
                antidoteCount++
            })
        })

        return antidoteCount
      
    };
})
.filter('antidoteState', function () {
    return function (data, ratingData) {
      //  console.log('the data', data)
      //  console.log('the rating', ratingData)     //   var antidoteCount = 0
        var item  = _.find(ratingData.schemerater ,(o)=>{
            console.log('thr r' , o)
            return o._id == data._id
        })
        console.log('the item ', item)
        // data.map(rating=>{
        //     rating.antidotes.map(antidote =>{
        //         antidoteCount++
        //     })
        // })
        return false
       // return antidoteCount
      
    };
})


