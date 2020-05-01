var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require("cors");

var testRouter = require('./routes/index');

/* --------- Routers ---------- */
var riderRouter = require('./routes/rider');
var fdsRouter = require('./routes/fds');
var rsRouter = require('./routes/restaurantStaff');
var customerRouter = require('./routes/customer');
var generalRouter = require('./routes/general');
/* ---------------------------- */
var app = express();
// app.set('views', 'pug');

const port = process.env.PORT || 5000; //connect to port 5000

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', testRouter);
/* --- V4: Database Connect --- */
app.use('/rider', riderRouter);
app.use('/customer', customerRouter);
app.use('/fds', fdsRouter);
app.use('/rs', rsRouter);
app.use('/general', generalRouter);

/* ---------------------------- */


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

module.exports = app;