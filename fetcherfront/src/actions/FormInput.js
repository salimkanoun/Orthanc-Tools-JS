import {ADD_AET, SET_FORM_DATA, ADD_MODALITIES} from './actions-types'


export function setAets(aet){
    return {
        type : ADD_AET,
        payload : aet
    }

}

export function setFormData(name, value){
    return {
        type : SET_FORM_DATA,
        payload : {name : name, value : value}
    }
}

export function addModalities(modalities){
    console.log('aa')
    console.log(modalities)
    return {
        type : ADD_MODALITIES,
        payload : modalities
    }
}