import readlog from '../models/readlog';


export default class fragmentService {

    addreadlog(model) {

        var _readlog = new readlog(model);
        return new Promise((resolver) => {
            _readlog.save(function (err) {
                if (err) {
                    console.log(err);
                } else {

                    resolver(_readlog._id);
                }
            });
        })


    }


    getLastReadLog() {
        return new Promise((r) => {
            readlog.findOne({}).sort({create_time:-1}).exec((err, results) => {
                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })

    }



}