var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var sassMiddleware = require('node-sass-middleware');

var getReply = function* (msg) {
    //...
    return 'abc';
}

var a = getReply();
console.log(a);

var session = require('express-session');
import mongoose from './mongo';
import init from './router';

const MongoStore = require('connect-mongo')(session);

var app = express();


//todo
// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
// }
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'bbb cat',
    resave: false,
    saveUninitialized: false,

    //todo HTTPS if secure is true
    cookie: {
        secure: false,
        // maxAge: 60000
        maxAge:new Date(Date.now() + (6000000000))
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
        autoRemove: 'interval',
        autoRemoveInterval: 10 // In minutes. Default
    })
}))

//should put before other router
app.use(function (req, res, next) {
    console.log('Time:', Date.now())

    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3003');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Token");
    // res.setHeader("Content-Type", "application/json;charset=UTF-8");

    next()
})

app.use(function (req, res, next) {
    // if (!req.session.views) {
    //     req.session.views = {}
    // }
    //
    // // get the url pathname

    if (req.path.indexOf("user") >= 0) {
        next()
    } else {

        if (req.session.userinfo) {
            next();
        } else {
            res.json({
                code: -2,
                data: "time out" + req.session.cookie.maxAge
            });
        }
    }

    //
    // // count the views
    // req.session.views[pathname] = (req.session.views[pathname] || 0) + 1


})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
var router = express.Router()

init(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
