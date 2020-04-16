import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import apis from '../../services/apis'
import { toastifySuccess, toastifyError } from '../../services/toastify'

class ActionBouton extends Component{

    constructor(props){
        super(props)
        this.modify = this.modify.bind(this)
        this.delete = this.delete.bind(this)
    }

    modify(level, orthancID){
        console.log("//TODO")
    }

    async delete(level, orthancID){
        switch(level){
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
    }

    render(){
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Action
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <button className='dropdown-item bg-warning' type='button' onClick={() => this.modify(this.props.level, this.props.orthancID)} >Modify</button>
                    <button className='dropdown-item bg-danger' type='button' onClick={() => this.delete(this.props.level, this.props.orthancID)}>Delete</button>
                </Dropdown.Menu>
            </Dropdown>
            )
    }


}

export default ActionBouton