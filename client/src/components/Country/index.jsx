import React from "react";
import {connect} from "react-redux";
import {getCountry} from "../../redux/actions";
import style from './country.module.css';
import Navbar from "../Navbar";
import Loader from "../Loader";

class Country extends React.Component{
    constructor(props) {
        super(props);
        const { countryId } = this.props.match.params
        this.state={
            loaded: false,
            countryCode: countryId
        }
    }
    componentDidMount() {
        this.props.getCountry(this.state.countryCode)
    }
    componentWillUnmount() {
        this.props.getCountry()
    }

    render(){
        const {country} = this.props
        return(
            <div className={style.countryPage}>
                <Navbar/>
                {!country.name && !country.message &&
                    <div className={style.countrySection}>
                        <Loader/>
                    </div>
                }
                {country.message &&
                    <div className={style.countrySection}>
                        {()=>this.setState({loaded: true})}
                        <h1>{country.message}</h1>
                    </div>
                }
                {country.name &&
                    <div className={style.countrySection}>
                        <div className={style.countryInfo}>
                            <h1>{country.name}</h1>
                            <h3>{country.id}</h3>
                            <p><span className={style.countryInfoLabel}>Capital:</span> {country.capital}</p>
                            <p><span className={style.countryInfoLabel}>Continente:</span> {country.continent}</p>
                            <p><span className={style.countryInfoLabel}>Subregión:</span> {country.subregion}</p>
                            <p><span className={style.countryInfoLabel}>Area:</span> {country.area} km2</p>
                            <p><span className={style.countryInfoLabel}>Población:</span> {country.population}</p>
                        </div>
                        <img className={style.flag} src={country.flag} alt={`${country.name} flag`}/>
                    </div>
                }
                {country.activities &&
                    <div className={style.activitySection}>{country.activities.length > 0 && <h2 className={style.activityTitle}>ACTIVIDADES</h2>}
                        <div className={style.activities}>
                            {country.activities.map(activity =>
                                <div key={activity.id} className={style.activity}>
                                    <h2 className={style.activityName}>{activity.name}</h2>
                                    <p>Dificultad: {this.props.difficultyMap[activity.difficulty]}</p>
                                    <p>Duración: {activity.duration}</p>
                                    <p>Temporada: {activity.season}</p>
                                </div>
                            )}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        country: state.country,
        difficultyMap: state.difficultyMap
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        getCountry: (country)=>dispatch(getCountry(country))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Country)
