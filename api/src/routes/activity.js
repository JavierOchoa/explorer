const { Router } = require('express');
const { Activity, Country, CountryActivities } = require('../db');
const router = Router();

router.get('/:activityName', async(req, res)=>{
    const { activityName } = req.params;
    try{
        const activity = await Activity.findAll({where: {name: activityName}, include: Country});
        res.send(activity)
    } catch (e) {
        return res.status(401).send({message: 'Ha ocurrido un error'})
    }
})

router.put('/', async(req, res)=>{
    const { name, difficulty, duration, season, countries } = req.body;
    let activity;
    try{
        activity = await Activity.findOne({where: {name: name}})
    } catch (e) {
        return res.status(401).send({message: 'Ha ocurrido un error'})
    }
    activity.set({
        name,
        difficulty,
        duration,
        season,
        countries
    })

    try{
        await CountryActivities.destroy({
            where: {
                "activityId": activity.id
            }
        })
        countries.map(async(countryID) => {
            const theCountry = await Country.findByPk(countryID)
            await activity.setCountries(theCountry)
        })
    } catch (e) {
        return res.status(401).send(e)
    }

    try{
        activity.save()
        return res.status(201).send(activity)
    } catch (e) {
        return res.status(401).send(e)
    }
})

router.post('/', async(req, res) => {
    const { name, difficulty, duration, season, countries } = req.body;
    let activity;
    try{
        activity = await Activity.create({
                name,
                difficulty,
                duration,
                season,
        })
    } catch (e) {
        return res.status(401).send(e.errors[0].message)
    }
    try{
        countries.map(async(countryID) => {
            const theCountry = await Country.findByPk(countryID)
            await activity.setCountries(theCountry)
        })
        return res.status(201).send(activity)
    } catch (e) {
        return res.status(401).send(e);
    }
})

router.delete('/:idActivity', async(req, res) => {
    const {idActivity} = req.params;
    try{
        await Activity.destroy({where: {id: idActivity}})
        res.send({message: `Actividad ${idActivity} eliminada con éxito`})
    } catch (e) {
        return res.status(401).send(e);
    }
})

module.exports = router;