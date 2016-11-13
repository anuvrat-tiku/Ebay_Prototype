var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var home = require('./routes/home');
var mysql = require('./routes/mysql');

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({

    cookieName: 'session',
    secret: 'Ebay Lab1 session',
    duration: 30 * 60 * 1000, //setting the time for active session
    activeDuration: 5 * 60 * 1000,
}));

app.use('/', routes);
app.use('/users', users);
//app.use('/homepage', homepage);

// catch 404 and forward to error handler


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

//Post requests
app.post('/afterSignIn', home.afterSignIn);
app.post('/postSignUp', home.postSignUp);
app.post('/enterItemToSell', home.enterItemToSell);
app.post('/addNewProduct', home.addNewProduct);
app.post('/product', home.product);
app.post('/addToCart', home.addToCart);

//Get requests
app.get('/homepage', home.homepage);
app.get('/usernameOnSignUp', home.usernameOnSignUp);
app.get('/sell', home.sell);
app.get('/SellItemDescription', home.SellItemDescription);
app.get('/confirmAddition', home.confirmAddition);
app.get('/display_products', home.display_products);
app.get('/product_description', home.product_description);
app.get('/successfullyAddedToCart', home.successfullyAddedToCart);
app.get('/cart', home.cart);
app.get('/summary', home.summary);
app.get('/logout', home.logout);
mysql.createConnectionPool();

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;