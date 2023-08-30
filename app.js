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
var masterRouter = require('./routes/master');
var planRouter = require('./routes/Client/plans');
var visitRouter = require('./routes/Client/visit');
var partnerRouter = require('./routes/Client/partner');
var productRouter = require('./routes/Client/product-knowledge');
var partnerAddressRouter = require('./routes/Client/partner-address');
var salesQuotationRouter = require('./routes/Client/sales-quotation');
var partnerContactRouter = require('./routes/Client/partner-contact-address');

let clientRoutes = {
    planRouter: require('./routes/Client/plans'),
    visitRouter: require('./routes/Client/visit'),
    reportRouter: require('./routes/Client/report'),
    partnerRouter: require('./routes/Client/partner'),
    productRouter: require('./routes/Client/product-knowledge'),
    partnerAddressRouter: require('./routes/Client/partner-address'),
    salesQuotationRouter: require('./routes/Client/sales-quotation'),
    partnerContactRouter: require('./routes/Client/partner-contact-address'),
}

let adminRoutes = {
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
app.use('/visit', visitRouter)
app.use('/users', usersRouter)
app.use('/sales-quotation', salesQuotationRouter)
app.use(`${route_service}${Client.route_client}/plans`, planRouter)
app.use(`${route_service}${Default.route_default}/master`, masterRouter)
app.use(`${route_service}${Client.route_client}/report`, clientRoutes.reportRouter)
app.use(`${route_service}${Client.route_client}/partner`, clientRoutes.partnerRouter)
app.use(`${route_service}${Client.route_client}/product`, clientRoutes.productRouter)
app.use(`${route_service}${Client.route_client}/partner-address`, clientRoutes.partnerAddressRouter)
app.use(`${route_service}${Client.route_client}/partner-contact-address`, clientRoutes.partnerContactRouter)

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
