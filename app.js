var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session')
const multer = require('multer');

var adminRouter = require('./routes/admin/admin');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/register');
var searchRouter = require('./routes/search');
var postRouter = require('./routes/postjob');
var db = require('./config/db');
var introRouter = require('./routes/intro');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  name:"admin",
  secret: 'iwouldneverfallinloveagainuntillifoundadmin',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 36000000, // Set the maximum age of the session cookie to 1 hour (in milliseconds)
  },
}));
app.use(session({
  name:"user",
  secret: 'iwouldneverfallinloveagainuntillifoundher',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 36000000, // Set the maximum age of the session cookie to 1 hour (in milliseconds)
  },
}));//session





app.use('/admin',adminRouter);
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/register',registerRouter);
app.use('/search',searchRouter);
app.use('/postjob',postRouter);
app.use('/intro',introRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//connect  to database
app.use((req, res, next) => {
  req.db = db;
  next();
});



const PORT = process.env.PORT || 5432; // Use the environment variable or default to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
