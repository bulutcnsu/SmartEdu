const express = require('express');
const router = express.Router();
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const authRoute = require('./routes/authRoute');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

const app = express();;

//template engine ejs
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

mongoose.connect('mongodb://127.0.0.1:27017/smartedu-db')
 .then(() => console.log('DB Connected!'));

const port = 3000;

app.use('/',pageRoute);
app.use('/courses',courseRoute); //db collections name
app.use('/categories',categoryRoute);
app.use('/users',authRoute);

app.listen(3000, ()=> {
    console.log("App  started on port:", port)
})