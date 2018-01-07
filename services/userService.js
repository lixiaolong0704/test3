import User from '../models/user';


export default class userService {

    addUser(model) {
        var _user = new User(model);
        return new Promise((resolver) => {
            _user.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    resolver(_user._id);
                }
            });
        })


    }



}