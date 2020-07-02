
import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';

import apis from '../../../services/apis';


class CreateUser extends Component {

    state = { 
        data : {
            id: '',
            username: '',
            first_name: '', 
            last_name: '', 
            mail: '',
            role: '', 
            password: ''
        }, 
        show: false, 
        optionRoles: []
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.resetState = this.resetState.bind(this)
        this.createUser = this.createUser.bind(this)
    }

    componentDidMount() {
        this.getRoles()
    }
    

    form(){
        return (
            <Fragment>
                <fieldset>
                    <label>Username*</label>
                    <input className='form-control' type='text' placeholder='username' name='username' value={this.state.data.username} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                    <label>Password*</label>
                    <input className='form-control' type='password' placeholder='password' name='password' value={this.state.data.password} onChange={this.handleChange} required />
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

    resetState(){
        this.setState({
            data : {
                id: '',
                username: '',
                first_name: '', 
                last_name: '', 
                mail: '',
                role: '', 
                password: ''
            },
            show: false
        })
        this.props.getUsers()
    }

    async createUser(){
        await apis.User.createUser(this.state.data)
        this.resetState()
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

    render() {
        return (
            <Fragment>
                <button type='button' name='create' className='btn btn-primary float-right mb-3' onClick={() => this.setState({show: true})}>New User</button>
                <Modal id='create' show={this.state.show} onHide={this.resetState} size='md'>
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

export default CreateUser;