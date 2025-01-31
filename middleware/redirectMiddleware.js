module.exports = (req, res, next) => {
  if (req.session._id) {
    return res.redirect('/');
  }

  next();
};
