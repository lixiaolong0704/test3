export default class Controller {
    handleErrors(res, errors, fields) {
        res.json({
            code: -1,
            data: errors
        });
    }
}