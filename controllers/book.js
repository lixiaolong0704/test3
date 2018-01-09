import Controller from '../Controller';
import bookService from '../services/bookService';
import {controller, get, post} from '../mvc/helper';

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
            "chapters|10": [{
                title: "@title(5, 10)",
            }],
            "paragraphs|10": [{
                en_content: "@paragraph()",
                chapter_id: ""

            }],
            uid: req.session.userinfo._id,
            create_time: new Date()
        });
        var _id = await _bookService.addBook(model);
        // console.log(model);
        // var _id= 1;
        if (_id) {
            res.json({
                code: 1,
                data: _id
            });

        }
    }

    @get()
    async getBookById (req, res, next) {
        // var rs = yield  _fragmentService.getAllFragments();
        var rs = await  _bookService.getBookById();
        res.json({
            code: 1,
            data: rs
        });
    }


    @get('/getBooksOfPg/:page')
    async getFragmentsOfPg(req, res, next){
        var rs = await  _bookService.getBooksOfPg({page: req.params.page, limit: 5});
        res.json({
            code: 1,
            data: rs
        });
    }


}