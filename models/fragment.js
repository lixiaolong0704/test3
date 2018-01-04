import mongoose from '../mongo';
var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    name: String,
    ref_link:String,
    ref_content:String,
    create_time:Date
})
schema.plugin(mongoosePaginate);
var Fragment = mongoose.model('fragment', schema);

export default Fragment;
// var kitty = new Cat({name: 'Zildjian'});
// kitty.save(function (err) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log('meow');
//     }
// });