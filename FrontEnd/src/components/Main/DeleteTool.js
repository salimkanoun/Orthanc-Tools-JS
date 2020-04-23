import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import TablePatientsWithNestedStudies from '../CommonComponents/RessourcesDisplay/TablePatientsWithNestedStudies'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    /*
    Il faut mettre les données sous la bonne fomr epour la table
    Ajouter une props à la table pour qu'à la place du action bouton il est juste un bouton
    pour sortir l'élement de la liste delete (une poubelle) 

    Ajouter un bouton pour confirmer le delete qui soit 
    -boucle et delete via l'api 
    -envoie un array des éléments à supprimer au back et le back se charge de la suppression
    */
    
    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    data(content){
        let answer = []
        content.forEach(element => answer.push(element.row))
        console.log(answer);
        
        return answer
    }

    handleClick(){
        //call API DELETE 
        this.props.listContent.forEach((content) => {
            console.log("Will delete " + content.id + " from " + content.level + " level")
        })
        
        
    }

    popover = (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Popover</Popover.Title>
            <Popover.Content>
                <TablePatientsWithNestedStudies data={this.data(this.props.listContent)} />
            </Popover.Content>
        </Popover>
    )

    render(){
        return (
            <Fragment>
                <OverlayTrigger trigger="click" placement="left" overlay={this.popover}>
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