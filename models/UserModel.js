const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');



const UserSchema = new Schema({
 name: { type: String, uniqe: true,required:true },
 email: {type: String, unique:true, required:true},
 password: { type: String ,required:true },
 role:{type: String,enum:["student", "teacher", "admin"],default: "student"},
 courses:[{type: mongoose.Schema.Types.ObjectId, ref:'CourseModel'}]
})



UserSchema.pre('save', function(next) {// every register a course , user schema is changed
    const user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
  });
const MyUserModel = mongoose.model('User', UserSchema);
module.exports =  MyUserModel;