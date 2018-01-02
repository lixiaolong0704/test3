import fragmentService from './../services/fragmentService';


var express = require('express');
var router = express.Router();
var wrap = require('co-express');


var _fragmentService = new fragmentService();

/* GET home page. */
router.get('/', wrap(function* (req, res, next) {
    res.render('index', {title: 'Express111'});

}));

router.post('/addFragment', wrap(function* (req, res, next) {

    let model={
        name:req.body.name,
        ref_link:req.body.ref_link,
        ref_content:req.body.ref_content,
        create_time:new Date(),
    }
    var _id = yield _fragmentService.addFragment(model);
    if (_id) {
        res.json({
            code: 1,
            data: _id
        });

    }
}));
router.post('/updateFragment', wrap(function* (req, res, next) {

    let model={
        _id:req.body._id,
        name:req.body.name,
        ref_link:req.body.ref_link,
        ref_content:req.body.ref_content
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

module.exports = router;
