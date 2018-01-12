import Controller from '../Controller';
import {controller, get, post} from '../mvc/helper';
import bookService from '../services/bookService';
var filter = require('filter-object');
var schema = require('async-validator');
import _ from 'lodash';
var _bookService = new bookService();
export default class remark extends Controller {

    @post()
    async getRemarksByParagraphIds(req, res, next) {
        var rs = await  _bookService.getRemarksByParagraphIds({
            book_id: req.body.book_id,
            paragraph_ids: req.body.paragraph_ids ? req.body.paragraph_ids.split(".") : null
        });
        res.json({
            code: 1,
            data: rs
        });

    }
    @post()
    async getRemarksByPosOfParagraph(req, res, next) {
        var rs = await  _bookService.getRemarksByPosOfParagraph({
            book_id: req.body.book_id,
            paragraph_id: req.body.paragraph_id,
            start: req.body.start,
            end: req.body.end
        });
        res.json({
            code: 1,
            data: rs
        });
    }

    @post()
    editRemark(req, res, next) {
        var descriptor = {
            text: {type: "string", required: true},
            remark: {type: "string", required: true},
            start: {type: "number", required: true},
            end: {type: "number", required: true},
            book_id: {type: "string", required: true},
            paragraph_id: {type: "string", required: true}
        }

        var body = Object.assign({}, req.body);
        var validator = new schema(descriptor);

        validator.validate(body, async (errors, fields) => {
            if (errors) {
                return this.handleErrors(res, errors, fields);
            }

            let model = {
                ...filter(body, _.keys(descriptor)), //get descriptor properties
                type: "",
                uid: req.session.userinfo._id,
            };

            if (req.body._id) { //update
                model._id = req.body._id;
                model.last_update_time = new Date()
            } else {
                model.create_time = new Date();
            }

            var _id = await _bookService.editRemark(model);
            if (_id) {
                res.json({
                    code: 1,
                    data: _id
                });

            }

        });
    }


}