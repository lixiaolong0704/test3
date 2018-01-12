export default class Controller {
    context;
    handleErrors(res, errors, fields) {
        res.json({
            code: -1,
            data: errors
        });
    }
    success(data){
        this.context.res.json({
            code: 1,
            data: data
        });
    }
}