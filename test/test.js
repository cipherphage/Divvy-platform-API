const request = require('supertest');
const app = require('../server.js');


before(function(done) {
  app.on('data initialized', function() {
    return done();
  });
});

describe('GET /', function() {
  it('returns 404 response', function() {
    return request(app)
      .get('/')
      .expect(404);
  })
});

describe('POST /station id', function() {
  it('responds with 200 with json', function(done) {
    request(app)
      .post('/station')
      .send({api_key: process.env.API_KEY, id: "42"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /station wrong id', function() {
  it('responds with 400 with json', function(done) {
    request(app)
      .post('/station')
      .send({api_key: process.env.API_KEY, id: "6251"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /station bad api key', function() {
  it('responds with 401 with json', function(done) {
    request(app)
      .post('/station')
      .send({api_key: "string", id: "42"})
      .set('Accept', 'text/html; charset=utf-8')
      .expect('Content-Type', /html/)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /station bad id format', function() {
  this.timeout(60000);
  it('responds with 400 with json', function(done) {
    request(app)
      .post('/station')
      .send({api_key: process.env.API_KEY, id: 6251})
      .set('Accept', 'text/html; charset=utf-8')
      .expect('Content-Type', /html/)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /rider id', function() {
  this.timeout(60000);
  it('responds with 200 with json', function(done) {
    request(app)
      .post('/rider')
      .send({api_key: process.env.API_KEY, id: "42", date: "2019-04-01"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /rider id array', function() {
  this.timeout(60000);
  it('responds with 200 with json', function(done) {
    request(app)
      .post('/rider')
      .send({api_key: process.env.API_KEY, id: ["42","43"], date: "2019-04-01"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /rider wrong id', function() {
  this.timeout(60000);
  it('responds with 400 with json', function(done) {
    request(app)
      .post('/rider')
      .send({api_key: process.env.API_KEY, id: "6251", date: "2019-04-01"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /trip id', function() {
  this.timeout(60000);
  it('responds with 200 with json', function(done) {
    request(app)
      .post('/trip')
      .send({api_key: process.env.API_KEY, id: "42", date: "2019-04-01"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /trip array', function() {
  this.timeout(60000);
  it('responds with 200 with json', function(done) {
    request(app)
      .post('/trip')
      .send({api_key: process.env.API_KEY, id: ["42","43"], date: "2019-04-01"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe('POST /trip wrong id', function() {
  this.timeout(60000);
  it('responds with 400 with json', function(done) {
    request(app)
      .post('/trip')
      .send({api_key: process.env.API_KEY, id: "6251", date: "2019-04-01"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
