import React, { Component, Fragment } from 'react'
import Modal from 'react-bootstrap/Modal';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator'
import cellEditFactory from 'react-bootstrap-table2-editor'

import apis from '../../../services/apis';

import CreateUser from './CreateUser'
import InputPassword from './InputPassword'


class Users extends Component {

    state = {
        username: '',
        users: [],
        showDelete: false,
    }

    async componentDidMount() {
        this.getUsers()
    }

    constructor(props) {
        super(props)
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
               password: ''
           })
       })
       this.setState({
           users: users, 
       })
    }

    resetState(){
        this.setState({
            showDelete: false
        })
        this.getUsers()
    }

    async modify(row){
        let payload = {...row}
        if (row.password === ''){
            payload = {
                ...payload, 
                password: null
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
            style: {
                'fontSize': '0px'
            },
            editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
                <InputPassword {...editorProps} previousPassword={value} />
              )
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
                    <h2 className='card-title'>Local Users Panel</h2>
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