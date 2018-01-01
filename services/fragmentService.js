import Fragment from '../models/fragment';
export default class fragmentService{

     addFragment(){

        var _fragment = new Fragment({
            name: 'Zildjian'
        });
         _fragment.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('meow');
            }
        });

    }



}