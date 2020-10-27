const Redis = require('ioredis-mock');
const moment = require('moment');

const ratelimit = require('../middleware/ratelimit.js');

const sameIPv4 = '200.100.100.100';
const sameIPv6 = '0:0:0:0:0:ffff:c864:6464';
const anotherIP = '200.100.100.200';
const currTime = '2020-01-01T01:01:00.000Z';

jest.mock('moment', () => () => jest.requireActual('moment')('2020-01-01T01:01:00.000Z'));

describe('rate limit', () => {
  test('return the count of requests', async () => {
    const period = 10;
    const max = 3;
    const redis = new Redis();

    // set mock data
    let prevTime = moment(currTime).subtract(13, 's').valueOf();
    redis.zadd(sameIPv4, prevTime, prevTime);

    prevTime = moment(currTime).subtract(3, 's').valueOf();
    redis.zadd(sameIPv4, prevTime, prevTime);

    prevTime = moment(currTime).subtract(2, 's').valueOf();
    redis.zadd(anotherIP, prevTime, prevTime);

    // test
    const ratelimitFunc = ratelimit({ period, max, redis });
    const req = { ip: sameIPv6 };
    const res = { locals: {} };

    expect.assertions(1);
    await ratelimitFunc(req, res, () => {});
    expect(res.locals.count).toBe(2);
  });

  test('reach the rate limit then return error', async () => {
    const period = 10;
    const max = 3;
    const redis = new Redis();

    // set mock data
    let prevTime = moment(currTime).subtract(9, 's').valueOf();
    redis.zadd(sameIPv4, prevTime, prevTime);

    prevTime = moment(currTime).subtract(6, 's').valueOf();
    redis.zadd(sameIPv4, prevTime, prevTime);

    prevTime = moment(currTime).subtract(3, 's').valueOf();
    redis.zadd(sameIPv4, prevTime, prevTime);

    // test
    const ratelimitFunc = ratelimit({ period, max, redis });
    const req = { ip: sameIPv6 };
    const res = { locals: {} };

    expect.assertions(1);
    ratelimitFunc(req, res, (err) => {
      expect(err.status).toBe(429);
    });
  });

  test('catch an error', async () => {
    const period = 10;
    const max = 3;
    const redis = new Redis();

    // test
    const ratelimitFunc = ratelimit({ period, max, redis });
    const req = {};
    const res = { locals: {} };

    expect.assertions(1);
    ratelimitFunc(req, res, (err) => {
      expect(err).toBeInstanceOf(Error);
    });
  });
});
