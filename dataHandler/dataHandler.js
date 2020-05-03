// built-in modules
const https = require('https');
// const fs = require('fs');
// const readline = require('readline');
// const stream = require('stream');
// 3rd-party packages
const ctj = require('csvtojson');
// local modules
const logger = require('../log');

const file = 'Divvy_Trips_2019_Q2.csv';
var csv;
var stations;

// const ist = fs.createReadStream(file);
// const ost = new stream();
// const rl = readline.createInterface(ist, ost);
// var lnC = 0;

// // count file lines
// rl.on('line', () => {
//   lnC++;
// });
// console.log('csv');
// rl.on('close', () => {
//   console.log('line count: ', lnC);
// });

module.exports = {
  // put csv and json into memory
  init: function(cb) {
    // get json
    const options = {
      hostname: 'gbfs.divvybikes.com',
      port: 443,
      path: '/gbfs/en/station_information.json',
      method: 'GET'
    }

    const req = https.request(options, res => {
      const sc = res.statusCode;
      const ct = res.headers['content-type'];
      let error;

      if (sc !== 200) {
        error = new Error('Request Failed.\n' +
                          `Status Code: ${sc}`);
      } else if (!/^application\/json/.test(ct)) {
        error = new Error('Invalid content-type.\n' +
                          `Expected application/json but received ${ct}`);
      }

      if (error) {
        logger.error(error.message);
        // consume response data to free up memory
        res.resume();
        return;
      }

      let data = '';
      res.setEncoding('utf8');
      res.on('data', d => {
        data += d;
      });

      res.on('end', () => {
        try{
          stations = JSON.parse(data);
        } catch (e) {
          logger.error(e.message);
        }
      });
    });

    req.on('error', e => {
      logger.error(e.message);
    });

    req.end();

    (async () => {
      // parse csv
      csv = await ctj().fromFile(file);
      // call callback
      cb();
    })();
  },
  getStation: async function(id) {
    stations.data.stations.forEach(s => {
      if (s['station-id'] === id) {
        return s;
      }
    });
    logger.error(`No station with ID ${id} found`);
    return {"Error": `No station with ID ${id} found`};
  },
  getRider: async function() {
    // if (typeof id === 'string') {
    //   let results = [];
    //   csv.forEach(r => {
    //     console.log(r);
    //     if ((r['03 - Rental Start Station ID'] === id) ||
    //       (r['02 - Rental End Station ID'] === id)) {
    //         results.push(r);
    //       }
    //   });
    // } else if (Array.isArray(id)) {
    //   let results = [];
    //   id.forEach(d => {
    //     csv.forEach(r => {
    //       if ((r['03 - Rental Start Station ID'] === d) ||
    //         (r['02 - Rental End Station ID'] === d)) {
    //           results.push(r);
    //         }
    //     });
    //   });
    // }
    // return results;
  },
  getTrip: async function() {

  }
};