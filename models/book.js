import mongoose from '../mongo';

var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({
    cn_name: String,//chinese name
    en_name: String,//english name
    intro: String, //简介

    // ref_link:String,
    // ref_content:String,
    chapters: [{
        title: String,
    }],
    paragraphs: [{
        en_content:String,
        chapter_id:String

    }],
    uid: String,
    create_time: Date
})
schema.plugin(mongoosePaginate);
var Book = mongoose.model('book', schema);

export default Book;