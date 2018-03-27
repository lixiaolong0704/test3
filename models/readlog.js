import mongoose from '../mongo';

var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    create_time: Date,
    book_id: String,
    top_batch_num: Number,
    bottom_batch_num: Number
})
schema.plugin(mongoosePaginate);
var readlog = mongoose.model('readlog', schema);

export default readlog;