'use strict';
// built-in modules
const cluster = require('cluster');
const cpus = require('os').cpus().length;
// 3rd-party packages
const express = require('express');
require('dotenv').config();
// local modules
const logger = require('./log');
const router = require('./router/router');
const dh = require('./dataHandler/dataHandler');

const PORT = 8080;
const HOST = 'localhost';

const app = express();

app.use(express.json());

app.use('/', router);

// ready the data
dh.init(() => {
  console.log('Data initialized');
  logger.info('Data initialized');

  app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
    logger.info(`Running on http://${HOST}:${PORT}`);
    app.emit('data initialized');
  });
});

module.exports = app;