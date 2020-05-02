import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'
import Popover from 'react-bootstrap/Popover'
import { removePatientFromDeleteList, removeStudyFromDeleteList } from '../../actions/DeleteList'
import {studyArrayToPatientArray} from '../../tools/processResponse'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    /*
    TODO :
    SK : Taille du popover resolue via style maxWith = 100%
    J'ai l'impression qu'il manque l'Object "Overlay" ou on défini la méthode de sortie
    Ce qui serait bien c'est que le composant se ferme lui meme quand il perd le focus
    Faudra surement refactoriser cette classe, peut etre un component qui show les 3 bouttons Export / Anon / Delete 
    aver leur chiffre du redux et les composant DeletePopover, AnonPopover dans des classes separés pour plus de lisibilité (l'equivalent du const)

    */
    
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.removeRow = this.removeRow.bind(this)
    }

    async handleClick(){
        //call API DELETE
        console.log(this.props.deleteList)
        for (let patient in this.props.deleteList){
            let studyID = Object.keys(this.props.deleteList[patient].studies)
            studyID.forEach(id => {
                console.log("will delete : ", id)
                //await apis.content.deleteStudies(id) //take a lot of time, need to pass by the back
                //this.props.removeStudyFromDeleteList(this.props.deleteList[patient].studies[id])
            })
                
        }
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
        return (
            //La position ne suit pas y a une histoire de Ref https://react-bootstrap.github.io/components/overlays/
            <Popover id="popover-basic" style={ {maxWidth: "100%"} } >
                <Popover.Title as="h3">Delete List</Popover.Title>
                <Popover.Content>
                    <TablePatientsWithNestedStudies patients={studyArrayToPatientArray(this.props.deleteList)} hiddenActionBouton={true} hiddenRemoveRow={false} removeRow={this.removeRow} />
                    <button type="button" className="btn btn-danger" onClick={this.handleClick} >Delete</button>
                </Popover.Content>
            </Popover>
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