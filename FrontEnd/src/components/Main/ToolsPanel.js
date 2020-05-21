import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import AnonTool from './AnonTool'
import ExportTool from './ExportTool'
import DeleteTool from './DeleteTool'

class ToolsPanel extends Component {

    state = {
        show: '',
        confirmDelete: false
    }

    constructor(props){
        super(props)
        this.closePopovers = this.closePopovers.bind(this)
        this.setConfirmDelete = this.setConfirmDelete.bind(this)
    }

    closePopovers(){
        this.setState({
            show : ''
        })
    }

    setConfirmDelete(){
        this.setState({
            confirmDelete: !this.state.confirmDelete
        })
    }


    render(){
        const refExport = React.createRef()
        const refAnon = React.createRef()
        const refDelete = React.createRef()
        return (
            <div className="row">
                <div className="mr-1">
                    <Link id='anon' ref={refAnon} type="button" className="btn btn-primary" onMouseOver={() => this.setState({show: 'anon'})} to='/anonymize'>
                        Anonymize <br/>
                        <span className="badge badge-light" onMouseOver={() => this.setState({show: 'anon'})}>{this.props.anonList.length}</span>
                    </Link>
                    <AnonTool target={refAnon} show={this.state.show === 'anon' ? true : false} onHide={this.closePopovers} />
                </div>
                <div className="mr-1">
                    <Link id='export' ref={refExport} type="button" className="btn btn-primary" onMouseOver={() => this.setState({show: 'export'})} to='/export' >
                        Export <br/>
                        <span className="badge badge-light" onMouseOver={() => this.setState({show: 'export'})}>{this.props.studyArray.length}</span>
                    </Link>
                    <ExportTool  target={refExport} show={this.state.show === 'export' ? true : false} onHide={this.closePopovers} />
                </div>
                <div className="mr-1" >
                    <button id='delete' ref={refDelete} type="button" className="btn btn-danger" onMouseOver={() => this.setState({show: 'delete'})} onClick={() => this.setState({confirmDelete: true})} >
                        Delete <br/>
                        <span className="badge badge-light" onMouseOver={() => this.setState({show: 'delete'})} >{(this.props.deleteList.length)}</span>
                    </button>
                    <DeleteTool target={refDelete} show={this.state.show === 'delete' ? true : false} onHide={this.closePopovers} confirmDelete={this.state.confirmDelete} setConfirm={this.setConfirmDelete} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        deleteList: state.DeleteList.deleteList,
        studyArray: state.ExportList.studyArray,
        anonList: state.AnonList.anonList
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel)

