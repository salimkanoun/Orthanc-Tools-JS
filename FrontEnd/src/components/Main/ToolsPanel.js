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
        this.closePopovers = this.closePopovers.bind(this)
    }

    closePopovers(){
        this.setState({ 
            showAnon: false, 
            showDelete: false, 
            showExport: false
        })
    }

    handleClick(e){
        switch (e.target.id){
            case 'delete':
                this.setState({ 
                    showDelete: !this.state.showDelete
                })
                break
            case 'export':
                this.setState({ 
                    showExport: !this.state.showExport
                })
                break
            case 'anon':
                this.setState({ 
                    showAnon: !this.state.showAnon
                })
                break
            default:
                break
        }
        
    }

    getNBStudy(){
        let studyIDs = []
        this.props.exportList.forEach(study => {
            if (!studyIDs.includes(study.ParentStudy))
                studyIDs.push(study.ParentStudy)
        })
        return studyIDs.length
    }

    render(){
        const refExport = React.createRef()
        const refAnon = React.createRef()
        const refDelete = React.createRef()
        return (
            <div className="row">
                <div className="mr-1">
                <button id='anon' ref={refAnon} type="button" className="btn btn-primary" onClick={this.handleClick} >
                    Anonymize <br/>
                    <span className="badge badge-light">{this.props.anonList.length}</span>
                    <span className="sr-only">Anonymization List</span>
                </button>
                <AnonTool target={refAnon} show={this.state.showAnon} onClick={this.closePopovers} />
                </div>
                <div className="mr-1">
                    <button id='export' ref={refExport} type="button" className="btn btn-primary" onClick={this.handleClick} >
                        Export <br/>
                        <span className="badge badge-light">{this.getNBStudy()}</span>
                        <span className="sr-only">Export List</span>
                    </button>
                    <ExportTool  target={refExport} show={this.state.showExport} onClick={this.closePopovers} />
                </div>
                <div className="mr-1" >
                    <button id='delete' ref={refDelete} type="button" className="btn btn-danger" onClick={this.handleClick}>
                        Delete <br/>
                        <span className="badge badge-light">{(this.props.deleteList.length)}</span>
                        <span className="sr-only">Delete List</span>
                    </button>
                    <DeleteTool target={refDelete} show={this.state.showDelete} onHide={this.closePopovers} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList,
        exportList: state.ExportList.exportList, 
        anonList: state.AnonList.anonList
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel)

