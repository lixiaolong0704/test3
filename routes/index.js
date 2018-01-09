import fragmentService from './../services/fragmentService';
import bookService from './../services/bookService';
import Mock from 'mockjs';

var filter = require('filter-object');
var schema = require('async-validator');
var express = require('express');
var router = express.Router();
var wrap = require('co-express');

const handleErrors = (res, errors, fields) => {
    res.json({
        code: -1,
        data: errors
    });
}
import _ from 'lodash';

/* GET home page. */
router.get('/', wrap(function* (req, res, next) {
    res.render('index', {title: 'Express111'});

}))

router.post('/getRemarksByParagraphIds', wrap(function* (req, res, next) {
    var rs = yield  _bookService.getRemarksByParagraphIds({
        book_id: req.body.book_id,
        paragraph_ids: req.body.paragraph_ids ? req.body.paragraph_ids.split(".") : null
    });
    res.json({
        code: 1,
        data: rs
    });
}));
router.post('/getRemarksByPosOfParagraph', wrap(function* (req, res, next) {
    var rs = yield  _bookService.getRemarksByPosOfParagraph({
        book_id: req.body.book_id,
        paragraph_id: req.body.paragraph_id,
        start: req.body.start,
        end: req.body.end
    });
    res.json({
        code: 1,
        data: rs
    });
}));

router.post('/editRemark', wrap(function* (req, res, next) {

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
            return handleErrors(res, errors, fields);
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


}));




router.post('/addFragment', wrap(function* (req, res, next) {

    let model = {
        name: req.body.name,
        ref_link: req.body.ref_link,
        ref_content: req.body.ref_content,
        create_time: new Date(),
    }
    var _id = yield _fragmentService.addFragment(model);
    if (_id) {
        res.json({
            code: 1,
            data: _id
        });

    }
}));

router.post('/test', wrap(function* (req, res, next) {

    for (let i = 0; i < 1000000000000; i++) {
        let model = {
            name: "new" + i,
            ref_link: 'www.baidu.com',
            ref_content: 'Design new APIs, or edit existing ones, in a powerful editor which visually renders your OAS/Swagger definition with concise, real time feedback and error handling.',
            create_time: new Date(),
        }
        // console.log(i);
        yield _fragmentService.addFragment(model);
    }
    res.json({
        code: 1,
        data: 'ok'
    });


}));

router.post('/updateFragment', wrap(function* (req, res, next) {

    let model = {
        _id: req.body._id,
        name: req.body.name,
        ref_link: req.body.ref_link,
        ref_content: req.body.ref_content
    }
    var isOk = yield _fragmentService.updateFragment(model);
    if (isOk) {
        res.json({
            code: 1,
            data: ''
        });

    }
}));
router.get('/getAllFragments', wrap(function* (req, res, next) {
    var rs = yield  _fragmentService.getAllFragments();
    res.json({
        code: 1,
        data: rs
    });
}));

router.get('/getFragmentsOfPg/:page', wrap(function* (req, res, next) {
    var rs = yield  _fragmentService.getFragmentsOfPg({page: req.params.page, limit: 5});
    res.json({
        code: 1,
        data: rs
    });
}));

module.exports = router;
