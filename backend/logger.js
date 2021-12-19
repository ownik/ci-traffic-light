const winston = require('winston');

winston.configure({
  level: 'info',
  transports: [
    new winston.transports.Console({ handleExceptions: true }),
    new winston.transports.File({
      handleExceptions: true,
      filename: 'server.log',
    }),
  ],
  format: winston.format.combine(
    winston.format((info) => {
      info.level = info.level.toUpperCase();
      return info;
    })(),
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    winston.format.printf(
      (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
  ),
});

module.exports = winston;
