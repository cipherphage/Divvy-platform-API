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
  getNumOfStations: function() {
    console.log('initializing this function');
    let n = stations.data.stations.length;
    return n;
  },
  getStation: async function(id) {
    let t;
    stations.data.stations.forEach(s => {
      if (s['station_id'] === id) {
        t = s;
      }
    });

    if (t) {
      return t;
    }
    logger.error(`No station with ID ${id} found`);
    return {"Error": `No station with ID ${id} found`};
  },
  getRider: async function(id, d) {
    let date = new Date(Date.now());
    let ty = parseInt(date.getFullYear(),10);
    let results = {
      "date": d,
      "stations": {}
    };
    let riderBuckets = (r, id) => {
      if ((r['02 - Rental End Station ID'] === id) && 
        (r['01 - Rental Details Local End Time'].split(' ')[0] === d)) {
        let ages = {
          "0-20": 0,
          "21-30": 0,
          "31-40": 0,
          "41-50": 0,
          "51+": 0,
          "unknown": 0
        };

        if (r.hasOwnProperty('05 - Member Details Member Birthday Year')) {
          let a = ty - parseInt(r['05 - Member Details Member Birthday Year'],10);

          if (results.stations.hasOwnProperty(id)) {
            if (a < 21) {
              results.stations[id]["0-20"] += 1;
            } else if (a < 31) {
              results.stations[id]["21-30"] += 1;
            } else if (a < 41) {
              results.stations[id]["31-40"] += 1;
            } else if (a < 51) {
              results.stations[id]["41-50"] += 1;
            } else {
              results.stations[id]["51+"] += 1;
            }
          } else {
            results.stations[id] = ages;
            if (a < 21) {
              results.stations[id]["0-20"] += 1;
            } else if (a < 31) {
              results.stations[id]["21-30"] += 1;
            } else if (a < 41) {
              results.stations[id]["31-40"] += 1;
            } else if (a < 51) {
              results.stations[id]["41-50"] += 1;
            } else {
              results.stations[id]["51+"] += 1;
            }
          }
        } else {
          if (results.stations.hasOwnProperty(id)) {
            results.stations[id]["unknown"] += 1;
          } else {
            results.stations[id] = ages;
            results.stations[id]["unknown"] += 1;
          }
        }
      }
    };

    if (typeof id === 'string') {
      csv.forEach(r => {
        riderBuckets(r, id);
      });
    } else if (Array.isArray(id)) {
      id.forEach(i => {
        csv.forEach(r => {
          riderBuckets(r, i);
        });
      });
    }

    let ck = Object.keys(results.stations).length;
    if (ck > 0) {
      return results;
    }
    logger.error(`No station with ID ${id} found for ${d}`);
    return {"Error": `No station with ID ${id} found for ${d}`};
  },
  getTrip: async function(id, d) {
    let results = {
      "date": d,
      "stations": {}
    };
    let tripBuckets = (r, id) => {
      if ((r['02 - Rental End Station ID'] === id) && 
        (r['01 - Rental Details Local End Time'].split(' ')[0] === d)) {
        
        if (results.stations.hasOwnProperty(id)) {
          results.stations[id].push(r);
        } else {
          results.stations[id] = [];
          results.stations[id].push(r);
        }
      }
    };

    if (typeof id === 'string') {
      csv.forEach(r => {
        tripBuckets(r, id);
      });
    } else if (Array.isArray(id)) {
      id.forEach(i => {
        csv.forEach(r => {
          tripBuckets(r, i);
        });
      });
    }

    let compare = (a,b) => {
      let da = Date.parse(a['01 - Rental Details Local End Time']);
      let db = Date.parse(b['01 - Rental Details Local End Time']);
      return da - db;
    };

    let rk = Object.keys(results.stations);
    if (rk.length > 0) {
      // check and filter if more than 20 results for an id
      rk.forEach(k => {
        if (results.stations[k].length > 20) {
          // sort ascending
          results.stations[k].sort(compare);
          // remove older ones until only 20 left
          let newArr = results.stations[k].slice(-20);
          results.stations[k] = newArr;
        }
      });
      return results;
    }
    logger.error(`No station with ID ${id} found for ${d}`);
    return {"Error": `No station with ID ${id} found for ${d}`};
  }
};