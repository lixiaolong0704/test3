import Controller from '../Controller';
import {controller, get, post} from '../mvc/helper';
import readlogService from '../services/readlogService';

var filter = require('filter-object');
var schema = require('async-validator');
import _ from 'lodash';

var _readlogService = new readlogService();

export default class readlog extends Controller {

    @post("/addreadlog")
    async addreadlog(req, res, next) {
        let model = {
            create_time: new Date(),
            book_id: req.body.book_id,
            top_batch_num: req.body.top_batch_num,
            bottom_batch_num: req.body.bottom_batch_num,
        }
        var _id = await _readlogService.addreadlog(model);
        if (_id) {
            res.json({
                code: 1,
                data: _id
            });

        }
    }

    @get()
    async getLastReadLog(req, res, next) {
        var rs = await  _readlogService.getLastReadLog();
        res.json({
            code: 1,
            data: rs
        });
    }


}


