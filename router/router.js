// 3rd-party packages
const express = require('express');
const winston = require('winston');
// local modules
const mw = require('../middleware/middleware');
const dh = require('../dataHandler/dataHandler');
const logger = require('../log');

const router = express.Router();
const errHandler = (res, data) => {
  if (data.hasOwnProperty('Error')) {
    res.status(400).json(data);
  } else {
    res.json(data);
  }
};
const dateHandler = (req) => {
  if (req.body.hasOwnProperty('date')) {
    return req.body.date;
  }
  // get yesterday
  let d = new Date(Date.now() - 86400000),
      mo = '' + (d.getMonth() + 1),
      da = '' + d.getDate(),
      y = d.getFullYear();

  if (mo.length < 2) {
    mo = '0' + month;
  }

  if (da.length < 2) {
    da = '0' + da;
  }

  return [y, mo, da].join('-');
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
    errHandler(res, data);
  }).catch(e => {
    next(e);
  });
});

router.post('/rider', (req, res, next) => {
  logger.info('Someone accessed our rider endpoint.');
  let d = dateHandler(req);
  dh.getRider(req.body.id, d).then(data => {
    errHandler(res, data);
  }).catch(e => {
    next(e);
  });
});

router.post('/trip', (req, res, next) => {
  logger.info('Someone accessed our trip endpoint.');
  let d = dateHandler(req);
  dh.getTrip(req.body.id, d).then(data => {
    errHandler(res, data);
  }).catch(e => {
    next(e);
  });
});

module.exports = router;