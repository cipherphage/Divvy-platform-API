// 3rd-party package
const winston = require('winston');

const env = process.env.NODE_ENV;

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: 'divvy-api' },
    transports: [
      new winston.transports.File({ 
          filename: 'error.log', 
          level: 'error' 
        }),
      new winston.transports.File({ 
          filename: 'combined.log', 
          level: env === 'development' ? 'verbose' : 'info' 
        })
    ]
  });

module.exports = logger;