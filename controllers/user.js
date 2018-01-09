import Controller from '../Controller';

import {controller, get, post} from '../mvc/helper';

import {method} from "../mvc/helper";
var express = require('express');
var router = express.Router();
var schema = require('async-validator');
var filter = require('filter-object');
var wrap = require('co-express');

import userService from './../services/userService';

var _userService = new userService();

export default class user extends Controller {
    @get("/signout")
    signout(req, res, next) {
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

    }

    @get()
    getUserInfo(req, res, next) {
        if (req.session) {
            res.json({
                code: 1,
                data: req.session.userinfo
            });
        }
    }
    @post("/auth")
    auth(req, res, next) {
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
                this.handleErrors(errors, fields);
            }
            var ps = filter(body, [
                "username",
                "password"
            ]);
            // validation passed
            var data = await _userService.auth(ps);

            req.session.userinfo = data;

            // console.log(req.session.cookie.maxAge);

            req.session.views = 1;
            // req.session.save(()=>{
            //
            // });
            res.json({
                code: 1,
                data: data,
                maxAge:req.session.cookie.maxAge
            });


        });
    }

    addUser(req, res, next) {


        var body = Object.assign({}, req.body);
        var descriptor = {
            username: {type: "string", required: true},
            password: {type: "string", required: true}
        }
        var validator = new schema(descriptor)

        validator.validate(body, async (errors, fields) => {
            if (errors) {
                this.handleErrors(res, errors, fields);
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
    }


}