const nconf = require('nconf');

nconf.env({ parseValues: true });

nconf.defaults({
  REDIS_HOST: '127.0.0.1',
  REDIS_PORT: 6379,
  RATELIMIT_PERIOD: 60,
  RATELIMIT_MAX: 60,
});

module.exports = {
  REDIS: {
    HOST: nconf.get('REDIS_HOST'),
    PORT: nconf.get('REDIS_PORT'),
  },
  RATELIMIT: {
    PERIOD: nconf.get('RATELIMIT_PERIOD'),
    MAX: nconf.get('RATELIMIT_MAX'),
  },
};
