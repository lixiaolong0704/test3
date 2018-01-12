
const mongoose = require('mongoose');
//todo 连接放的位置可能不对
var options = {
    useMongoClient: true,
    // autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    // reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};
mongoose.connect('mongodb://localhost/moli_v2',options);
mongoose.Promise = global.Promise;


export default mongoose;