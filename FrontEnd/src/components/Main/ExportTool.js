import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ExportTool extends Component {

    state = {
        size : 0
    }

    render(){
        return (
            <button type="button" className="btn btn-primary">
            Export <span className="badge badge-light">{this.state.size}</span>
            <span className="sr-only">Export List</span>
          </button>
        )
    }
}