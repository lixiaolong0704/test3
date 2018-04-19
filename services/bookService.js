import Book from '../models/book';
import Remark from '../models/remark';
import _ from 'lodash';

const mongoose = require('mongoose');
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

    addChapter(bookId, chapter) {
        return new Promise((resolver) => {
            Book.update(
                {_id: bookId},
                {$push: {chapters: chapter}},
                (err) => {

                    if (err) {
                        console.log(err);
                    }

                    resolver(chapter._id);

                }
            );

        })
    }

    addP(bookId, p) {
        return new Promise((resolver) => {
            Book.update(
                {_id: bookId},
                {$push: {paragraphs: p}},
                (err) => {
                    if (err) {
                        console.log(err);
                    }
                    resolver(p._id);

                }
            );

        })
    }

    updateBook(model) {


        return new Promise((resolver) => {
            Book.update({_id: model._id}, {
                $set: {
                    'cn_name': model.cn_name,
                    'en_name': model.en_name,
                    'intro': model.intro,
                    'chapters': model.chapters
                }

            }, () => {
                resolver(model._id);
            })


        })


    }


    editRemark(model) {

        return new Promise((resolver) => {

            var _remark = null;
            const callback = function (err) {
                if (err) {
                    console.log(err);
                } else {
                    resolver(_remark ? _remark._id : model._id);
                }
            }
            if (model._id) {
                Remark.update({_id: model._id}, {$set: model}, callback);
            } else {
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
            Book.findOne({_id: '5a5854648a8b0710c327c1dc'}).exec((err, results) => {
                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })

    }

    getBookMainInfoById(book_id) {
        return new Promise((r) => {
            Book.findOne({_id: book_id}).select({
                cn_name: 1,//chinese name
                en_name: 1,//english name
                intro: 1, //简介
                // ref_link:String,
                // ref_content:String,
                chapters: [{
                    title: 1,
                }],
                uid: 1,
                create_time: 1
            }).exec((err, results) => {

                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })
    }


    getParagraphSize(book_id) {

        return new Promise((r) => {
            Book.aggregate(
                [
                    {
                        $project: {
                            _id: 1,
                            paragraphSize: {$size: "$paragraphs"}
                        }
                    },
                    {
                        $match:
                            {_id: mongoose.Types.ObjectId(book_id)}
                    }
                ], (err, results) => {

                    r(results[0]);
                });
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })
    }

    getBookParagraphsOfPg({book_id, start, size, condition}) {


        var find = {_id: '5a52dfcd694dad1b7ce8917c'};

        if (condition) {
            // find['chapters.$._id'] =  condition;
            // find['paragraphs.en_content'] = {
            //     '$regex' : 'Fjzybuccen',
            //     '$options' : 'i'
            // }
            // find.en_name

        }
        console.log(find);
        return new Promise((r) => {
            Book.findOne({_id: "5a52dfcd694dad1b7ce8917c"}
            ).select(
                {
                    chapters: {
                        $elemMatch: {
                            title: {'$regex': 'Fjzybuccen', '$options': 'i'}
                        }
                    }
                }).// select({
            //     chapters: 0,
            //     paragraphs: {
            //         $slice: [start, size]
            //     }

            // }).
            exec((err, results) => {

                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })
    }

    //
    // getBookParagraphsOfPg({book_id, start, size, condition}) {
    //
    //
    //     var find = {_id: '5a52dfcd694dad1b7ce8917c'};
    //
    //     if (condition) {
    //         // find['chapters.$._id'] =  condition;
    //         // find['paragraphs.en_content'] = {
    //         //     '$regex' : condition,
    //         //     '$options' : 'i'
    //         // }
    //         // find.en_name
    //
    //     }
    //     console.log(find);
    //     return new Promise((r) => {
    //         Book.findOne(   { _id: "5a52dfcd694dad1b7ce8917c"}
    //               ).
    //         select( { chapters: { $elemMatch: { title:'Fjzybuccen Dajoucsv Wrimdffdh Thbjtunq Sncigjv Fxzgktmvv Udwwlv Stbj Evii'  } }}).
    //         // select({
    //         //     chapters: 0,
    //         //     paragraphs: {
    //         //         $slice: [start, size]
    //         //     }
    //         // }).
    //         exec((err, results) => {
    //
    //             r(results);
    //         })
    //         // Fragment.find({}, (err, results) => {
    //         //     r(results);
    //         // })
    //     })
    // }


    getBookParagraphsByIndex({book_id, start, size}) {

        return new Promise((r) => {
            Book.findOne({_id: book_id}, {}).select({
                chapters: 0,
                paragraphs: {
                    $slice: [start, size]
                }
            }).exec((err, results) => {

                r(results);
            })
            // Fragment.find({}, (err, results) => {
            //     r(results);
            // })
        })
    }


    getBooksOfPg(query, pgConfig) {

        return new Promise((r) => {
            Book.paginate(query, Object.assign({
                select: {
                    cn_name: 1,
                    en_name: 1,
                    create_time: 1
                }
            }, pgConfig), function (err, result) {
                // result.docs
                // result.total
                // result.limit - 10
                // result.page - 3
                // result.pages
                r(result);
            });
        })


    }


}