import React, { Component } from 'react'
import { connect } from 'react-redux'

import AnonTool from './AnonTool'
import ExportTool from './ExportTool'
import DeleteTool from './DeleteTool'

class ToolsPanel extends Component {

    state = {
        showDelete: false,
        showExport: false,
        showAnon: false
    }

    constructor(props){
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    handleClick(e){
        switch (e.target.id){
            case 'delete':
                this.setState({ 
                    showDelete: !this.state.showDelete,
                    showAnon: false, 
                    showExport: false
                })
                break
            case 'export':
                this.setState({ 
                    showExport: !this.state.showExport,
                    showAnon: false, 
                    showDelete: false
                })
                break
            case 'anon':
                this.setState({ 
                    showAnon: !this.state.showAnon, 
                    showDelete: false, 
                    showExport: false
                })
                break
            default:
                break
        }
        
    }

    render(){
        const refExport = React.createRef()
        //const refAnon = React.createRef()
        const refDelete = React.createRef()
        return (
            <div className="row">
                <div className="mr-1">
                    <AnonTool />
                </div>
                <div className="mr-1">
                    <button id='export' ref={refExport} type="button" className="btn btn-primary" onClick={this.handleClick} >
                        Export <br/>
                        <span className="badge badge-light">{this.props.exportList.length}</span>
                        <span className="sr-only">Export List</span>
                    </button>
                    <ExportTool target={refExport} show={this.state.showExport}/>
                </div>
                <div className="mr-1" >
                    <button id='delete' ref={refDelete} type="button" className="btn btn-danger" onClick={this.handleClick}>
                        Delete <br/>
                        <span className="badge badge-light">{this.props.deleteList.length}</span>
                        <span className="sr-only">Delete List</span>
                    </button>
                    <DeleteTool target={refDelete} show={this.state.showDelete} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList,
        exportList: state.ExportList.exportList
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel)

