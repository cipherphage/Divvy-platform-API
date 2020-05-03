// local modules
const logger = require('../log');
//const data = require('../datahandler/dataHandler');

// Middleware
// NOTE: this order is important
module.exports = {
  // handle not found
  isNotFound: (req, res, next) => {
    let p = ['/station', '/rider', '/trip'].includes(req.path);
    if (!p) {
      logger.info('404: ', req.path);
      return res.status(404).send("Page not found");
    }
    return next();
  },
  // simple validation with some hardcoded and arbitrary values
  jsonValidated: (req, res, next) => {
    let b = req.body;
    //let numStations = data.getNumOfStations();

    if (!b.hasOwnProperty('api_key') || !b.hasOwnProperty('id')) {
      // return bad request
      logger.info('Request body does not have an API key or a station ID');
      return res.status(400).send("Bad request");
    }

    if ((typeof b.api_key !== 'string') || (b.api_key.length > 256)) {
      // return bad request
      logger.info('Could not validate provided API key string');
      return res.status(400).send("Bad request");
    }

    if (typeof b.id === 'string') {
      if ((typeof parseInt(b.id, 10) !== 'number') || (b.id.length > 4)) {
        // return bad request
        logger.info('Could not validate provided station ID number');
        return res.status(400).send("Bad request");
      }
    } else if (Array.isArray(b.id)) {
      if (b.id.length >= 1024) {
        // return bad request
        logger.info('Could not validate provided station ID array');
        return res.status(400).send("Bad request");
      }

      b.id.forEach(id => {
        if ((typeof parseInt(id, 10) !== 'number') || (id.length > 4)) {
          // return bad request
          logger.info('Could not validate provided station ID array');
          return res.status(400).send("Bad request");
        }
      });
    } else {
      // return bad request
      logger.info('Could not validate provided station ID');
      return res.status(400).send("Bad request");
    }

    if (b.hasOwnProperty('date')) {
      if (b.date.length > 20) {
        // return bad request
      logger.info('Could not validate provided date string');
      return res.status(400).send("Bad request");
      }
    }
    
    return next();
  },
  // basic key auth, not recommended for production
  isAuthorized: (req, res, next) => {
    let b = req.body;
    if (b.api_key === process.env.API_KEY) {
      return next();
    }
    // return forbidden
    logger.info('Unauthorized API key provided');
    return res.status(401).send("Forbidden");
  }
};