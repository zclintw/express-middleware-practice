const debug = require('debug')('projectd:ratelimit');
const moment = require('moment');
const ipaddr = require('ipaddr.js');
const createError = require('http-errors');

/**
 *
 * @param {object} options
 * @param {number} options.period - unit: seconds
 * @param {number} options.max - max requests per period
 * @param {object} options.redis - redis connection object
 */
module.exports = ({ period, max, redis }) => async (req, res, next) => {
  try {
    // If IPv6 can be converted to IPv4, save as IPv4
    const ip = ipaddr.process(req.ip).toString();
    const currTime = moment().valueOf();
    const prevTime = moment(currTime).subtract(period, 's').valueOf();

    /**
       * 1. remove outdate records
       * 2. add record
       * 3. count list
       * 4. extend expired time
       */
    const [, , [, count]] = await redis.multi()
      .zremrangebyscore(ip, 0, prevTime)
      .zadd(ip, currTime, currTime)
      .zcount(ip, prevTime, currTime)
      .expire(ip, period + 10)
      .exec();

    if (count > max) {
      return next(createError(429));
    }

    res.locals.count = count;

    return next();
  } catch (err) {
    return next(err);
  }
};
