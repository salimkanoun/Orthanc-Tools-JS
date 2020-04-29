import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { removePatientFromDeleteList, removeStudyFromDeleteList } from '../../actions/DeleteList'
import apis from '../../services/apis'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    /*
    TODO :
    

    =>Modifier la taille du popover, c'est moche, la table ne rentre pas

    */
    
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.data = this.data.bind(this)
        this.removeRow = this.removeRow.bind(this)
    }

    data(){
        let answer = this.props.deleteList
        let dataForTable = [] //data sous forme de row pour la table
        answer.forEach(patient => {
            dataForTable.push( {
                PatientOrthancID  : patient.id,
                ...patient
            })
        })
        return dataForTable
}

    async handleClick(){
        //call API DELETE 
        this.props.deleteList.forEach(async (patient) => {
                let studyID = Object.keys(patient.studies)
                studyID.forEach(async (id) => {
                    console.log("will delete", id)
                    //await apis.content.deleteStudies(id) //take a lot of time, need to pass by the back
                    this.props.removePatientFromDeleteList(patient)
                })
        })
    }

    removeRow(row, level){
        switch (level){
            case 'patient':
                this.props.removePatientFromDeleteList(row)
                break
            case 'study':
                this.props.removeStudyFromDeleteList(row)
                break
            default:
                break
        }
    }

    
    render(){
        const popover = (
            <Popover id="popover-basic" >
                <Popover.Title as="h3">Delete List</Popover.Title>
                <Popover.Content>
                    <TablePatientsWithNestedStudies patients={this.data()} hiddenActionBouton={true} hiddenRemoveRow={false} removeRow={this.removeRow} />
                    <button type="button" className="btn btn-danger" onClick={this.handleClick} >Delete</button>
                </Popover.Content>
            </Popover>
        )
        return (
            <Fragment>
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}   >
                <button type="button" className="btn btn-danger" >
                    Delete <br/>
                    <span className="badge badge-light">{this.props.deleteList.length}</span>
                    <span className="sr-only">Delete List</span>
                </button>
                </OverlayTrigger>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList
    }
}

const mapDispatchToProps = {
    removePatientFromDeleteList, 
    removeStudyFromDeleteList
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTool)