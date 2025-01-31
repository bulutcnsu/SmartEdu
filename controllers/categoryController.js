const Category = require('../models/CategoryModel');

exports.createCategory = async (req, res)=>{
   try {
    const category = await Category.create(req.body);

    res.status(201).redirect('/users/dashboard');
  } catch(error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {    
     await Category.findOneAndDelete({_id: req.params.id })
    .then(function(){
     console.log("deleted category", req.params.id); })// Success})
     
     res.status(200).redirect('/users/dashboard');
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      error,
    });
    console.log(error);
  }
};

