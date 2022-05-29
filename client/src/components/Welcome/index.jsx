import React from "react";
import {Link} from "react-router-dom";
import backpack from '../../files/backpack.svg';
import style from './welcome.module.css';

function Index(){
    const welcomeStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${backpack})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#F9F871',
        height: '100vh',
    }
    return(
        <div>
            <div style={welcomeStyle}>
                <h1 className={style.siteTitle}>explorer</h1>
                <div className={style.buttonSection}>
                    <Link to={'/home'}>
                        <button className={style.homeButton}>BIENVENIDO</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Index