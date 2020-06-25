import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import BootstrapTable from 'react-bootstrap-table-next';
import Modal from 'react-bootstrap/Modal';

import apis from '../../services/apis'

class Roles extends Component {

    state = { 
        data: {
            name: undefined,
            upload: false, 
            content: false, 
            anon: false, 
            exportLocal: false, 
            exportExtern: false, 
            query: false,
            autoQuery: false, 
            delete: false, 
            admin: false, 
            modify: false
        }, 
        roles: [], 
        showModify: false, 
        showCreate: false, 
        openDelete: false,
    };

    constructor(props) {
        super(props);
        this.create = this.create.bind(this)
    }

    componentDidMount() {
        this.getRoles()
    }

    async getRoles(){
        let roles = await apis.role.getRoles()
        this.setState({roles: roles})
    }

    modify(e){
        switch (e.target.name) {
            case 'openModify':
                this.setState({
                    showModify: true
                })
                break;
            case 'modify':
                console.log(this.state.data)
                break
            default:
                break;
        }
    }

    delete(e){
        switch (e.target.name) {
            case 'openDelete':
                this.setState({openDelete: true})
                break;
        
            default:
                break;
        }
    }

    create(e){
        switch (e.target.name) {
            case 'openCreate':
                this.setState({showCreate: true})
                break;
        
            default:
                break;
        }
    }

    columns = [
        {
            dataField: 'name', 
            text: 'Name', 
            sort: true
        }, {
            dataField: 'edit', 
            text: 'Edit', 
            formatter: (cell, row, index) => {
                return <button type='button' className='btn btn-warning' name='openModify' onClick={()=>{
                    this.modify(row.name)
                }} >Edit</button>
            }
        }, {
            dataField: 'delete', 
            text: 'Delete', 
            formatter: (cell, row, index) => {
                return <button type='button' className='btn btn-danger' name='openDelete' onClick={()=>{
                    this.delete(row.name)
                }} >Delete</button>
            }
        }
    ]
    
    form(){
        return (
            <Fragment>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Administration</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.admin} onChange={()=>this.setState(prevState => ({data: {...prevState.data, admin: !prevState.data.admin}}))} />
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Anonymisation</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.anon} onChange={()=>this.setState(prevState => ({data: {...prevState.data, anon: !prevState.data.anon}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Auto-Query</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.autoQuery} onChange={()=>this.setState(prevState => ({data: {...prevState.data, autoQuery: !prevState.data.autoQuery}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Content</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.content} onChange={()=>this.setState(prevState => ({data: {...prevState.data, content: !prevState.data.content}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Delete</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.delete} onChange={()=>this.setState(prevState => ({data: {...prevState.data, delete: !prevState.data.delete}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Export Local</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.exportLocal} onChange={()=>this.setState(prevState => ({data: {...prevState.data, exportLocal: !prevState.data.exportLocal}}))}/>  
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Export Extern</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.exportExtern} onChange={()=>this.setState(prevState => ({data: {...prevState.data, exportExtern: !prevState.data.exportExtern}}))}/>  
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Query</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.query} onChange={()=>this.setState(prevState => ({data: {...prevState.data, query: !prevState.data.query}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Upload</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.upload} onChange={()=>this.setState(prevState => ({data: {...prevState.data, upload: !prevState.data.upload}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Modify</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.modify} onChange={()=>this.setState(prevState => ({data: {...prevState.data, modify: !prevState.data.upload}}))}/>
                        </div>
                    </div>
            </Fragment>
        )
    }

    render() {
        return (
            <Fragment>
                <h2 className='card-title'>Roles Panel</h2>
                <button type='button' name='openCreate' className='btn btn-primary mb-3 float-right' onClick={this.create} >New Role</button>
                <BootstrapTable keyField='name' data={this.state.roles} columns={this.columns} striped />

                <Modal id='create' show={this.state.showCreate} onHide={() => this.setState({showCreate: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new role</h2>
                    </Modal.Header>
                    <Modal.Body>   
                        <label>Name*</label>
                        <input className='form-control mb-4' type='text' placeholder='name' name='name' value={this.state.data.name} onChange={(value)=>this.setState(prevState => ({data: {...prevState.data, name: value}}))} required />
                
                        {this.form()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create} >Create</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({showCreate: false})} >Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

export default Roles;