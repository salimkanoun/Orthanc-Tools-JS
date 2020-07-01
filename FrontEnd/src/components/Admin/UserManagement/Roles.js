import React, { Component, Fragment } from "react"
import Toggle from 'react-toggle'
import BootstrapTable from 'react-bootstrap-table-next';
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis'

class Roles extends Component {

    state = { 
        data: {
            name: '',
            import: false, 
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
        this.handleChange = this.handleChange.bind(this)
        this.delete = this.delete.bind(this)
        this.modify = this.modify.bind(this)
    }

    componentDidMount() {
        this.getRoles()
    }

    async getRoles(){
        let roles = await apis.role.getRoles()
        this.setState({roles: roles})
    }

    async modify(){
        let payload = this.state.data
        await apis.role.modifyRole(payload).then(() => this.onHide()).catch(error => console.log(error))
    }

    async openModify(name){
        let permission = {}
        await apis.role.getPermission(name).then(answer => permission = answer[0]).then(()=>{
            this.setState({
                data: {
                    name: name,
                    import: permission.import, 
                    content: permission.content, 
                    anon: permission.anon, 
                    exportLocal: permission.export_local, 
                    exportExtern: permission.export_extern, 
                    query: permission.query,
                    autoQuery: permission.auto_query, 
                    delete: permission.delete, 
                    admin: permission.admin, 
                    modify: permission.modify
                }, 
                showModify: true
            })
        }).catch(error => console.log(error))
        
    }

    async delete(e){
        await apis.role.deleteRole(this.state.data.name).then(() => this.onHide()).catch(error => console.log(error))
    }

    async create(){
        await apis.role.createRole(this.state.data).then(()=>this.onHide()).catch(error => console.log(error))
    }

    onHide(){
        this.setState(prevState => ({
            data: {...prevState.data, name: ''},
            showCreate: false, 
            showModify: false, 
            showDelete: false
        }))
        this.getRoles()
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
                    this.openModify(row.name)
                }} >Edit</button>
            }
        }, {
            dataField: 'delete', 
            text: 'Delete', 
            formatter: (cell, row, index) => {
                return <button type='button' className='btn btn-danger' name='openDelete' onClick={()=>{
                    this.setState(prevState => ({
                        data: {...prevState.data, name: row.name}, 
                        showDelete: true
                    }))
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
                            <h5>Import</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.import} onChange={()=>this.setState(prevState => ({data: {...prevState.data, import: !prevState.data.import}}))}/>
                        </div>
                    </div>
                    <div className="row mb-2">
                        <div className='col-5'>
                            <h5>Modify</h5>
                        </div>
                        <div className='col-auto'>
                            <Toggle checked={this.state.data.modify} onChange={()=>this.setState(prevState => ({data: {...prevState.data, modify: !prevState.data.modify}}))}/>
                        </div>
                    </div>
            </Fragment>
        )
    }

    handleChange(event){
        let value = event.target.value
        this.setState(prevState => ({
            data: {
                ...prevState.data, 
                name: value
            }
        }))
    }

    render() {
        return (
            <Fragment>
                <h2 className='card-title'>Roles Panel</h2>
                <button type='button' className='btn btn-primary mb-3 float-right' onClick={() => this.setState({showCreate: true})} >New Role</button>
                <BootstrapTable keyField='name' data={this.state.roles} columns={this.columns} striped />

                <Modal id='create' show={this.state.showCreate} onHide={() => this.setState({showCreate: false})}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create new role</h2>
                    </Modal.Header>
                    <Modal.Body>   
                        <label>Name*</label>
                        <input className='form-control mb-4' type='text' placeholder='name' name='name' value={this.state.data.name} onChange={this.handleChange} required />
                
                        {this.form()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.create} >Create</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({showCreate: false})} >Cancel</button>
                    </Modal.Footer>
                </Modal>

                <Modal id='delete' show={this.state.showDelete} onHide={() => this.setState({showDelete: false})} size='sm'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Delete Role</h2>
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete {this.state.data.name} ? 
                    </Modal.Body>
                    <Modal.Footer>
                        <button name='delete' type='button' className='btn btn-danger' onClick={this.delete}>Delete</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({showDelete: false})}>Close</button>
                    </Modal.Footer>
                </Modal>
            
                <Modal id='modify' show={this.state.showModify} onHide={() => this.onHide()}>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Modify role {this.state.data.name}</h2>
                    </Modal.Header>
                    <Modal.Body>  
                        {this.form()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' name='create' className='btn btn-primary' onClick={this.modify} >Save</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({showModify: false})} >Cancel</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
        );
    }
}

export default Roles;