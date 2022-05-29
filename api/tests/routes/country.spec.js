/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Country, conn } = require('../../src/db.js');

const agent = session(app);
const countries = [
  {
    "id": "ARG",
    "name": "Argentina",
    "flag": "https://flagcdn.com/ar.svg",
    "continent": "South America",
    "capital": "Buenos Aires",
    "subregion": "South America",
    "area": 2780400,
    "population": 45376763,
    "activities": []
  },
  {
    "id": "KOR",
    "name": "South Korea",
    "flag": "https://flagcdn.com/kr.svg",
    "continent": "Asia",
    "capital": "Seoul",
    "subregion": "Eastern Asia",
    "area": 100210,
    "population": 51780579,
    "activities": []
  },
  {
    "id": "COL",
    "name": "Colombia",
    "flag": "https://flagcdn.com/co.svg",
    "continent": "South America",
    "capital": "Bogotá",
    "subregion": "South America",
    "area": 1141748,
    "population": 50882884,
    "activities": []
  },
]

describe('Country routes', () => {
  before(() => conn.authenticate()
      .catch((err) => {
        console.error('Unable to connect to the database:', err);
      }));
  beforeEach(() => Country.sync({ force: true })
      .then(() => countries.map(country => Country.create(country))));
  describe('GET /countries', () => {
    it('should get 200', () =>
        agent.get('/countries').expect(200)
    );
  });
  describe('GET /countries/', () => {
    it('should include ARG', () =>
        agent.get(`/countries`)
            .then((response)=> expect(response._body).to.deep.include(countries[0]))
    );
  });
  describe('GET /countries/:idPais', () => {
    it('should get 200', () =>
        agent.get(`/countries/${countries[0].id}`).expect(200)
    );
  });
  describe('GET /countries/:invalidId', () => {
    it('should get a message when id is not valid', () =>
        agent.get(`/countries/invalido`)
            .then((response)=> expect(response._body.message).to.equal('No se pudo encontrar un pais con el código invalido'))
    );
  });
});