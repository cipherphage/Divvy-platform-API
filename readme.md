# Divvy Chicago Bike Platform API Endpoint

## Setup
- `dataHandler.js` calls the Divvy station information endpoint: [https://gbfs.divvybikes.com/gbfs/en/station_information.json][1]
- Uses a locally stored CSV file (1,108,164 lines) which can be downloaded here (not included in repo): [https://s3.amazonaws.com/divvy-data/tripdata/Divvy_Trips_2019_Q2.zip][2]
- Uses `.env` file to store API key as `API_KEY` and environment as `NODE_ENV`. I added `PORT` and `HOST` to help with using Docker.
- The app runs on `node server.js` or `npm start`.
- You can download a docker image here: [https://hub.docker.com/r/cipherphage/divvy-platform-api][4]
  - It is built automatically from this github repo so I believe it doesn't have a `.env` file nor does it have the CSV file which contains most of our data. You will need to add those and maybe map port 8080 to a local port and change the `HOST` environment variable from `localhost` to `0.0.0.0`.
  - You can also build it locally from the repo:
    - `docker build -t <user>/divvy_platform_api .`
    - `docker run -p 49160:8080 -d <user>/divvy_platform_api` 
    - `docker ps`
    - `docker logs <container id>`

## Use
- The server waits for the data to be initialized before listening for requests. If you set `NODE_ENV` to 'production' then it will spawn workers.
- `localhost:8080` routes:
  - `/station` POST, accepts a station ID (number).
  - `/rider` POST, accepts a station ID (number) or IDs (array) and an optional date (string: YYYY-MM-DD).
  - `/trip` POST, accepts a station ID (number) or IDs (array) and an optional date (string: YYYY-MM-DD).
  - Note: if no date is provided, then yesterday is assumed. This should be changed because the data does not cover recent dates.
- Run `npm test` to run the tests (note: you must change the `NODE_ENV` in `.env` to anything other than 'production'. Also, it runs on a timeout so please give it some time (it waits for the data to be initialized)).
  - `npm test` runs `mocha 'test/**/*.js' --timeout 60000 --reporter nyan`. The `NODE_ENV` in `.env` needs to be anything other than 'production' otherwise the tests will attempt to test each worker and fail to find a port.

## Basic structure
- `server.js` calls Express app and forks child processes as per # of CPUs. This is a naive implementation of the cluster module. A library like [pm2][3] should be used in production.
- `/router/router.js` is where the routes live.
- `/middleware/middleware.js` is where middleware lives (basic token auth, 404 handler, and input validation).
- `/dataHandler/dataHandler.js` is where all data processing happens.
- I used POST for the endpoints because the api key should be in the request body so it is encrypted by SSL in production and doesn't get logged in server logs.
- `log.js` uses Winston logger to write to local `error.log` and `combined.log` files.

## 3rd-party packages used
- `dotenv` to read .env file (where we store the api key).
- `express` the light-weight web server framework.
- `winston` for logging.
- `csvtojson` a library for parsing and doing other things with CSVs.
- `mocha` and `supertest` to test. 

## Notes
- I'm rolling my own VERY basic token auth and input validation, but there are much better, more robust solutions, of course.
- To make start-up faster, consider converting the CSV into JSON and not using CSV at all.
- To make the CSV look-up faster we could divide the CSV up into files by day, and/or create workers to perform the lookup, and/or store the data in a SQL database instead of a CSV file. 
  
[1]:https://gbfs.divvybikes.com/gbfs/en/station_information.json
[2]:https://s3.amazonaws.com/divvy-data/tripdata/Divvy_Trips_2019_Q2.zip
[3]:https://pm2.io/
[4]:https://hub.docker.com/r/cipherphage/divvy-platform-api