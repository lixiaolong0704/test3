import mongoose from '../mongo';
var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({

    // _id: String,
    text: String,
    remark: String,
    // selectionElemementsData?: any


    start: Number,
    end: Number,
    type:String,

    book_id:String,
    paragraph_id:String,

    uid:String,
    create_time:Date,
    last_update_time:Date



})
schema.plugin(mongoosePaginate);
var Remark = mongoose.model('remark', schema);

export default Remark;