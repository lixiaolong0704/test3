
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/moli_v2');
mongoose.Promise = global.Promise;


export default mongoose;