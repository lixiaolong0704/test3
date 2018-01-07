import mongoose from '../mongo';
var mongoosePaginate = require('mongoose-paginate');

var schema = new mongoose.Schema({

    // _id: String,
    nickname:String,
    avatar:String, //base64
    username: String,
    password:String,
    email:String,
    phone:String,
    create_time: Date,
    last_login_time:Date,
})
schema.plugin(mongoosePaginate);
var User = mongoose.model('user', schema);

export default User;