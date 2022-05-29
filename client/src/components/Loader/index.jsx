import React from "react";
import compass from "../../files/compass.gif";
import style from './loader.module.css';

function Loader(){
    return(
        <img className={style.loader} src={compass} alt={'loading...'}/>
    )
}

export default Loader;