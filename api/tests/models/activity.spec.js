const { Activity, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Activity model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Activity.sync({ force: true }));
    describe('activity creation', () => {
      it('should create an activity', async () => {
        await Activity.create({
          "name": "test",
          "difficulty": 4,
          "duration": "2 horas",
          "season": "Verano",
          "countries": ["COL"]
        });
      });
      it('second activity should be "test two"', async ()=>{
        await Activity.create({
          "name": "test",
          "difficulty": 4,
          "duration": "2 horas",
          "season": "Verano",
          "countries": ["COL"]
        });
        await Activity.create({
          "name": "test two",
          "difficulty": 4,
          "duration": "2 horas",
          "season": "Verano",
          "countries": ["COL"]
        });
        await Activity.findAll().then(data => expect(data[1].dataValues.name).to.be.equal('test two'))
      })
      it('should not be able to create invalid activity', async ()=>{
        Activity.create({
          "name": "inval1d",
          "difficulty": 4,
          "duration": "2 horas",
          "season": "Verano",
          "countries": ["COL"]
        }).catch(data => expect(data.errors[0].message).to.equal('Nombre de la actividad invalido'))
      })
    });
  });
});