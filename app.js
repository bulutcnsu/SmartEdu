const express = require('express');
const router = express.Router();
const pageRoute = require('./routes/pageRoute');
const courseRoute = require('./routes/courseRoute');
const categoryRoute = require('./routes/categoryRoute');
const authRoute = require('./routes/userRoute');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const app = express();

globalThis.userIN = null;

//template engine ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(
    session({
      secret: 'my_keyboard_cat', 
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({ mongoUrl: 'mongodb+srv://dbUser:dbUserPass123@cluster0.lmmul.mongodb.net/smartedu-db?retryWrites=true&w=majority&appName=Cluster0' })
    })
  );
  app.use(flash());
  app.use((req, res, next)=> {
    res.locals.flashMessages = req.flash();
    next();
  })
  app.use(
    methodOverride('_method', {
      methods: ['POST', 'GET'],
    })
  );
mongoose
  .connect('mongodb+srv://@cluster0.lmmul.mongodb.net/smartedu-db?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('DB Connected!'));

  app.use('*', (req, res, next) => {
   userIN = req.session._id;
   console.log("app :", userIN)
    next();    
    });
  

app.use('/', pageRoute);
app.use('/courses', courseRoute); //db collections name
app.use('/categories', categoryRoute);
app.use('/users', authRoute);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('App  started on port:', port);
});
