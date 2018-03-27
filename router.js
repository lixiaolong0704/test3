// var index = require('./routes/index');
// var users = require('./routes/users');


// import bookCtl from './controllers/book';
var express = require('express');


import userCtl from './controllers/user';
import bookCtl from './controllers/book';
import remarkCtl from './controllers/remark';
import readlogCtl from './controllers/readlog';
export default function init(app) {


    const setUp = (Ctl) => {
        var _ctl = new Ctl();

        let router = express.Router();
        // console.log(_ctl.constructor.name)
        for (let name of Object.getOwnPropertyNames(Object.getPrototypeOf(_ctl))) {
            let method = _ctl[name];
            // Supposedly you'd like to skip constructor
            if (!(method instanceof Function) || method === 'constructor') continue;
            // console.log(method, name);


            //ano :{method: "post", path: "/auth", middleware: Array[0]}
            var ano = Reflect.getMetadata(`$$route_${name}`, _ctl, name);

            if (!ano) {
                // console.log(`method not found  ${_ctl.constructor.name}   ${name} `)
                continue
            } else {
                var path = ano.path ? ano.path : `/${name}`;
                console.log(`support url /${_ctl.constructor.name}/${path}`)
                //exec when has decorators--
                //todo router第二个参数不能用lambda
                router[ano.method](path, function (req, res, next) {
                    _ctl.context={
                        req,
                        res
                    }

                    // console.log(arguments);
                    _ctl[name].apply(_ctl, arguments);
                })

            }


        }
        //setup base url
        app.use(`/${_ctl.constructor.name}`, router);


    }


    // app.use('/', index);
    // app.use('/users', users);
    setUp(userCtl);
    setUp(bookCtl);
    setUp(remarkCtl);
    setUp(readlogCtl);



}