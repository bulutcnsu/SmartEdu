const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slugify = require('slugify');


const CourseSchema = new Schema({
 name: { type: String, uniqe: true,required:true },
 description: { type: String, required:true, trim:true},
 date: { type: Date, default: Date.now },
 slug: {type: String, unique:true},
 user :{type:  mongoose.Schema.Types.ObjectId, ref: 'User'},
 category: {type:  mongoose.Schema.Types.ObjectId,ref: 'CategoryModel'}

})

CourseSchema.pre('validate',function(next){
    this.slug = slugify(this.name, {
        lower: true,
        strict : true
    });
    next();
})

const MyModel = mongoose.model('Course', CourseSchema);
module.exports = MyModel;