# Divvy Chicago Bike Platform API Endpoint

## Setup
- `server.js` calls the Divvy station information endpoint: [https://gbfs.divvybikes.com/gbfs/en/station_information.json][1]
- It also uses a locally stored CSV file (1,108,164 lines) which can be downloaded here (not included in repo): [https://s3.amazonaws.com/divvy-data/tripdata/Divvy_Trips_2019_Q2.zip][2]
- Uses `.env` file to store API key as `API_KEY`.
- The app runs on `node start`, in browser go to `localhost:8080`.
- The app is also Dockerized so you could do:
  - `docker build -t <user>/divvy_platform_api`
  - `docker run -p 49160:8080 -d <user>/divvy_platform_api` 
  - `docker ps`
  - `docker logs <container id>`

## Use
- `localhost:8080` routes:
  - `/station` POST, accepts a station ID (number).
  - `/rider` POST, accepts a station ID (number) or IDs (array) and a date (string).
  - `/trip` POST, accepts a station ID (number) or IDs (array) and a date (string).

## Basic structure
- `server.js` calls Express app.
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

## Notes
- I'm rolling my own VERY basic token auth and input validation, but there are much better, more robust solutions, of course.
- One way to make the CSV look-up faster would be to divide the CSV up into files by day. Or store the data in a SQL database instead of a CSV file.
- Please see comments in the code.

[1]:https://gbfs.divvybikes.com/gbfs/en/station_information.json
[2]:https://s3.amazonaws.com/divvy-data/tripdata/Divvy_Trips_2019_Q2.zip