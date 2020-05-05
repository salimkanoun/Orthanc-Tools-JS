import React, { Component } from 'react'
import { connect } from 'react-redux'

import AnonTool from './AnonTool'
import ExportTool from './ExportTool'
import DeleteTool from './DeleteTool'

class ToolsPanel extends Component {

    state = {
        show: false
    }

    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e){
        this.setState({
            show: !this.state.show
        })
    }

    render(){
        const ref = React.createRef()
        return (
            <div className="row">
                <div className="mr-1">
                    <AnonTool />
                </div>
                <div className="mr-1">
                    <ExportTool/>
                </div>
                <div className="mr-1" >
                    <div >
                        <button ref={ref} type="button" className="btn btn-danger" onClick={this.handleClick}>
                            Delete <br/>
                            <span className="badge badge-light">{this.props.deleteList.length}</span>
                            <span className="sr-only">Delete List</span>
                        </button>
                        <DeleteTool target={ref} show={this.state.show} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel)

