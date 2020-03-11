import React, { Component } from 'react'
import { Link } from 'react-router-dom'

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