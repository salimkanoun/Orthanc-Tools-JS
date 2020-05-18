import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

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
        this.closePopovers = this.closePopovers.bind(this)
    }

    closePopovers(){
        this.setState({ 
            showAnon: false, 
            showDelete: false, 
            showExport: false
        })
    }

    render(){
        const refExport = React.createRef()
        const refAnon = React.createRef()
        const refDelete = React.createRef()
        return (
            <div className="row">
                <div className="mr-1">
                    <Link id='anon' ref={refAnon} type="button" className="btn btn-primary" onMouseOver={() => this.setState({showAnon: true, showDelete: false, showExport: false})} to='/anonymize'>
                        Anonymize <br/>
                        <span className="badge badge-light" onMouseOver={() => this.setState({showAnon: true, showDelete: false, showExport: false})}>{this.props.anonList.length}</span>
                    </Link>
                    <AnonTool target={refAnon} show={this.state.showAnon} onHide={this.closePopovers} />
                </div>
                <div className="mr-1">
                    <Link id='export' ref={refExport} type="button" className="btn btn-primary" onMouseOver={() => this.setState({showAnon: false, showDelete: false, showExport: true})} to='/export' >
                        Export <br/>
                        <span className="badge badge-light" onMouseOver={() => this.setState({showAnon: false, showDelete: false, showExport: true})}>{this.props.studyArray.length}</span>
                    </Link>
                    <ExportTool  target={refExport} show={this.state.showExport} onHide={this.closePopovers} />
                </div>
                <div className="mr-1" >
                    <button id='delete' ref={refDelete} type="button" className="btn btn-danger" onMouseOver={() => this.setState({showAnon: false, showDelete: true, showExport: false})} >
                        Delete <br/>
                        <span className="badge badge-light" onMouseOver={() => this.setState({showAnon: false, showDelete: true, showExport: false})} >{(this.props.deleteList.length)}</span>
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
        studyArray: state.ExportList.studyArray,
        anonList: state.AnonList.anonList
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(ToolsPanel)

