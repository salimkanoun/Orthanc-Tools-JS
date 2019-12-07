import {ADD_AET, SET_FORM_DATA} from './actions-types'

function setAets(aet){
    return {
        type : ADD_AET,
        payload : aet
    }

}

function setFormData(name, value){
    return {
        type : SET_FORM_DATA,
        payload : {name : name, value : value}
    }
}

export {setAets, setFormData}