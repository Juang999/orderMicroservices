require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('express-fileupload');
var {route_service, Admin, Client, Default} = require('./routes/route')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/Client/product-knowledge');
var priceRouter = require('./routes/Client/price');
var masterRouter = require('./routes/master');
var partnerRouter = require('./routes/Client/partner');
var planRouter = require('./routes/Client/plans');
var partnerAddressRouter = require('./routes/Client/partner-address');
var partnerContactRouter = require('./routes/Client/partner-contact-address');
var visitRouter = require('./routes/Client/visit');
var salesQuotationRouter = require('./routes/Client/sales-quotation')

var adminRoutes = {
  visitationRouter: require('./routes/Admin/visit')
}

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

app.use('/', indexRouter)
app.use('/plans', planRouter)
app.use('/visit', visitRouter)
app.use('/users', usersRouter)
app.use('/price', priceRouter)
app.use(`${route_service}${Client.route_client}/product`, productRouter)
app.use('/partner', partnerRouter)
app.use('/partner-address', partnerAddressRouter)
app.use('/sales-quotation', salesQuotationRouter)
app.use('/partner-contact-address', partnerContactRouter)
app.use(`${route_service}${Default.route_default}/master`, masterRouter)

// adminRoute
app.use(`${route_service}${Admin.route_admin}`, adminRoutes.visitationRouter)

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
