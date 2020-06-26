import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import apis from '../../services/apis';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'
import cellEditFactory from 'react-bootstrap-table2-editor'


class Users extends Component {

    state = {
        data : {
            id: undefined,
            username: undefined,
            first_name: undefined, 
            last_name: undefined, 
            mail: undefined,
            role: undefined
        },
        username: '',
        users: [],
        showDelete: false,
        showCreate: false,
        optionsUser: [], 
        optionRoles: [],
        disabledRows: []
    }

    async componentDidMount() {
        this.getRoles()
        this.getUsers()
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.modify = this.modify.bind(this)
        this.delete = this.delete.bind(this)
        this.createUser = this.createUser.bind(this)
        this.getRoles = this.getRoles.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.resetState = this.resetState.bind(this)
    }

    async getUsers(){
       let users = await apis.User.getUsers()
       this.setState({
           users: users, 
       })
    }

    resetState(){
        this.setState({
            data : {
                id: undefined,
                username: undefined,
                first_name: undefined, 
                last_name: undefined, 
                mail: undefined,
                role: undefined
            },
            showDelete: false,
            showCreate: false
        })
        this.getUsers()
    }
    
    async getRoles(){
        let roles = await apis.role.getRoles()
        let options =  []
        roles.forEach((role) => {
            options.push({
                value: role.name, 
                label: role.name
            })
        })
        this.setState({
            optionRoles: options
        })
    }

    handleClick(event){
        let name = event.target.name
        switch (name) {
            case 'delete':
                this.setState({showDelete: true})
                break;
            case 'create':
                this.setState({showCreate: true})
                break;
            default:
                break;
        }
    }
    

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value
        this.setState(prevState => ({
            data: {
                ...prevState.data,
                [name]: value
            }
        }))
    }

    async modify(row){
        
        await apis.User.modifyUser(row).then(()=>{
            this.resetState()
        }).catch((error) => console.log(error))
    }

    async delete(){
        if (this.state.username !== '') {
            await apis.User.deleteUser(this.state.username).then(()=>{
                this.resetState()
            })
        }
    }

    async createUser(){
        await apis.User.createUser(this.state.data)
        this.resetState()
    }

    column = [
        {
            dataField: 'id', 
            hidden: true
        },
        {
            dataField: 'username', 
            text: 'Username', 
            sort: true
        }, 
        {
            dataField: 'first_name', 
            text: 'First name', 
            sort: true
        }, 
        {
            dataField: 'last_name', 
            text: 'Last name', 
            sort: true
        }, 
        {
            dataField: 'mail', 
            text: 'Mail', 
            sort: true
        },
        {
            dataField: 'role', 
            text: 'Role', 
            sort: true
        }, 
        {
            dataField: 'edit', 
            text: 'Edit',
            editable: false,
            formatter: (cell, row, index) => {
                return <button type='button' name='edit' className='btn btn-warning' onClick={()=>{
                    this.modify(row)
                }} >Save</button>
            }
        }, 
        {
            dataField: 'delete', 
            text: 'Delete',
            editable: false, 
            formatter: (cell, row, index) => {
                return <button type='button' name='delete' className='btn btn-danger' onClick={(event)=>{
                    this.handleClick(event)
                    this.setState({username: row.username})
                }} >Delete</button>
            }
        }
    ]

    form(){
        return (
            <Fragment>
                <fieldset>
                    <label>Username*</label>
                    <input className='form-control' type='text' placeholder='username' name='username' value={this.state.data.username} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                    <label>Password*</label>
                    <input className='form-control' type='password' placeholder='password' name='password' value={this.state.data.password ? this.state.data.password : undefined} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                    <label>Roles*</label>
                    <Select single options={this.state.optionRoles} onChange={(val) => this.setState((prevState) => ({data: {...prevState.data, role: val.value}}))} name='role'/>
                </fieldset>

                <fieldset>
                    <label>First Name</label>
                    <input className='form-control' type='text' placeholder='First Name' name='firstName' value={this.state.data.first_name} onChange={this.handleChange}  />
                </fieldset>

                <fieldset>
                    <label>Last Name</label>
                    <input className='form-control' type='text' placeholder='Last Name' name='lastName' value={this.state.data.last_name} onChange={this.handleChange}  />
                </fieldset>

                <fieldset>
                    <label>Mail</label>
                    <input className='form-control' type='text' placeholder='example@example.com' name='mail' value={this.state.data.mail} onChange={this.handleChange}  />
                </fieldset>
            </Fragment>
            
        )
    }

    render() {
        return (
            <Fragment>
                <div>
                    <h2 className='card-title'>Users Panel</h2>
                    <button type='button' name='create' className='btn btn-primary float-right mb-3' onClick={this.handleClick}>New User</button>
                    <BootstrapTable 
                        keyField='id' 
                        data={this.state.users} 
                        columns={this.column} 
                        striped 
                        pagination={paginationFactory()} 
                        wrapperClasses="table-responsive"
                        cellEdit={ cellEditFactory({ 
                            blurToSave: true,
                            autoSelectText: true,
                            mode: 'click'
                        }) }
                        />
                </div>
                <Modal id='delete' show={this.state.showDelete} onHide={this.resetState} size='sm'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Delete User</h2>
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete {this.state.username} ? 
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-danger' onClick={this.delete}>Delete</button>
                        <button type='button' className='btn btn-info' onClick={() => this.setState({showDelete: false})}>Close</button>
                    </Modal.Footer>
                </Modal>
                <Modal id='create' show={this.state.showCreate} onHide={this.resetState} size='md'>
                    <Modal.Header closeButton>
                        <h2 className='card-title'>Create User</h2>
                    </Modal.Header>
                    <Modal.Body>
                        {this.form()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button type='button' className='btn btn-primary' onClick={this.createUser}>Create</button>
                        <button type='button' className='btn btn-info' onClick={this.resetState}>Close</button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        );
    }
}

export default Users;