import React, { Component } from 'react'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste d'export
export default class DeleteTool extends Component {

    state = {
        size : 0
    }

    render(){
        return (
            <button type="button" className="btn btn-danger">
                Delete <br/>
                <span className="badge badge-light">{this.state.size}</span>
                <span className="sr-only">Delete List</span>
            </button>
        )
    }
}