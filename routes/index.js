import fragmentService from './../services/fragmentService';


var express = require('express');
var router = express.Router();




var _fragmentService =new fragmentService();

/* GET home page. */
router.get('/', function (req, res, next) {

    _fragmentService.addFragment();

    // var Cat = mongoose.model('test', {name: String});

    // var kitty = new Cat({name: 'Zildjian'});
    // kitty.save(function (err) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('meow');
    //     }
    // });

    res.render('index', {title: 'Express111'});
});

module.exports = router;
