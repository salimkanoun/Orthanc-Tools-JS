import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ExportTool extends Component {

    state = {
        size : 0
    }

    render(){
        return (
            <button type="button" class="btn btn-primary">
            Export <span class="badge badge-light">{this.state.size}</span>
            <span class="sr-only">Export List</span>
          </button>
        )
    }
}