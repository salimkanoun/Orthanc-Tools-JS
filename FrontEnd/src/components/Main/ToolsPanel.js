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
        this.setState(prevState => ({
            confirmDelete: !prevState.confirmDelete
        }))
    }


    render(){
        const refExport = React.createRef()
        const refAnon = React.createRef()
        const refDelete = React.createRef()
        return (
            <div className="row">
                <div className="mr-1" hidden={!this.props.roles.anon}>
                    <Link id='anon' ref={refAnon} type="button" className="btn btn-info" onMouseOver={this.props.apercu ? () => this.setState({show: 'anon'}) : null} to='/anonymize'>
                        Anonymize <br/>
                        <span className="badge badge-light" onMouseOver={this.props.apercu ? () => this.setState({show: 'anon'}) : null}>{this.props.anonList.length}</span>
                    </Link>
                    <AnonTool target={refAnon} show={this.state.show === 'anon' ? true : false} onHide={this.closePopovers} />
                </div>
                <div className="mr-1" hidden={!this.props.roles.export_extern || !this.props.roles.export_local}>
                    <Link id='export' ref={refExport} type="button" className="btn btn-primary" onMouseOver={this.props.apercu ? () => this.setState({show: 'export'}) : null } to='/export' >
                        Export <br/>
                        <span className="badge badge-light" onMouseOver={this.props.apercu ? () => this.setState({show: 'export'}) : null }>{this.props.studyArray.length}</span>
                    </Link>
                    <ExportTool  target={refExport} show={this.state.show === 'export' ? true : false} onHide={this.closePopovers} />
                </div>
                <div className='mr-2' hidden={this.props.apercu}>
                    <Link id='delete' ref={refDelete} type='button' className='btn btn-danger' to='/delete'>
                        Delete <br/>
                        <span className="badge badge-light">{(this.props.deleteList.length)}</span>
                    </Link>
                </div>
                <div className="mr-2" hidden={!this.props.roles.delete || !this.props.apercu} >
                    <button id='delete' ref={refDelete} type="button" className="btn btn-danger" onMouseOver={this.props.apercu ? () => this.setState({show: 'delete'}) : null } onClick={() => this.setState({confirmDelete: true})} >
                        Delete <br/>
                        <span className="badge badge-light" onMouseOver={this.props.apercu ? () => this.setState({show: 'delete'}) : null } >{(this.props.deleteList.length)}</span>
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

