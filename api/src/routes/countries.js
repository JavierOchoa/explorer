const { Router } = require('express')
const { Op } = require('sequelize')
const axios = require('axios')
const { Country, Activity } = require('../db')

const router = Router();

router.get('/', async(req, res) => {
    const { name } = req.query;
    if(!name) {
        let countryGetter;
        try{
            countryGetter = await axios.get(`https://restcountries.com/v3/all`)
        } catch (e) {
            return res.status(401).send(e);
        }
        countryGetter.data.map(async (countryInfo) => {
            try{
                await Country.findOrCreate({
                    where: {"id": countryInfo.cca3},
                    defaults: {
                        "id": countryInfo.cca3,
                        "name": countryInfo.name.common,
                        "flag": countryInfo.flags[0],
                        "continent": countryInfo.continents[0],
                        "capital": countryInfo.capital ? countryInfo.capital[0] : "NO TIENE",
                        "subregion": countryInfo.subregion ? countryInfo.subregion : "NO TIENE",
                        "area": countryInfo.area,
                        "population": countryInfo.population
                    }
                })
            } catch (err) {
                return res.status(401).send(err);
            }
        })
        try {
            const countryList = await Country.findAll({include: Activity})
            return res.send(countryList)
        } catch (e) {
            return res.status(401).send(e)
        }
    } else {
        try{
            let countries = await Country.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${name}%`
                    }
                },
                include: Activity
            })
            if(countries.length === 0){
                return res.send(`No se encontraron resultados con ${name}`);
            }
            return res.send(countries);
        } catch (e) {
            return res.status(401).send(e.parent.detail);
        }
    }
});

router.get('/:idPais', async(req, res)=> {
    const { idPais } = req.params
    let countryInfo;
    try{
        countryInfo = await Country.findByPk(idPais, {include: Activity});
    } catch (e) {
        return res.status(404).send(e);
    }
    if(!countryInfo){
        try{
            countryInfo = await axios.get(`https://restcountries.com/v3/alpha/${idPais}`)
            try {
                let created = await Country.create({
                        "id": countryInfo.data[0].cca3,
                        "name": countryInfo.data[0].name.common,
                        "flag": countryInfo.data[0].flags[0],
                        "continent": countryInfo.data[0].continents[0],
                        "capital": countryInfo.data[0].capital ? countryInfo.data[0].capital[0] : "NO TIENE",
                        "subregion": countryInfo.data[0].subregion ? countryInfo.data[0].subregion : "NO TIENE",
                        "area": countryInfo.data[0].area,
                        "population": countryInfo.data[0].population
                    })
                return res.send(created)
            } catch (e) {
                return res.status(404).send(e);
            }
        } catch (err) {
            return res.status(404).send({message: `No se pudo encontrar un pais con el código ${idPais}`})
        }
    } else {
        return res.send(countryInfo)
    }
})

module.exports = router;