import Fragment from '../models/fragment';

export default class fragmentService {

    addFragment(model) {

        var _fragment = new Fragment(model);
        return new Promise((resolver) => {
            _fragment.save(function (err) {
                if (err) {
                    console.log(err);
                } else {

                    resolver(_fragment._id);
                }
            });
        })


    }

    updateFragment(model) {


        return new Promise((resolver) => {
            Fragment.update({_id: model._id},
                {$set: model},
                function (err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('meow');
                        resolver(true);
                    }
                });
        })


    }

    getAllFragments() {
        return new Promise((r) => {
            Fragment.find({}).sort({create_time:-1}).exec((err, results) => {
                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })


    }


}