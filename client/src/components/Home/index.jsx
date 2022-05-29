import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import himage from '../../files/cherry-traveling.svg';
import ascending from '../../files/ascending.svg';
import descending from '../../files/descending.svg';
import anumeric from '../../files/icons8-numeric.svg';
import dnumeric from '../../files/icons8-reversed-numeric.svg';
import Navbar from "../Navbar";
import {getCountries} from "../../redux/actions";
import CountryCard from "../CountryCard";
import Loader from "../Loader";
import style from './home.module.css'

function Home(){
    const [textOnSearch, setTextOnSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [start, setStart] = useState(0);
    const [finish, setFinish] = useState(9);
    const [nameOrder, setNameOrder] = useState(0);
    const [populationOrder, setPopulationOrder] = useState(0);
    const [continentFilter, setContinentFilter] = useState('default');
    const [activityFilter, setActivityFilter] = useState('default');
    const [activities, setActivities] = useState([]);
    const [responsive, setResponsive] = useState(false);
    const [maxPageCount, setMaxPageCount] = useState(5);
    const [minPageCount, setMinPageCount] = useState(1);

    let countryList = useSelector(state => state.countries);
    let continents = useSelector(state => state.continents);
    let isLoading = useSelector(state =>state.loading);

    let dispatch = useDispatch();
    let pages;
    let filtered;
    let countriesToLoad;

    useEffect(()=>{
        dispatch(getCountries())
        if(window.innerWidth <= 820){
            setResponsive(true)
        } else {
            setResponsive(false)
        }
    },[dispatch]);
    useEffect(()=>{
        setActivities([...new Set(countryList.filter(country => country.activities.length > 0 ).map(country => country.activities.map(activity => activity.name)[0]))])
    },[countryList]);

    const handlePagClick = (page) => {
        setCurrentPage(page)
        if(page !== 1) {
            setStart(((page) * 10) - 11)
            setFinish(((page + 1) * 10) - 11)
        } else {
            setStart(0)
            setFinish(9)
        }
    }
    const handleAscDesc = () => {
        setPopulationOrder(0)
        handlePagClick(1)
        if(nameOrder === 0) {
            setNameOrder(1);
        } else if(nameOrder === 1){
            setNameOrder(0);
        }
    }
    const handlePopulation = () => {
        setNameOrder(0)
        handlePagClick(1)
        if(populationOrder === 0) {
            setPopulationOrder(1);
        } else if(populationOrder === 1){
            setPopulationOrder(2);
        } else if(populationOrder === 2){
            setPopulationOrder(0)
        }
    }
    const handleContinentChange = (e) => {
        handlePagClick(1);
        setContinentFilter(e);
    }
    const handleActivityChange = (e) => {
      handlePagClick(1);
      setActivityFilter(e);
    }
    const handleNext = () => {
        if(currentPage < pages.length){
            handlePagClick(currentPage+1);
            if(currentPage + 1 > maxPageCount){
                setMaxPageCount(maxPageCount + 5)
                setMinPageCount(minPageCount + 5)
            }
        }
    }
    const handlePrev = () => {
        if(currentPage > 1){
            handlePagClick(currentPage - 1)
            if(currentPage -1 < minPageCount){
                setMaxPageCount(maxPageCount - 5)
                setMinPageCount(minPageCount - 5)
            }
        }
    }

    const filteredCountries = () => {
        let base = countryList;
        if(nameOrder === 0 && populationOrder === 0){
            base = base.sort((a, b) => a.name.localeCompare(b.name));
        }
        if(nameOrder === 1 && populationOrder === 0){
            base = base.sort((a, b) => b.name.localeCompare(a.name));
        }
        if(populationOrder === 1){
            base = base.sort((a, b) => b.population - a.population);
        }
        if(populationOrder === 2){
            base = base.sort((a, b) => a.population - b.population);
        }
        if(continentFilter !== 'default'){
            base = base.filter(country => country.continent === continentFilter);
        }
        if(activityFilter !==  'default'){
            base = base.filter(country => country.activities.map(activity => activity.name).includes(activityFilter));
        }
        if(textOnSearch.length === 0){
            return base;
        }
        else if(textOnSearch.length !== 0) {
            return base.filter(country => country.name.toLowerCase().includes(textOnSearch.toLowerCase()));
        }
    }
    filtered = filteredCountries();
    countriesToLoad = filtered.slice(start, finish);
    pages = Array.from({length: Math.floor(filtered.length / 10) + 1}, (_, i) => i + 1 )

    return(
        <div>
            <div className={style.headContent}>
                <Navbar/>
                <div className={style.content}>
                    <div className={style.headContentBody}>
                        <h1 className={style.headContentTitle}>¿Que lugar quieres conocer?</h1>
                        <p className={style.headContentText}>Aquí puedes buscar los países de los que quieras obtener información e incluso actividades turísticas de las que podrás disfrutar</p>

                        <div className={style.filterOptions}>
                            <input onClick={()=>handlePagClick(1)} onChange={(e) => setTextOnSearch(e.target.value)} className={style.searchBox} type={'text'} placeholder={'Escribe el pais aqui...'}/>
                            <h3 className={style.filterTitle}>filtros:</h3>

                            <button className={style.orderButton} onClick={()=>handleAscDesc()}>
                                <div className={style.insideOrderButton}>
                                    <p style={{margin: 'auto 0 auto 0.5rem'}}>PAÍS</p>
                                        <img className={style.orderImg} src={nameOrder === 1 ? descending : ascending} alt={'order'}/>
                                </div>
                            </button>

                            <button className={populationOrder === 0 ? style.orderButton : style.pressed} onClick={()=>handlePopulation()}>
                                <div className={style.insideOrderButton}>
                                    <p style={populationOrder === 1 || populationOrder === 2 ? {margin: 'auto 0 auto 0.5rem'} : {margin: 'auto 0.5rem auto 0.5rem'}}>POBLACIÓN</p>
                                    {populationOrder !== 0 &&
                                        <img className={style.orderImg} src={populationOrder === 1 ? dnumeric : anumeric} alt={'order'}/>
                                    }
                                </div>
                            </button>

                            <select className={style.orderButton} value={continentFilter} onChange={(e)=>handleContinentChange(e.target.value)}>
                                {continentFilter === 'default'
                                    ? (
                                        <option value={'default'} disabled hidden>CONTINENTE</option>
                                    )
                                    :
                                    (
                                        <option value={'default'}>--SIN FILTRO--</option>
                                    )
                                }
                                {continents.length === 0 && <option disabled>--CARGANDO--</option>}
                                {continents.map(continent => <option key={continent} value={`${continent}`}>{continent.toUpperCase()}</option>)}
                            </select>

                            <select className={style.orderButton} value={activityFilter} onChange={(e)=>handleActivityChange(e.target.value)}>
                                {activityFilter === 'default'
                                    ? (
                                        <option value={'default'} disabled hidden>ACTIVIDAD</option>
                                    )
                                    :
                                    (
                                        <option value={'default'}>--SIN FILTRO--</option>
                                    )
                                }
                                {activities.length === 0 && <option disabled>--SIN REGISTROS--</option>}
                                {activities.map(activity => <option key={activity} value={`${activity}`}>{activity.toUpperCase()}</option>)}
                            </select>
                        </div>
                    </div>

                    <img className={style.contentImage} src={himage} alt={'himage'}/>

                </div>
            </div>
            <div className={style.homeBody}>
                <div className={style.countrySection}>
                    {isLoading ?
                        (
                            <Loader/>
                        )
                        :
                        (
                            <div>
                                {responsive === false && countriesToLoad.length !== 0 &&
                                    <div className={style.paginado}>
                                        <ul>
                                            {pages.map(page => <li key={Number(page)} onClick={() => handlePagClick(page)} className={currentPage === page? style.active: style.inactive}>{page}</li>)}
                                        </ul>
                                    </div>
                                }
                                {responsive === true && countriesToLoad.length !== 0 &&
                                    <div className={style.paginado}>
                                        <button className={currentPage === 1 ? style.hiddenItem : style.paginationButton} onClick={handlePrev}>Prev</button>
                                        <ul>
                                            {pages.map(page => page <= maxPageCount && page >= minPageCount ? <li key={Number(page)} onClick={() => handlePagClick(page)} className={currentPage === page? style.active: style.inactive}>{page}</li> : null)}
                                        </ul>
                                        <button className={currentPage === pages.length ? style.hiddenItem : style.paginationButton} onClick={handleNext}>Next</button>                                    </div>
                                }

                                {countriesToLoad.length === 0 &&
                                    <p style={{marginTop: '1rem', fontStyle: 'italic'}}>No existen países con ese nombre</p>
                                }
                                <div className={style.countrySection}>
                                    {countriesToLoad.map(country => <CountryCard key={countryList.indexOf(country)} country={country}/>)}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Home