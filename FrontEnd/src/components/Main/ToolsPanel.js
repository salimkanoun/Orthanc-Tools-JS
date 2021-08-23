import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {Col, Row} from 'react-bootstrap';

import AnonTool from './AnonTool'
import ExportTool from './ExportTool'

class ToolsPanel extends Component {

    state = {
        show: '',
        confirmDelete: false
    }

    closePopovers = () => {
        this.setState({
            show: ''
        })
    }

    setConfirmDelete = () => {
        this.setState(prevState => ({
            confirmDelete: !prevState.confirmDelete
        }))
    }

    render = () => {
        const refExport = React.createRef()
        const refAnon = React.createRef()
        const refDelete = React.createRef()
        return (
            <div className="end">
                <Row>
                    <Col>
                        <span className="mr-1" hidden={!this.props.roles.anon}>
                            <Link id='anon' ref={refAnon} type="button" className="btn otjs-btn-tools otjs-btn-tools-blue w-12"
                                onMouseOver={this.props.apercu ? () => this.setState({show: 'anon'}) : null} to='/anonymize'>
                                <i class="fas fa-user-secret me-2"></i> Anonymize 
                                <span className="ms-2 badge bg-light text-dark"
                                    onMouseOver={this.props.apercu ? () => this.setState({show: 'anon'}) : null}>{this.props.anonList.length}</span>
                            </Link>
                            <AnonTool target={refAnon} show={this.state.show === 'anon' ? true : false}
                                    onHide={this.closePopovers}/>
                        </span>
                    </Col>
                    <Col>
                        <span className="mr-1" hidden={!this.props.roles.export_extern || !this.props.roles.export_local}>
                            <Link id='export' ref={refExport} type="button" className="btn otjs-btn-tools otjs-btn-tools-orange w-12"
                                onMouseOver={this.props.apercu ? () => this.setState({show: 'export'}) : null} to='/export'>
                                <i class="fas fa-file-export me-2"></i> Export 
                                <span className="ms-2 badge bg-light text-dark"
                                    onMouseOver={this.props.apercu ? () => this.setState({show: 'export'}) : null}>{this.props.studyArray.length}</span>
                            </Link>
                            <ExportTool target={refExport} show={this.state.show === 'export' ? true : false}
                                        onHide={this.closePopovers}/>
                        </span>
                    </Col>
                    <Col>
                        <span className="mr-1" onMouseOver={this.props.apercu ? () => this.setState({show: ''}) : null}
                            hidden={!this.props.roles.delete || !this.props.apercu}>
                            <Link id='delete' ref={refDelete} type="button" className="btn otjs-btn-tools otjs-btn-tools-red w-12" to='/delete'>
                                <i class="far fa-trash-alt me-2"></i> Delete 
                                <span className="badge bg-light text-dark ms-2"
                                    onMouseOver={this.props.apercu ? () => this.setState({show: 'delete'}) : null}>{this.props.deleteList.length}</span>
                            </Link>
                        </span>
                    </Col>
                    <Col>
                        <span className='mr-1' hidden={this.props.apercu}>
                            <Link id='delete' ref={refDelete} type='button' className='btn otjs-btn-tools otjs-btn-tools-red' to='/delete'>
                                Delete <br/>
                                <span className="badge bg-light text-dark">{this.props.deleteList.length}</span>
                            </Link>
                        </span>
                    </Col>
                </Row>
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

export default connect(mapStateToProps, null)(ToolsPanel)

