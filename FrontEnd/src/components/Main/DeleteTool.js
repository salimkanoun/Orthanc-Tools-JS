import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { removePatientFromDeleteList, removeStudyFromDeleteList } from '../../actions/DeleteList'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    /*
    TODO :
    
    =>Souci avec les props par default dans tablePatient et TableStudy (props pour cacher les colonne non voulu) 

    =>Modifier la taille du popover, c'est moche, la table ne rentre pas

    

    >Ajouter un bouton pour confirmer le delete qui soit 
    -boucle et delete via l'api 
    -envoie un array des éléments à supprimer au back et le back se charge de la suppression
    */
    
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.data = this.data.bind(this)
        this.removeContent = this.removeContent.bind(this)
        this.setRemoveRow = this.setRemoveRow.bind(this)
    }

    state = {dataForTable: [], removeRow: {}}

    data(){
        let answer = [] //data pour trier les study et les patients
        let dataForTable = [] //data sous forme de row pour la table
        
        this.props.deleteList.forEach(element => {
            if (element.level === 'patients'){
                answer[element.row.PatientOrthancID] = {...element.row}
            }else{
                //traitement si study 
                answer[element.row.PatientOrthancID] = {
                        PatientOrthancID: element.row.PatientOrthancID, 
                        PatientID: element.row.PatientID, 
                        PatientName: element.row.PatientName, 
                        studies: {
                            [element.row.StudyOrthancID]: {
                                StudyDate: element.row.StudyDate, 
                                StudyDescription: element.row.StudyDescription, 
                                StudyInstanceUID: element.row.StudyInstanceUID,
                                AccessionNumber: element.row.AccessionNumber, 
                                StudyTime: element.row.StudyTime
                            }
                        }
                    }
            }
        })
        for(let patient in answer) {
            dataForTable.push( {
                PatientOrthancID  : patient,
                ...answer[patient]
            })
        }
        this.setState({dataForTable: dataForTable})
}

    handleClick(){
        //call API DELETE 
        this.props.deleteList.forEach((content) => {
            console.log("Will delete " + content.id + " from " + content.level + " level")
        })
        this.data()
    }

    removeContent(e){
        console.log(this.state.removeRow)
        switch (this.state.removeRow.level){
            case 'patient':
                this.props.removePatientFromDeleteList(this.state.removeRow.row)
                break
            case 'study':
                this.props.removeStudyFromDeleteList(this.state.removeRow.row)
                break
            default:
                break
        }
        e.stopPropagation()
    }

    setRemoveRow(row, level){
        this.setState({removeRow: {row: row, level: level}})
    }

    
    render(){
        const button = <button type="button" className="btn btn-danger" onClick={this.removeContent}>Remove</button>
        const popover = (
            <Popover id="popover-basic" >
                <Popover.Title as="h3">Delete List</Popover.Title>
                <Popover.Content>
                    <TablePatientsWithNestedStudies patients={this.state.dataForTable} hiddenActionBouton={true} hiddenRemoveRow={false} buttonRemove={button} setRemoveRow={this.setRemoveRow} />
                </Popover.Content>
            </Popover>
        )
        return (
            <Fragment>
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}   >
                <button type="button" className="btn btn-danger" onClick={this.handleClick}  >
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