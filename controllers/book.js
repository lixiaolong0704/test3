import Controller from '../Controller';
import bookService from '../services/bookService';
import {controller, get, post} from '../mvc/helper';

var schema = require('async-validator');
import Mock from 'mockjs';

var _bookService = new bookService();
export default class book extends Controller {
    @post()
    async addBook(req, res, next) {
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

    @get()
    async getBookById(req, res, next) {
        // var rs = yield  _fragmentService.getAllFragments();
        var rs = await  _bookService.getBookById();
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
        this.success(Object.assign(rs, rs1));
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


    @get('/getBooksOfPg/:page')
    async getFragmentsOfPg(req, res, next) {
        var rs = await  _bookService.getBooksOfPg({}, {
            page: req.params.page,
            limit: 5,
            sort:{
                create_time:"desc"
            }

        });
        this.success(rs);
    }


}