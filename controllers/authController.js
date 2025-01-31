const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const Category = require('../models/CategoryModel');
const Course = require('../models/CourseModel');
const { validationResult } = require('express-validator');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(201).redirect('/login');
  } catch (error) {
    const errors = validationResult(req);
    console.log(errors);
    console.log(errors.array()[0].msg);
    for (let i = 0; i < errors.array().length; i++) {
      req.flash('error', `${errors.array()[i].msg}`);
    }

    res.status(400).redirect('/register');
  }
};

exports.loginUser = async (req, res) => {
  //const { email, password } = req.body;
  let email = req.body.email;
  let password = req.body.password;
  const user = await User.findOne({ email });

  if (user !== null) {
    bcrypt.compare(password, user.password, (err, same) => {
      if (same) {
        req.session._id = user.id;
        UserIN = req.session._id;
        res.status(200).redirect('/users/dashboard');
      } else {
        req.flash('error', 'Your password is not correct!');
        res.status(400).redirect('/login');
      }
      (err) => {
        console.log('could not found user');
      }});
  } else {
    console.log('The email is not exist');
    req.flash('error', 'Your email is not exist!');
    res.status(400).redirect('/login');
  }}

exports.logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getDashboardPage = async (req, res) => {
  const user = await User.findOne({ _id: req.session._id });
  const categories = await Category.find();
  const courses = await Course.find({ user: req.session._id });
  const allcourses = await Course.find();
  const allusers = await User.find();
  console.log(allusers.countDocument);

  const courseList = [];

  for (let i = 0; i < user.courses.length; i++) {
    allcourses.forEach((course) => {
      if (course._id.equals(user.courses[i])) courseList.push(course);
    });
  }

  res.status(200).render('dashboard', {
    page_name: 'dashboard',
    user,
    categories,
    courses,
    courseList,
    allusers
  });
};
exports.deleteUser = async (req, res) => {
  try {    
     await User.findOneAndDelete({_id: req.params.id })
    .then(function(){
     console.log("deleted user", req.params.id); })// Success})
    await Course.deleteMany({user:req.params.id});
 
     res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
    console.log(error);
  }
};
