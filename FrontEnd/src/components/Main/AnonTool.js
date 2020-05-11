import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'

import {studyArrayToPatientArray} from '../../tools/processResponse'
import { emptyAnonList, removePatientFromAnonList, removeStudyFromAnonList } from '../../actions/AnonList'


class AnonTool extends Component {

    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleClickEmpty = this.handleClickEmpty.bind(this)
        this.onDeleteStudy = this.onDeleteStudy.bind(this)
        this.onDeletePatient = this.onDeletePatient.bind(this)
    }

    onDeletePatient(patientOrthancID){
        this.props.removePatientFromAnonList(patientOrthancID)
    }

    onDeleteStudy(studyOrthancID){
        this.props.removeStudyFromAnonList(studyOrthancID)
    }

    handleClickEmpty(){
        this.props.emptyAnonList()
    }

    handleClick(){
        //call API Anon 
        this.props.listContent.forEach((content) => {
            console.log("Will anonymize " + content.id + " from " + content.level + " level")
        })
    }

    render(){
        return (
            <Overlay target={this.props.target} show={this.props.show} placement="left" onHide={this.props.onHide} rootClose >
                <Popover id="popover-basic" style={ { maxWidth : '100%'}} >
                    <Popover.Title as="h3">Anon List</Popover.Title>
                    <Popover.Content>
                        <div className="float-left">
                            <Link className='btn btn-primary' to='/OrthancContent/Anon' onClick={this.props.onHide}>Open Anon Tools</Link>
                        </div>
                        <div className="float-right mb-3">
                            <button type="button" className="btn btn-warning" onClick={this.handleClickEmpty} >Empty List</button>
                        </div>
                        <TablePatientsWithNestedStudies patients={studyArrayToPatientArray(this.props.anonList)} hiddenActionBouton={true} hiddenRemoveRow={false} onDeletePatient={this.onDeletePatient} onDeleteStudy={this.onDeleteStudy} />
                    </Popover.Content>
                </Popover>
            </Overlay>
        )
    }
}

const mapStateToProps = state => {
    return {
        anonList: state.AnonList.anonList
    }
    
}

const mapDispatchToProps = {
    emptyAnonList,
    removePatientFromAnonList, 
    removeStudyFromAnonList,
}

export default connect(mapStateToProps, mapDispatchToProps)(AnonTool)