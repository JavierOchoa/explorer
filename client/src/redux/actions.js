import axios from "axios";
export const GET_COUNTRIES = 'GET_COUNTRIES';
export const GET_COUNTRY = 'GET_COUNTRY';

export function getCountries(){
    return function(dispatch){
        return axios.get(`/countries`)
            .then(({data}) => dispatch({type: GET_COUNTRIES, payload: data}))
    }
}

export function getCountry(idPais){
    if(!idPais){
        return function (dispatch){
            return dispatch({type: GET_COUNTRY, payload: ''})
        }
    } else {
        return function(dispatch){
            return axios.get(`/countries/${idPais}`)
                .then(({data}) => dispatch({type: GET_COUNTRY, payload: data}))
                .catch(({response}) => dispatch({type: GET_COUNTRY, payload: response.data}))
        }
    }
}