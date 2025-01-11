const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const UserSchema = new Schema({
 name: { type: String, uniqe: true,required:true },
 email: {type: String, unique:true, required:true},
 password: { type: String ,required:true }

})

UserSchema.pre('save', function (next){
    const user = this;
    bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
    })
})

const MyUserModel = mongoose.model('User', UserSchema);
module.exports = MyUserModel;