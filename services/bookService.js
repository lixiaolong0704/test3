import Book from '../models/book';
import Remark from '../models/remark';

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

    addRemark(model){
        var _remark = new Remark(model);
        return new Promise((resolver) => {
            _remark.save(function (err) {
                if (err) {
                    console.log(err);
                } else {

                    resolver(_remark._id);
                }
            });
        })

    }

    getBookById(){
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