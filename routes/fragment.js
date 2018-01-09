import fragmentService from './../services/fragmentService';
import bookService from './../services/bookService';
import Mock from 'mockjs';

var filter = require('filter-object');
var schema = require('async-validator');
var express = require('express');
var router = express.Router();
var wrap = require('co-express');
var _fragmentService = new fragmentService();
var _bookService = new bookService();


const handleErrors = (res, errors, fields) => {
    res.json({
        code: -1,
        data: errors
    });
}
import _ from 'lodash';



module.exports = router;
