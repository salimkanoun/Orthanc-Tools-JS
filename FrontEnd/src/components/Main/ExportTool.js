import React, { Component } from 'react'
import { connect } from 'react-redux'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste d'export
class ExportTool extends Component {

    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        //call API Export 
        this.props.listContent.forEach((content) => {
            console.log("Will export " + content.id + " from " + content.level + " level")
        })
    }

    render(){
        return (
            <button type="button" className="btn btn-primary" onClick={this.handleClick} >
                Export <br/>
                <span className="badge badge-light">{this.props.listContent.length}</span>
                <span className="sr-only">Export List</span>
            </button>
        )
    }
}

const mapStateToProps = state => {
    return {
      listContent: state.ContentList.listContent
    }
}

export default /*connect(mapStateToProps)*/(ExportTool)
