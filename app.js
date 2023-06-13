require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('express-fileupload')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product-knowledge');
var priceRouter = require('./routes/price');
var masterRouter = require('./routes/master');
var partnerRouter = require('./routes/partner');
var planRouter = require('./routes/plans');
var partnerAddressRouter = require('./routes/partner-address');
var partnerContactRouter = require('./routes/partner-contact-address');
var visitRouter = require('./routes/visit');
var salesQuotationRouter = require('./routes/sales-quotation')

var app = express();

// file-upload expressjs
app.use(upload())


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/price', priceRouter);
app.use('/master', masterRouter);
app.use('/partner', partnerRouter);
app.use('/plans', planRouter);
app.use('/partner-address', partnerAddressRouter);
app.use('/partner-contact-address', partnerContactRouter)
app.use('/visit', visitRouter)
app.use('/sales-quotation', salesQuotationRouter)

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

// running server
app.listen(process.env.PORT, () => {
  console.log(`site: ${process.env.HOST}:${process.env.PORT}`)
})

module.exports = app;
