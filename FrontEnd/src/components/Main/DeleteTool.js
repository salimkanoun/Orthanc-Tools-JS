import React, { Component } from 'react'
import { connect } from 'react-redux'

//Ce composant sera a connecter au redux pour connaitre la longueur de la liste de delete 
class DeleteTool extends Component {

    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(){
        //call API DELETE 
        this.props.listContent.forEach((content) => {
            console.log("Will delete " + content.id + " from " + content.level + " level")
        })
    }

    render(){
        return (
            <button type="button" className="btn btn-danger" onClick={this.handleClick} >
                Delete <br/>
                <span className="badge badge-light">{this.props.listContent.length}</span>
                <span className="sr-only">Delete List</span>
            </button>
        )
    }
}

const mapStateToProps = state => {
    return {
      listContent: state.OrthancContent.listContent
    }
}

export default connect(mapStateToProps)(DeleteTool)