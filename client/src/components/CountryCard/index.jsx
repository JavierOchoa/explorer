import React from "react";
import style from './countrycard.module.css';
import {Link} from "react-router-dom";
function Index({country}){
    return(
            <div className={style.countryCard}>
                <Link to={`/country/${country.id}`}>
                    <img className={style.flag} src={country.flag} alt={`${country.name}'s flag`}/>
                </Link>
                <div className={style.data}>
                    <p className={style.countryName}>{country.name}</p>
                    <p className={style.countryContinent}>{country.continent}</p>
                </div>
            </div>
    )
}

export default Index;