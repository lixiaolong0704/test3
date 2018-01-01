import mongoose from '../mongo';

var Fragment = mongoose.model('fragment', {
        name: String,
        ref_link:String,
        ref_content:String,
        create_time:Date
    }
);

export default Fragment;
// var kitty = new Cat({name: 'Zildjian'});
// kitty.save(function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('meow');
//     }
// });