import React, { Component } from 'react'
import { connect } from 'react-redux'

//ce composant sera a connecter au redux pour avoir la longueur de la list d'anon
class AnonTool extends Component {

    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        //call API Anon 
        this.props.listContent.forEach((content) => {
            console.log("Will anonymize " + content.id + " from " + content.level + " level")
        })
    }

    render(){
        return (
            <button type="button" className="btn btn-primary" onClick={this.handleClick} >
                Anonymize <br/>
                <span className="badge badge-light">{this.props.listContent.length}</span>
                <span className="sr-only">Anonymization List</span>
            </button>
        )
    }
}

const mapStateToProps = state => {
    return {
      listContent: state.OrthancContent.listContent
    }
}

export default connect(mapStateToProps)(AnonTool)