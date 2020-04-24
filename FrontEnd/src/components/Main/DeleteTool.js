import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    /*
    TODO :
    
    =>Souci avec les props par default dans tablePatient et TableStudy (props pour cacher les colonne non voulu) 

    =>Modifier la taille du popover, c'est moche, la table ne rentre pas

    =>Configurer le bouton (removeContent) pour récupérer les info de la ligne 

    >Ajouter un bouton pour confirmer le delete qui soit 
    -boucle et delete via l'api 
    -envoie un array des éléments à supprimer au back et le back se charge de la suppression
    */
    
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.data = this.data.bind(this)
    }

    state = {dataForTable: []}

    data(){
        let answer = [] //data pour trier les study et les patients
        let dataForTable = [] //data sous forme de row pour la table
        
        this.props.listContent.forEach(element => {
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
        this.props.listContent.forEach((content) => {
            console.log("Will delete " + content.id + " from " + content.level + " level")
        })
        this.data()
    }

    removeContent(e){
        console.log("remove ", e)
        e.stopPropagation()
    }

    
    render(){
        const button = <button type="button" className="btn btn-danger" onClick={this.removeContent}>Remove</button>
        const popover = (
            <Popover id="popover-basic" >
                <Popover.Title as="h3">Delete List</Popover.Title>
                <Popover.Content>
                    <TablePatientsWithNestedStudies patients={this.state.dataForTable} hiddenActionBouton={true} hiddenRemoveRow={false} buttonRemove={button}/>
                </Popover.Content>
            </Popover>
        )
        return (
            <Fragment>
                <OverlayTrigger trigger="click" placement="bottom" overlay={popover}   >
                <button type="button" className="btn btn-danger" onClick={this.handleClick}  >
                    Delete <br/>
                    <span className="badge badge-light">{this.props.listContent.length}</span>
                    <span className="sr-only">Delete List</span>
                </button>
                </OverlayTrigger>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        listContent: state.ContentList.listContent
    }
}

export default connect(mapStateToProps)(DeleteTool)