var express = require('express');
var router = express.Router();
var schema = require('async-validator');
var filter = require('filter-object');
var wrap = require('co-express');

import userService from './../services/userService';

var _userService = new userService();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

const handleErrors = (res, errors, fields) => {
    res.json({
        code: -1,
        data: errors
    });
}

router.get('/signout', wrap(function* (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                // return res.redirect('/login');
                res.json({
                    code: 1,
                    data: null
                });
            }
        });
    }
}));

router.get('/getUserInfo', wrap(function* (req, res, next) {
    if (req.session) {
        res.json({
            code: 1,
            data: req.session.userinfo
        });
    }
}));


router.post('/auth', function (req, res, next) {


    var body = Object.assign({}, req.body);
    var descriptor = {
        username: {type: "string", required: true},
        password: {type: "string", required: true}
    }
    var validator = new schema(descriptor)

    validator.validate(body, async (errors, fields) => {
        if (errors) {
            // validation failed, errors is an array of all errors
            // fields is an object keyed by field name with an array of
            // errors per field
            return handleErrors(errors, fields);
        }
        var ps = filter(body, [
            "username",
            "password"
        ]);
        // validation passed
        var data = await _userService.auth(ps);

        req.session.userinfo = data;
        req.session.views = 1;
        // req.session.save(()=>{
        //
        // });
        res.json({
            code: 1,
            data: data
        });


    });


});


router.post('/addUser', function (req, res, next) {


    const handleErrors = (errors, fields) => {
        res.json({
            code: -1,
            data: errors
        });
    }

    var body = Object.assign({}, req.body);
    var descriptor = {
        username: {type: "string", required: true},
        password: {type: "string", required: true}
    }
    var validator = new schema(descriptor)

    validator.validate(body, async (errors, fields) => {
        if (errors) {
            return handleErrors(res, errors, fields);
        }
        var ps = filter(body, [
            "nickname",
            "avatar", //base64
            "username",
            "password",
            "email",
            "phone",
        ]);
        ps.create_time = new Date();

        // validation passed
        await _userService.addUser(ps);
        res.json({
            code: 1,
            data: 'ok'
        });


    });


});

module.exports = router;
