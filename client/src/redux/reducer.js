import {GET_COUNTRIES, GET_COUNTRY} from "./actions";

let initialState = ({
    countries: [],
    continents: [],
    country: {},
    loading: true,
    difficultyMap: {1: 'Muy Baja', 2: 'Baja', 3: 'Intermedia', 4: 'Alta', 5: 'Muy Alta'}
});

export default function rootReducer(state=initialState, action){
    switch (action.type){
        case GET_COUNTRIES:
            return {
                ...state,
                countries: action.payload,
                continents: [...new Set(action.payload.map(country => country.continent))],
                loading: false
            }
        case GET_COUNTRY:
            return {
                ...state,
                country: action.payload
            }
        default:
            return {...state}
    }
}