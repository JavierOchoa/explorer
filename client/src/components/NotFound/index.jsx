import React from "react";
import notFound from '../../files/page-not-found.svg';
import style from './notfound.module.css'
import {Link} from "react-router-dom";

function NotFound(){
    return(
        <div className={style.notFoundSection}>
            <img className={style.image} src={notFound} alt={'page not found'}/>
            <Link className={style.buttonLink} to={'/home'}>
                <button className={style.lostButton}>Pagina Principal</button>
            </Link>
        </div>
    )
}

export default NotFound;