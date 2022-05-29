/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Activity, conn } = require('../../src/db.js');

const agent = session(app);
const testActivity = {
  "name": "test",
  "difficulty": 4,
  "duration": "2 horas",
  "season": "Verano",
  "countries": ["COL"]
}

describe('Activity routes', () => {
  before(() => conn.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      }));
  Activity.sync({ force: true })
  describe('POST /activity', () => {
    it('should post an activity with code 201', () =>
        agent.post('/activity')
            .send(testActivity)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
    );
  });
  describe('Activity name', () => {
    it('activity name should be "test"', () =>
        agent.post('/activity')
            .send(testActivity)
            .set('Accept', 'application/json')
            .then(response => expect(response._body.name).to.be.equal(testActivity.name))
    );
  });
  describe('Get error message if data is not valid', () => {
    it('should not be able to create activity and get Nombre de la actividad invalido', () =>
        agent.post('/activity')
            .send({
              "name": "99",
              "difficulty": 4,
              "duration": "2 horas",
              "season": "Verano",
              "countries": ["COL"]
            })
            .set('Accept', 'application/json')
            .expect(401)
            .then(response => expect(response.text).to.be.equal('Nombre de la actividad invalido'))
    );
  });
});