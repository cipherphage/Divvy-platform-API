// 3rd-party packages
const express = require('express');
const winston = require('winston');
// local modules
const mw = require('../middleware/middleware');
const dh = require('../dataHandler/dataHandler');
const logger = require('../log');

const router = express.Router();
const eHandler = (res, data) => {
  if (data.hasOwnProperty('Error')) {
    res.status(400).json(data);
  } else {
    res.json(data);
  }
};

// add middleware for the remaining routes
// NOTE: order is important
router.use(mw.isNotFound);
router.use(mw.jsonValidated);
router.use(mw.isAuthorized);

// our three routes
router.post('/station', (req, res, next) => {
  logger.info('Someone accessed our station endpoint.');
  dh.getStation(req.body.id).then(data => {
    eHandler(res, data);
  }).catch(e => {
    next(e);
  });
});

router.post('/rider', (req, res, next) => {
  logger.info('Someone accessed our rider endpoint.');
  dh.getRider(req.body.id).then(data => {
    eHandler(res, data);
  }).catch(e => {
    next(e);
  });
});

router.post('/trip', (req, res, next) => {
  logger.info('Someone accessed our trip endpoint.');
  dh.getTrip(req.body.id).then(data => {
    eHandler(res, data);
  }).catch(e => {
    next(e);
  });
});

module.exports = router;