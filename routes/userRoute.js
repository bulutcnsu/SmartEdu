const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const User = require('../models/UserModel');

router.route('/login').post(authController.loginUser);
router.route('/logout').get(authController.logoutUser);
router.route('/dashboard').get(authMiddleware, authController.getDashboardPage);
router.route('/:id').delete(authController.deleteUser);
router.route('/signup').post(
  [
    body('name').not().isEmpty().withMessage('Please Enter Your Name'),
    body('email')
      .isEmail()
      .withMessage('Please Enter Valid Email')
      .custom((userEmail) => {
        return User.findOne({ email: userEmail }).then((user) => {
          //if email exis in db
          if (user) {
            return Promise.reject('Email is already exists!');
          } }); }),
    body('password').not().isEmpty().withMessage('Please Enter A Password'),
  ],  authController.createUser);

module.exports = router;
