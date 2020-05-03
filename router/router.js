// 3rd-party packages
const express = require('express');
const winston = require('winston');
// local modules
const mw = require('../middleware/middleware');
const dh = require('../dataHandler/dataHandler');
const logger = require('../log');

const router = express.Router();

// add middleware for the remaining routes
// NOTE: order is important
router.use(mw.isNotFound);
router.use(mw.jsonValidated);
router.use(mw.isAuthorized);

router.post('/station', (req, res, next) => {
  logger.info('Someone accessed our station endpoint.');
  dh.getStation(req.body.id).then(data => {
    if (data.hasOwnProperty('Error')) {
      res.status(400).json(data);
    } else {
      res.json(data);
    }
  }).catch(e => {
    next(e);
  });
});


module.exports = router;