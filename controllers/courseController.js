const Course = require('../models/CourseModel');
const Category = require('../models/CategoryModel');


exports.createCourse = async (req, res)=>{
   try {
    const course = await Course.create(req.body);

    res.status(201).json({
      status: 'success',
      course: course,
    });
  } catch(error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.getAllCourses = async (req, res)=>{
  try {
    
    const categorySlug = req.query.categories; /* db schma*/
    const category = await Category.findOne({slug:categorySlug});

    let filter = {};
    if(categorySlug) {
      filter = {category:category._id}
    }
    const courses = await Course.find(filter);
    const categories = await Category.find();
   
   res.status(200).render('courses', {
    courses,
    categories,
    page_name: 'courses',
   });
 } catch(error) {
   res.status(404).json({
     status: 'fail',
     error,
   });
 }
};

exports.getCourse = async (req, res)=>{
  try {
    let slug= req.params.id;;
   const course = await Course.findById(slug);
   
   res.status(200).render('course', {
    course,
    page_name: 'courses',
   });
 } catch(error) {
   res.status(404).json({
     status: 'fail',
     error,
   });
 }
};
