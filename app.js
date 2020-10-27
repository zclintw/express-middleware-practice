const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Redis = require('ioredis');

const { REDIS: REDIS_OPTS, RATELIMIT: RATELIMIT_OPTS } = require('./config.js');
const ratelimit = require('./middleware/ratelimit.js');
const indexRouter = require('./routes/index');

const redis = new Redis(REDIS_OPTS.PORT, REDIS_OPTS.HOST);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(ratelimit({ period: RATELIMIT_OPTS.PERIOD, max: RATELIMIT_OPTS.MAX, redis }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
