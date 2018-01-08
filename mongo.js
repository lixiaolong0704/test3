
const mongoose = require('mongoose');
//todo 连接放的位置可能不对
mongoose.connect('mongodb://localhost/moli_v2');
mongoose.Promise = global.Promise;


export default mongoose;