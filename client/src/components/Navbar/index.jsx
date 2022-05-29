import logo from "../../files/world.svg";
import React from "react";
import {Link, NavLink} from "react-router-dom";
import style from './navbar.module.css'

function Navbar(){
    return(
        <nav className={style.navbar}>
            <img className={style.siteLogo} src={logo} alt={'logo'}/>
            <Link className={style.navLink} to={'/home'}>
                <p className={style.siteName}>explorer</p>
            </Link>
            <div className={style.rightPart}>
                <NavLink activeClassName={style.active} className={style.navLink} exact to={'/activity'}>
                    <p className={style.navItem}>nueva actividad</p>
                </NavLink>
            </div>
        </nav>
    )
}

export default Navbar;