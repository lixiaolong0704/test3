

import Controller from '../Controller';
import {controller, get, post} from '../mvc/helper';

export default class fragment extends Controller{

    @post()
    addFragment(req, res, next){
        let model = {
            name: req.body.name,
            ref_link: req.body.ref_link,
            ref_content: req.body.ref_content,
            create_time: new Date(),
        }
        var _id = yield _fragmentService.addFragment(model);
        if (_id) {
            res.json({
                code: 1,
                data: _id
            });

        }
    }
    @get()
    test(req, res, next){

        for (let i = 0; i < 1000000000000; i++) {
            let model = {
                name: "new" + i,
                ref_link: 'www.baidu.com',
                ref_content: 'Design new APIs, or edit existing ones, in a powerful editor which visually renders your OAS/Swagger definition with concise, real time feedback and error handling.',
                create_time: new Date(),
            }
            // console.log(i);
            yield _fragmentService.addFragment(model);
        }
        res.json({
            code: 1,
            data: 'ok'
        });

    }
    @post()
    updateFragment(req, res, next){
        let model = {
            _id: req.body._id,
            name: req.body.name,
            ref_link: req.body.ref_link,
            ref_content: req.body.ref_content
        }
        var isOk = yield _fragmentService.updateFragment(model);
        if (isOk) {
            res.json({
                code: 1,
                data: ''
            });

        }
    }

    @get()
    getAllFragments(req, res, next){
        var rs = yield  _fragmentService.getAllFragments();
        res.json({
            code: 1,
            data: rs
        });
    }
    @get('/getFragmentsOfPg/:page')
    getFragmentsOfPg(req, res, next){
        var rs = yield  _fragmentService.getFragmentsOfPg({page: req.params.page, limit: 5});
        res.json({
            code: 1,
            data: rs
        });
    }


}


