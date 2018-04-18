import Controller from '../Controller';
import bookService from '../services/bookService';
import {controller, get, post} from '../mvc/helper';

var filter = require('filter-object');
var schema = require('async-validator');
import _ from 'lodash';
import Mock from 'mockjs';


var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');
var os = require('os');
var es = require('event-stream');
var _bookService = new bookService();

const $uploadBookPath = 'upload/books/';

const uuidv1 = require('uuid/v1');


export default class book extends Controller {

    @post('/upload/:book_id')
    async upload(req, res, next) {
        var _t = this;
        var busboy = new Busboy({headers: req.headers});
        var saveTo = null;
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            saveTo = path.join('.', $uploadBookPath + filename);
            console.log('Uploading: ' + saveTo);
            file.pipe(fs.createWriteStream(saveTo));
        });

        busboy.on('finish', function () {


            var currentChapterId = null;
            var s = fs.createReadStream(saveTo)
                .pipe(es.split())
                .pipe(es.mapSync(async function (line) {

                        // pause the readstream
                        s.pause();
                        console.log('***********' + line);
                        // /^####(.+)####$/.tes
                        var chapterRegex = /^####(.+)####$/;

                        if (chapterRegex.test(line)) {

                            currentChapterId = (uuidv1()+'').replace(/-/g,'');
                            await _bookService.addChapter(req.params.book_id, {
                                title: line.replace(/^####(.+)####$/, "$1"),
                                chapter_id: currentChapterId
                            });

                            s.resume();
                        } else {
                            await _bookService.addP(req.params.book_id, {
                                en_content: line,
                                chapter_id: currentChapterId
                            });
                            s.resume();

                        }


                        // resume the readstream, possibly from a callback

                    })
                        .on('error', function (err) {
                            console.log('Error while reading file.', err);
                        })
                        .on('end', function () {
                            console.log('Read entire file.')
                            _t.success("ok");
                        })
                );
            // fs.readFile(saveTo, 'utf8', function (err, data) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log('OK: ' + saveTo);
            //     console.log(data)
            //     console.log('Upload complete' + $uploadBookPath + req.params.book_id);
            //     // res.writeHead(200, { 'Connection': 'close' });
            //     // res.end("That's all folks!");
            //
            //
            //
            //
            //
            //     _t.success("ok");
            // });
            // _t.success("ok");

        });
        return req.pipe(busboy);


    }

    @post()
    async addBook(req, res, next) {

        var descriptor = {
            cn_name: {type: "string", required: true},
            en_name: {type: "string", required: true},
            intro: {type: "string", required: true}
        }


        var body = Object.assign({}, req.body);
        var validator = new schema(descriptor);

        validator.validate(body, async (errors, fields) => {
            if (errors) {
                return this.handleErrors(res, errors, fields);
            }

            let model = {
                ...filter(body, _.keys(descriptor)), //get descriptor properties
                chapters: req.body.chapters
            };

            if (req.body._id) { //update
                model._id = req.body._id;
                model.last_update_time = new Date()
            } else {
                model.create_time = new Date();
            }

            var _id = await _bookService.addBook(model);
            if (_id) {

                this.success(_id);
            }

        });
    }

    @post()
    async updateBook(req, res, next) {
        var descriptor = {
            cn_name: {type: "string", required: true},
            en_name: {type: "string", required: true},
            intro: {type: "string", required: true}
        }


        var body = Object.assign({}, req.body);
        var validator = new schema(descriptor);

        validator.validate(body, async (errors, fields) => {
            if (errors) {
                return this.handleErrors(res, errors, fields);
            }

            let model = {
                ...filter(body, _.keys(descriptor)), //get descriptor properties
                chapters: req.body.chapters
            };

            if (req.body._id) { //update
                model._id = req.body._id;
                model.last_update_time = new Date()
                var _id = await _bookService.updateBook(model);
                if (_id) {
                    this.success(_id);
                }
            }


        });
    }

    @post()
    async addBookO(req, res, next) {
        let model = Mock.mock({
            cn_name: "@cword(10)",//chinese name
            en_name: "@word(5)",//english name
            intro: "时间简史不错呀", //简介

            // ref_link:String,
            // ref_content:String,
            "chapters|5": [{
                title: "@title(5, 10)",
            }],
            "paragraphs|100": [{
                en_content: "@increment() @paragraph()",
                chapter_id: ""

            }],
            uid: req.session.userinfo._id,
            create_time: new Date()
        });
        var _id = await _bookService.addBook(model);
        // console.log(model);
        // var _id= 1;
        if (_id) {
            this.success(_id);
        }
    }

    @get("/getBookById/:book_id")
    async getBookById(req, res, next) {
        // var rs = yield  _fragmentService.getAllFragments();
        var rs = await  _bookService.getBookMainInfoById(req.params.book_id);
        this.success(rs);
    }


    paragraphBatchSize = 10

    @get("/getBookMainInfoById/:book_id/:batchNum")
    async getBookMainInfoById(req, res, next) {
        var rs = await  _bookService.getBookMainInfoById(req.params.book_id);
        var rs1 = await  _bookService.getBookParagraphsByIndex({
            // book_id: "5a5863be1381c8180ff12c3c",
            book_id: req.params.book_id,
            start: (req.params.batchNum - 1) * this.paragraphBatchSize,
            size: this.paragraphBatchSize
        });
        var data = await _bookService.getParagraphSize(req.params.book_id);
        this.success(Object.assign(rs.toObject({getters: true}), rs1.toObject({getters: true}), {psize: data.paragraphSize}));
    }

    @get("/getBookParagraphsByIndex/:book_id/:batchNum")
    async getBookParagraphsByIndex(req) {
        var rs = await  _bookService.getBookParagraphsByIndex({
            // book_id: "5a5863be1381c8180ff12c3c",
            book_id: req.params.book_id,
            start: (req.params.batchNum - 1) * this.paragraphBatchSize,
            size: this.paragraphBatchSize

        });
        this.success(rs);
    }

    @get("/getBookParagraphsOfPg/:book_id/:pageNumber/:condition?")
    async getBookParagraphsOfPg(req) {
        var rs = await  _bookService.getBookParagraphsOfPg({
            // book_id: "5a5863be1381c8180ff12c3c",
            book_id: req.params.book_id,
            start: (req.params.pageNumber - 1) * this.paragraphBatchSize,
            size: this.paragraphBatchSize,
            condition:req.params.condition

        });
        this.success(rs);
    }

    @get('/getBooksOfPg/:page/:limit')
    async getFragmentsOfPg(req, res, next) {
        var limit = req.params.limit ? parseInt(req.params.limit) : 30;
        if (limit > 30) {
            this.success(null);
        }
        var rs = await  _bookService.getBooksOfPg({}, {
            page: req.params.page,
            limit: limit,
            sort: {
                create_time: "desc"
            }

        });
        this.success(rs);
    }


}