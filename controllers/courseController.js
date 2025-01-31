const Course = require('../models/CourseModel');
const Category = require('../models/CategoryModel');
const User = require('../models/UserModel');
const mongoose = require('mongoose');

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      user: req.session._id,
    });
    req.flash('success', `${course.name} has been created successfully`);

    res.status(201).redirect('/courses');
  } catch (error) {
    req.flash('error', `Something happened!`);
    res.status(400).redirect('/courses');
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories; /* db schma*/
    const query = req.query.search;

    //console.log('req params cat', req.query.categories);

    const category = await Category.findOne({ slug: categorySlug });
    console.log('req params courses', req.query.courses);

    let filter = {};

    if (categorySlug !== undefined) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { name: query };
    }
    if (!query && !categorySlug) {
      (filter.name = ''), (filter.category = null);
    }
    const courses = await Course.find({
      $or: [
        { name: { $regex: '.*' + filter.name + '.*', $options: 'i' } },
        { category: filter.category },
      ],
    })
      .sort('-createdAt')
      .populate('user');

    //const courses = (await Course.find(filter)).reverse('date');
    const categories = await Category.find();

    res.status(200).render('courses', {
      courses,
      categories,
      page_name: 'courses',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      error,
    });
    console.log(error);
  }
};

exports.getCourse = async (req, res) => {
  try {
    const slug = req.params.slug;
    //let course = await Course.findOne({slug}).populate('user')
    const course = await Course.findOne({ slug });
    const creator = await User.findOne({ _id: course.user });
    const user = await User.findById(req.session._id);
    const categories = await Category.find();

    res.status(200).render('course', {
      course,
      creator,
      user,
      categories,

      page_name: 'course',
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session._id);
    await user.courses.push({ _id: req.body.course_id });
    await user.save();
    //const  course = Course.findById(user.courses._id);

    /* for(let i=0; i< courses.length; i++){
    if(user.courses.includes(courses[i]._id)) {
    courseList2.push(courses[i]);
    console.log(" courseList: ",courseList2);
    }
  }*/

    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.find({ _id: req.session._id });
    const id = new mongoose.Types.ObjectId(req.body.course_id);
    console.log(id);

    user[0].courses.forEach((course) => {
      if (course.equals(id)) {
        user[0].courses.pull(id);

        console.log('silindi');
      }
    });
      await  user[0].save();
    res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
    console.log(error);
  }
};
exports.deleteCourse = async (req, res) => {
  try {
     //= Course.findOne({slug: req.params.slug});
     
     const course = await Course.findOneAndDelete({ slug: req.params.slug })
     .then(function(){
      console.log("deleted"); // Success
      req.flash('error', `Course  has been removed successfully`);
      res.status(200).redirect('/users/dashboard');
  });
 
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
     //= Course.findOne({slug: req.params.slug});
     
     const course = await Course.findOne({ slug: req.params.slug });
     course.name = req.body.name;
     course.description = req.body.description;
     course.category = req.body.category;
     course.save();

      res.status(200).redirect('/users/dashboard');
 

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};