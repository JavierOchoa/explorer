require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const {
  PGUSER, PGPASSWORD, PGHOST, PGDATABASE, PGHOST
} = process.env;

let sequelize =
    process.env.NODE_ENV === "production"
        ? new Sequelize({
          database: PGDATABASE,
          dialect: "postgres",
          host: PGHOST,
          port: PGHOST,
          username: PGUSER,
          password: PGPASSWORD,
          pool: {
            max: 3,
            min: 1,
            idle: 10000,
          },
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
            keepAlive: true,
          },
          ssl: true,
        })
        : new Sequelize(
            `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}:${PGHOST}/${PGDATABASE}`,
            { logging: false, native: false }
        );

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach(model => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Country, Activity } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);
Country.belongsToMany(Activity, {through: 'CountryActivities'});
Activity.belongsToMany(Country, {through: 'CountryActivities'})

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importar la conexión { conn } = require('./db.js');
};
