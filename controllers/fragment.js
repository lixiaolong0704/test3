

import Controller from '../Controller';
import {controller, get, post} from '../mvc/helper';
import fragmentService from '../services/fragmentService';

var _fragmentService = new fragmentService();
export default class fragment extends Controller{

    @post()
     async addFragment(req, res, next){
        let model = {
            name: req.body.name,
            ref_link: req.body.ref_link,
            ref_content: req.body.ref_content,
            create_time: new Date(),
            uid:req.session.userinfo._id
        }
        var _id = await _fragmentService.addFragment(model);
        if (_id) {
            res.json({
                code: 1,
                data: _id
            });

        }
    }
    @get()
    async test(req, res, next){

        for (let i = 0; i < 1000000000000; i++) {
            let model = {
                name: "new" + i,
                ref_link: 'www.baidu.com',
                ref_content: 'Design new APIs, or edit existing ones, in a powerful editor which visually renders your OAS/Swagger definition with concise, real time feedback and error handling.',
                create_time: new Date(),
            }
            // console.log(i);
            await _fragmentService.addFragment(model);
        }
        res.json({
            code: 1,
            data: 'ok'
        });

    }
    @post()
    async updateFragment(req, res, next){
        let model = {
            _id: req.body._id,
            name: req.body.name,
            ref_link: req.body.ref_link,
            ref_content: req.body.ref_content,
            uid:req.session.userinfo._id
        }
        var isOk = await _fragmentService.updateFragment(model);
        if (isOk) {
            res.json({
                code: 1,
                data: ''
            });

        }
    }

    @get()
    async getAllFragments(req, res, next){
        var rs = await  _fragmentService.getAllFragments();
        res.json({
            code: 1,
            data: rs
        });
    }
    @get('/getFragmentsOfPg/:page')
    async getFragmentsOfPg(req, res, next){
        var rs = await _fragmentService.getFragmentsOfPg({
            uid:req.session.userinfo._id
        },{page: req.params.page, limit: 5});
        res.json({
            code: 1,
            data: rs
        });
    }


}


