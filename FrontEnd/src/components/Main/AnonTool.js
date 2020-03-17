import React, { Component } from 'react'

//ce composant sera a connecter au redux pour avoir la longueur de la list d'anon
export default class AnonTool extends Component {

    state = {
        size : 0
    }

    render(){
        return (
            <button type="button" className="btn btn-primary">
            Anonymize <span className="badge badge-light">{this.state.size}</span>
            <span className="sr-only">Anonymization List</span>
          </button>
        )
    }
}