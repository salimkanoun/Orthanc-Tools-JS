import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../../services/apis'
import { toastifySuccess, toastifyError } from '../../../services/toastify'
import OhifLink from '../../Ohif/OhifLink'

class ActionBouton extends Component{

    constructor(props){
        super(props)
        this.modify = this.modify.bind(this)
        this.delete = this.delete.bind(this)
    }

    modify() {
        console.log("Modify Call" + this.props.level +" ID "+ this.props.orthancID)
    }

    async delete( ) {
        let orthancID = this.props.orthancID
        switch(this.props.level){
            case 'patient':
                await apis.content.deletePatient(orthancID)
                toastifySuccess("Patient " + orthancID + " have been deleted")
                break
            case 'studies':
                await apis.content.deleteStudies(orthancID)
                toastifySuccess("Studies " + orthancID + " have been deleted")
                break
            case 'series':
                await apis.content.deleteSeries(orthancID)
                toastifySuccess("Series " + orthancID + " have been deleted")
                break
            default:
                toastifyError("Wrong level")
        }

        this.props.onDelete(orthancID)
    }

    render(){
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <OhifLink className='dropdown-item bg-info' {...this.props} />
                    <button className='dropdown-item bg-warning' type='button' onClick={ this.modify } >Modify</button>
                    <button className='dropdown-item bg-danger' type='button' onClick={ this.delete }>Delete</button>
                </Dropdown.Menu>
            </Dropdown>
            )
    }


}

export default ActionBouton