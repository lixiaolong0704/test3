import Book from '../models/book';
import Remark from '../models/remark';
import _ from 'lodash';

export default class bookService {

    addBook(model) {

        var _book = new Book(model);
        return new Promise((resolver) => {
            _book.save(function (err) {
                if (err) {
                    console.log(err);
                } else {

                    resolver(_book._id);
                }
            });
        })


    }

    editRemark(model) {

        return new Promise((resolver) => {

            var _remark =null;
            const callback=function (err) {
                if (err) {
                    console.log(err);
                } else {
                    resolver(_remark?_remark._id:model._id);
                }
            }
            if(model._id){
                Remark.update({_id:model._id},{$set:model},callback);
            }else{
                _remark = new Remark(model);
                _remark.save(callback);
            }
            // _remark[?"update":"save"]();
        })

    }

    getRemarksByPosOfParagraph({
                                   book_id,
                                   paragraph_id,
                                   start,
                                   end
                               }) {

        return new Promise((r) => {
            Remark.find({
                book_id,
                paragraph_id
            }).where("start").lte(end)
                .where("end").gte(start)
                .exec((err, results) => {
                    r(results);
                })
        })


    }

    getRemarksByParagraphIds({
                                 book_id,
                                 paragraph_ids
                             }) {

        return new Promise((r) => {
            Remark.find({
                book_id
            }).where("paragraph_id").in(paragraph_ids)
                .select({
                    // text: 1,
                    // remark: 1,
                    start: 1,
                    end: 1,
                    type: 1,
                    book_id: 1,
                    paragraph_id: 1
                })
                .exec((err, results) => {
                    var remarkGroups = _.groupBy(results, p => p.paragraph_id);
                    r(remarkGroups);
                })
        })

    }

    getBookById() {
        return new Promise((r) => {
            Book.findOne({}).exec((err, results) => {
                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })

    }


}