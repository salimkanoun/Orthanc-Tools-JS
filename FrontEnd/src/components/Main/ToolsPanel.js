import React, { Component, forwardRef } from 'react'
import { connect } from 'react-redux'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import AnonTool from './AnonTool'
import ExportTool from './ExportTool'
import DeleteTool from './DeleteTool'

class ToolsPanel extends Component {

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
                <div className="mr-1">
                    <DeleteTool target={this.ref} />
                        <div>
                            <button type="button" className="btn btn-danger" >
                                Delete <br/>
                                <span className="badge badge-light">{this.props.deleteList.length}</span>
                                <span className="sr-only">Delete List</span>
                            </button>
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

