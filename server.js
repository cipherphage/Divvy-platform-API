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

// use workers only in production
if (process.env.NODE_ENV === 'production') {
  // create cluster to handle more threads
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    logger.info(`Master ${process.pid} is running`);

    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }

    // warning: we are only logging dead workers for now
    cluster.on('exit', (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      logger.info(`Worker ${worker.process.pid} died`);
    });
  } else {
    // ready the data
    dh.init(() => {
      console.log('Data initialized');
      logger.info('Data initialized');

      app.listen(PORT, HOST, () => {
        console.log(`Worker ${process.pid} started running on http://${HOST}:${PORT}`);
        logger.info(`Worker ${process.pid} started running on http://${HOST}:${PORT}`);
      });
    });
  }
} else {
  // ready the data
  dh.init(() => {
    console.log('Data initialized');
    logger.info('Data initialized');

    app.listen(PORT, HOST, () => {
      console.log(`Running on http://${HOST}:${PORT}`);
      logger.info(`Rrunning on http://${HOST}:${PORT}`);
      // emit something to tests know they can run
      app.emit('data initialized');
    });
  });
}

module.exports = app;