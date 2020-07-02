import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'
import cellEditFactory from 'react-bootstrap-table2-editor'

import apis from '../../../services/apis';

import CreateUser from './CreateUser'


class Users extends Component {

    state = {
        password: undefined,
        username: '',
        users: [],
        showDelete: false,
        optionRoles: [],
    }

    async componentDidMount() {
        this.getUsers()
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.modify = this.modify.bind(this)
        this.delete = this.delete.bind(this)
        this.resetState = this.resetState.bind(this)
        this.getUsers = this.getUsers.bind(this)
    }

    async getUsers(){
       let answer = await apis.User.getUsers()
       let users = []
       answer.forEach((user) => {
           users.push({
               ...user, 
               password: undefined
           })
       })
       this.setState({
           users: users, 
       })
    }

    resetState(){
        this.setState({
            password: undefined,
            showDelete: false
        })
        this.getUsers()
    }
    
    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value
        this.setState({
            [name]: value
        })
    }

    async modify(row){
        let payload = {}
        if (this.state.password === ''){
            payload = {
                ...row, 
                password: null
            }
        } else {
            payload = {
                ...row, 
                password: this.state.password
            }
        }
        await apis.User.modifyUser(payload).then(()=>{
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

    column = [
        {
            dataField: 'id', 
            hidden: true
        }, {
            dataField: 'username', 
            text: 'Username', 
            sort: true, 
            editable: false
        }, {
            dataField: 'first_name', 
            text: 'First name', 
            sort: true
        }, {
            dataField: 'last_name', 
            text: 'Last name', 
            sort: true
        }, {
            dataField: 'mail', 
            text: 'Mail', 
            sort: true
        }, {
            dataField: 'role', 
            text: 'Role', 
            sort: true
        }, {
            dataField: 'password', 
            text: 'New Password', 
            editable: false,
            formatter: (cell, row, index) => {
                return (
                    <input name='password' type="password" className="form-control" placeholder="Password" onChange={this.handleChange}></input>
                )
            }
        }, {
            dataField: 'edit', 
            text: 'Edit',
            editable: false,
            formatter: (cell, row, index) => {
                return <button type='button' name='edit' className='btn btn-warning' onClick={()=>{
                    this.modify(row)
                }} >Save</button>
            }
        }, {
            dataField: 'delete', 
            text: 'Delete',
            editable: false, 
            formatter: (cell, row, index) => {
                return <button type='button' name='delete' className='btn btn-danger' onClick={(event)=>{
                    this.setState({username: row.username, showDelete: true})
                }} >Delete</button>
            }
        }
    ]

    render() {
        return (
            <Fragment>
                <div>
                    <h2 className='card-title'>Users Panel</h2>
                    <CreateUser getUsers={this.getUsers}/>
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
                
            </Fragment>
            
        );
    }
}

export default Users;