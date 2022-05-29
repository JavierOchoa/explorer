const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('country', {
    id:{
      type: DataTypes.STRING(3),
      allowNull: false,
      primaryKey: true,
      validate:{
        is: /^[A-Z]+$/g,
        len: [1, 3]
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[A-Z a-z]/g
      }
    },
    flag: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isUrl: true
      }
    },
    continent: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[A-Z a-z]/g
      }
    },
    capital: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /[A-Z a-z]/g
      }
    },
    subregion: {
      type: DataTypes.STRING,
      validate: {
        is: /[A-Z a-z]/g
      }
    },
    area: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true
      }
    },
    population: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true
      }
    }
  },{
    timestamps: false
  });
};
