import {getCountries} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import style from './form.module.css'
import Navbar from "../Navbar";
import axios from "axios";
import {useHistory} from "react-router-dom";
import Loader from "../Loader";

function ActivityForm(){
    const countries = useSelector(state => state.countries);
    const loading = useSelector(state => state.loading);
    const difficultyDefinition = useSelector(state => state.difficultyMap)
    const dispatch = useDispatch();
    let history = useHistory();

    const [errors, setErrors] = useState({});
    const [selectedCountry, setSelectedCountry] = useState('default');
    const [countryFilter, setCountryFilter] = useState([]);
    const [existentActivity, setExistentActivity] = useState({exist: false, data: {}})
    const [onEdit, setOnEdit] = useState(false)
    const [activity, setActivity] = useState({
        'name': '',
        'difficulty': 0,
        'duration': '',
        'season': '',
        'countries': []
    })

    useEffect(()=>{
        if(countries.length === 0){
            dispatch(getCountries())
        }
    },[dispatch, countries.length])

    const validate = (toValidate, fieldToValidate) => {
        let errObj = {};
        if(toValidate==='name'|| toValidate === 'all'){
            if(!fieldToValidate.name){
                errObj['name'] = 'Esta actividad no tiene nombre'
            } else {
                if(!/^[A-Z a-z]+$/g.test(fieldToValidate.name)){
                    errObj['name'] = 'Nombre no válido'
                }
            }
        }
        if(toValidate === 'difficulty' || toValidate === 'all'){
            if(typeof fieldToValidate.difficulty === "string"){
                errObj['difficulty'] = 'No es una dificultad valida';
            }
            if(!fieldToValidate.difficulty){
                errObj['difficulty'] = 'No seleccionaste una dificultad';
            }
        }
        if(toValidate === 'duration' || toValidate === 'all'){
            if(!fieldToValidate.duration){
                errObj['duration'] = 'No seleccionaste una duración';
            }
        }
        if(toValidate === 'season' || toValidate === 'all'){
            if(!fieldToValidate.season){
                errObj['season'] = 'No seleccionaste una temporada';
            }
        }
        if(toValidate === 'countries' || toValidate === 'all'){
            if(fieldToValidate.countries && fieldToValidate.countries.length === 0){
                errObj['countries'] = 'Debes seleccionar al menos un país'
            }
        }
        return errObj;
    }

    const handleNameChange = async(e) => {
        setOnEdit(false)
        setErrors(validate('name',{...activity, [e.target.name]: e.target.value}))
        setActivity({...activity, [e.target.name]: e.target.value})
        if(e!==''){
            try{
                const activityOnDb = await axios.get(`/activity/${e.target.value}`)
                if(activityOnDb.data[0]){
                    setExistentActivity({exist: true, data: activityOnDb.data[0]})
                } else {
                    setExistentActivity({exist: false, data: {}})
                }
            } catch (e) {
                setExistentActivity({exist: false, data: {}})
            }
        }
    }
    const handleDifficulty = (e) => {
        setErrors(validate('difficulty', {...activity, [e.target.name]: Number(e.target.value)}))
        setActivity({...activity, [e.target.name]: Number(e.target.value)})
    }
    const handleCountryChange = (e) => {
        setSelectedCountry('default');
        setErrors(validate('countries', [...countryFilter, countries[e.target.value]]))
        setCountryFilter([...countryFilter, countries[e.target.value]]);
        setActivity({...activity, [e.target.name]: [...activity[e.target.name], countries[e.target.value].id]})
    }
    const handleCountryRemove = (countryToRemove) => {
        let target = 'countries'
        setCountryFilter(countryFilter.filter(country => country.name !== countryToRemove))
        setActivity({...activity, [target]: countryFilter.filter(country => country.name !== countryToRemove).map(country => country.id)})
    }
    const handleDurationChange = (e) =>{
        setErrors(validate('duration', {...activity, [e.target.name]: e.target.value}))
        setActivity({...activity, [e.target.name]: e.target.value})
    }
    const handleSeasonChange = (e) => {
      setErrors(validate('season', {...activity, [e.target.name]: e.target.value}));
      setActivity({...activity, [e.target.name]: e.target.value})
    }
    const handleEditActivity = () => {
        setOnEdit(true)
        setActivity({
            'name': existentActivity.data.name,
            'difficulty': existentActivity.data.difficulty,
            'duration': existentActivity.data.duration,
            'season': existentActivity.data.season,
            'countries': existentActivity.data.countries.map(country => country.id)
        })
        setCountryFilter([...countryFilter, ...existentActivity.data.countries])
    }


    const handleSubmit = async(e) => {
        e.preventDefault()
        if(activity.countries.length === 0 || !activity.difficulty){
            setErrors(validate('all', activity));
        } else {
            let method;
            if(onEdit){
                method = axios.put
            } else {
                method = axios.post
            }
            method('/activity', activity)
                .then(({data})=>alert(`Actividad ${data.name} ${onEdit ? 'actualizada' : 'creada'} con éxito`))
                .then(()=>history.push("/home"))
                .catch((e) => {
                    setErrors(validate('all', activity));
                    alert(e.response.data);
                })
        }
    }
    return(
        <div className={style.formBody}>
            <Navbar/>
            <div className={style.formContainer}>
                <div className={style.form}>
                    {loading ?
                        (
                            <Loader/>
                        )
                        :
                        (
                            <div className={style.visibleForm}>
                                <h1 className={style.formTitle}>{onEdit ? 'Actualizando Actividad' : 'Crea una nueva actividad'}</h1>

                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <label className={style.labelTitle}>¿Como se llama esta actividad?</label>
                                    {errors.name && activity.name? <p className={style.errorLabel}>{errors.name}</p> : null}
                                    {existentActivity.exist === true && onEdit === false? <p>Ya existe una actividad con ese nombre, <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick={()=>handleEditActivity()}>deseas editarla?</span></p> : null}
                                    <input className={errors.name ? style.inputFieldRed : style.inputField} type={'text'} name={'name'} value={activity.name} placeholder={errors.name ? errors.name : 'Nombre de la actividad'} onChange={(e)=>handleNameChange(e)}/>

                                    <label className={style.labelTitle}>¿Cuál es la dificultad de esta actividad?</label>
                                    {errors.difficulty ? <p className={style.rangedRed}>{errors.difficulty}</p> : activity.difficulty ? <p className={style.ranged}>{difficultyDefinition[activity.difficulty]}</p> : <p className={style.ranged}>Deslizar para seleccionar</p>}
                                    <input className={style.rangeSlider} type={'range'} name={'difficulty'} value={activity.difficulty} min={1} max={5} onChange={(e)=> handleDifficulty(e)}/>

                                    <label className={style.labelTitle}>¿Dónde se realiza esta actividad?</label>
                                    <div className={style.countriesAdded}>
                                        <ul>
                                            {countryFilter.length > 0 && countryFilter.map(country => <li key={country.id} onClick={(e) => handleCountryRemove(e.target.innerText)}>{country.name}</li>)}
                                        </ul>
                                    </div>
                                    <select className={errors.countries ? style.inputFieldRed : style.inputField} name={'countries'} value={selectedCountry} onChange={(e)=>handleCountryChange(e)}>
                                        {errors.countries ? <option value={'default'} disabled hidden>{errors.countries}</option> : <option value={'default'} disabled hidden>Selecciona un pais</option>}
                                        {countries.map(country => countryFilter.includes(country) ? '' : <option key={country.id} value={countries.indexOf(country)}>{country.name}</option> )}
                                    </select>

                                    <label className={style.labelTitle}>¿Cuánto tiempo lleva realizar esta actividad?</label>
                                    <select className={errors.duration ? style.inputFieldRed : style.inputField} name={'duration'} value={activity.duration} onChange={(e)=>handleDurationChange(e)}>
                                        {errors.duration ? <option value={''} disabled hidden>{errors.duration}</option> : <option value={''} disabled hidden>Seleccione una duración</option>}
                                        <option value={'menos de 1 hora'}>menos de 1 hora</option>
                                        <option value={'1 hora'}>1 hora</option>
                                        <option value={'2 horas'}>2 horas</option>
                                        <option value={'3 horas'}>3 horas</option>
                                        <option value={'mas de 3 horas'}>mas de 3 horas</option>
                                    </select>

                                    <label className={style.labelTitle}>¿En qué temporada se realiza esta actividad?</label>
                                    <select className={errors.season ? style.inputFieldRed : style.inputField} name={'season'} value={activity.season} onChange={(e)=>handleSeasonChange(e)}>
                                        {errors.season ? <option value={''} disabled hidden>{errors.season}</option> : <option value={''} disabled hidden>Seleccione temporada</option>}
                                        <option value={'Verano'}>Verano</option>
                                        <option value={'Otoño'}>Otoño</option>
                                        <option value={'Invierno'}>Invierno</option>
                                        <option value={'Primavera'}>Primavera</option>
                                    </select>

                                    <input className={style.submitButton} type={"submit"} value={onEdit ? 'ACTUALIZAR':'GUARDAR'}/>
                                </form>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default ActivityForm;