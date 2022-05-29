const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('activity', {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey:true,
        },
        name: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args:/^[A-Z a-z]+$/g,
                    msg: 'Nombre de la actividad invalido'
                }
            }
        },
        difficulty: {
            type: DataTypes.INTEGER,
            validate: {
                max: {
                    args: 5,
                    msg: "La dificultad tiene que ser menor que 5"
                },
                min: {
                    args: 1,
                    msg: "La dificultad tiene que ser mayor que 1"
                }
            }
        },
        duration: {
            type: DataTypes.STRING,
            validate: {
                is: {
                    args: /^[A-Z a-z\d]+$/g,
                    msg: "La duración solo debe tener números y letras"
                }
            }
        },
        season: {
            type: DataTypes.ENUM('Verano', 'Otoño', 'Invierno', 'Primavera'),
            validate: {
                isIn: {
                    args: [['Verano', 'Otoño', 'Invierno', 'Primavera']],
                    msg: "La temporada debe ser Verano, Otoño, Invierno o Primavera"
                }
            }
        }
    },{
        timestamps: false
    })
}