import React, {Component, Fragment} from 'react'
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis';

import CreateUser from './CreateUser'
import {toast} from 'react-toastify';
import UserTable from "./UserTable";


export default class Users extends Component {

    state = {
        username: '',
        users: [],
        roles: [],
        showDelete: false,
    }

    async componentDidMount() {
        this.getUsers();
        this.getRoles();
    }

    getRoles = () => {
        apis.role.getRoles().then(roles => {
            this.setState({roles: roles.map(r => r.name)})
        })
    }

    getUsers = async () => {
        let users = []

        try {
            let answer = await apis.User.getUsers()
            answer.forEach((user) => {
                users.push({
                    ...user,
                    password: ''
                })
            })
        } catch (error) {
            toast.error(error.statusText)
        }

        this.setState({
            users: users,
        })
    }

    resetState = () => {
        this.setState({
            showDelete: false
        })
        this.getUsers()
    }

    modify = async (row) => {

        let password = row.password == null ? null : row.password

        await apis.User.modifyUser(
            row.username,
            row.firstname,
            row.lastname,
            row.email,
            row.role,
            password,
            row.superAdmin
        ).then(() => {
            toast.success('User modified')
            this.resetState()
        }).catch((error) => toast.error(error.statusText))
    }

    delete = () => {
        if (this.state.userId !== '') {

            apis.User.deleteUser(this.state.username).then(() => {
                toast.success('Deleted User')
                this.resetState()
            }).catch((error) => {
                toast.error(error.statusText)
            })
        }
    }

    changeHandler = (initialValue, value, row, column) => {
        let users = this.state.users;
        users.find(user => user.username === row.username)[column] = value;
        this.setState({users});
    }

    render = () => {
        return (
            <Fragment>
                <div>
                    <h2 className='card-title'>Local Users</h2>
                    <CreateUser getUsers={this.getUsers}/>
                    <UserTable users={this.state.users} roles={this.state.roles} modify={this.modify}
                               setDelete={(username, userId) => {
                                   this.setState({
                                       username,
                                       userId,
                                       showDelete: true
                                   })
                               }} onUserUpdate={this.changeHandler}/>
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
                        <button type='button' className='btn btn-info'
                                onClick={() => this.setState({showDelete: false})}>Close
                        </button>
                    </Modal.Footer>
                </Modal>

            </Fragment>

        );
    }
}