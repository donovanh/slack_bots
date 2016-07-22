'use strict';

// Bot requires
const SlackBot = require('slackbots'),
      furby = require('./lib/furby');

if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
}

// create a bot
const bot = new SlackBot({
  token: process.env.token,
  name: 'furby'
});

const furbySettings = {
  url: 'http://www.apple.com/ie/shop/browse/home/specialdeals/mac',
  keywords: [
    'macbook pro'
  ]
};

function checkForNewResults() {
  furby.checkPage(furbySettings.url)
    .then(furby.newResults)
    .then(function(results) {
      furby.postNewResultsToChannel(bot, results);
      furby.postMatchedResultsToUser(bot, results, 'donovanh', furbySettings.keywords);
    });
}

bot.on('start', function() {
  console.log('Bot started');
  checkForNewResults();
  bot.postMessageToChannel('dev', 'testing 123');
});

setInterval(function() {
  checkForNewResults();
}, 60*1000); // Once per minute

// Web requires
const express = require('express'),
      path = require('path'),
      favicon = require('serve-favicon'),
      logger = require('morgan'),
      cookieParser = require('cookie-parser'),
      bodyParser = require('body-parser'),
      routes = require('./routes/index'),
      users = require('./lib/users'),
      app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users); // Users module returns routes prefixed with '/users/*'

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
