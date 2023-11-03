require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var upload = require('express-fileupload');
let route_service = '/order-service'

let route_client = '/client'
let route_default = '/default'
let route_admin = '/admin'

let clientRoutes = {
    planRouter: require('./routes/Client/plans'),
    visitRouter: require('./routes/Client/visit'),
    reportRouter: require('./routes/Client/report'),
    partnerRouter: require('./routes/Client/partner'),
    inventoryRouter: require('./routes/Client/inventory'),
    productRouter: require('./routes/Client/product-knowledge'),
    pointOfSalesRouter: require('./routes/Client/point-of-sales'),
    partnerAddressRouter: require('./routes/Client/partner-address'),
    salesQuotationRouter: require('./routes/Client/sales-quotation'),
    partnerContactRouter: require('./routes/Client/partner-contact-address'),
}

let adminRoutes = {
  visitationRouter: require('./routes/Admin/visit')
}

let neutralRoutes = {
  usersRouter: require('./routes/users'),
  indexRouter: require('./routes/index'),
  masterRouter: require('./routes/master'),
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

app.use('/', neutralRoutes.indexRouter)
app.use(`${route_service}${route_client}/plans`, clientRoutes.planRouter)
app.use(`${route_service}${route_default}/users`, neutralRoutes.usersRouter)
app.use(`${route_service}${route_client}/report`, clientRoutes.reportRouter)
app.use(`${route_service}${route_default}/master`, neutralRoutes.masterRouter)
app.use(`${route_service}${route_client}/partner`, clientRoutes.partnerRouter)
app.use(`${route_service}${route_client}/product`, clientRoutes.productRouter)
app.use(`${route_service}${route_client}/visitation`, clientRoutes.visitRouter)
app.use(`${route_service}${route_client}/inventory`, clientRoutes.inventoryRouter)
app.use(`${route_service}${route_client}/point-of-sales`, clientRoutes.pointOfSalesRouter)
app.use(`${route_service}${route_client}/partner-address`, clientRoutes.partnerAddressRouter)
app.use(`${route_service}${route_client}/sales-quotation`, clientRoutes.salesQuotationRouter)
app.use(`${route_service}${route_client}/partner-contact-address`, clientRoutes.partnerContactRouter)

// adminRoute
app.use(`${route_service}${route_admin}/visitation`, adminRoutes.visitationRouter)

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
