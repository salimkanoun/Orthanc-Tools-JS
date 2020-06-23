import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import apis from '../../services/apis';


class Users extends Component {

    state = {
        data : {
            username: undefined, 
            password: undefined,
            first_name: undefined, 
            last_name: undefined, 
            mail: undefined,
        },
        showModify: false,
        showDelete: false,
        options: []
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.onHide = this.onHide.bind(this)
        this.openModify = this.openModify.bind(this)
        this.getUser = this.getUser.bind(this)
        this.modify = this.modify.bind(this)
        this.delete = this.delete.bind(this)
        this.createUser = this.createUser.bind(this)
    }

    async openModify(){
       let users = await apis.User.getUsers()
       console.log(users)
       let options = []
       users.forEach(element => {
           options.push({
               label: element.username, 
               value: element.username
           })
       })
       this.setState({
           users: users,
           options: options, 
           showModify: true
       })
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

    async modify(){
        await apis.User.modifyUser(this.state.data)
    }

    delete(){
        alert('Delete' + this.state.data.username)
    }

    async createUser(){
        await apis.User.createUser(this.state.data)
    }

    getUser(val){
        let users = this.state.users
        users.forEach(user => {
            if (user.username === val.value){
                let data = {}
                Object.keys(user).forEach(key => {
                    data = {
                        ...data, 
                        [key]: user[key] !== null ? user[key] : '' 
                    }
                })
                this.setState({
                data: data
                })
            }
            
        })
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
                    <input className='form-control' type='password' placeholder='password' name='password' value={this.state.data.password ? this.state.data.password : undefined} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                    <label>Roles*</label>
                    <Select />
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

    onHide(){
        this.setState(prevState => ({
            showModify: !prevState.showModify
        }))
    }

    render() {
        return (
            <Fragment>
                <div>
                    <h2 className='card-title'>Users Panel</h2>
                    <form id='user-form'>

                        {this.form()}

                        <button name='create' type='button' className='btn btn-primary float-right mr-2 mt-2' onClick={this.createUser}> Create </button>

                        <button name='Edit' type='button' className='btn btn-warning float-right mr-2 mt-2' onClick={this.openModify}> Edit </button>
                            
                    </form>
                </div>
                <Modal id='modify' show={this.state.showModify} onHide={this.onHide} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Modify</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <label>Chose user :</label>
                        <Select options={this.state.options} onChange={this.getUser} />
                        {this.form()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button name='Edit' type='button' className='btn btn-warning float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Modify </button>
                        <button name='delete' type='button' className='btn btn-danger float-right mr-2 mt-2' onClick={() => this.setState({showDelete: true})}> Delete </button>
                        <button name='Edit' type='button' className='btn btn-info float-right mr-2 mt-2' onClick={()=>this.setState({showModify: false})}> Close </button>
                    </Modal.Footer>
                </Modal>
                <Modal id='delete' show={this.state.showDelete} onHide={()=>this.setState({showDelete: false})} size='sm'>
                    <Modal.Header closeButton>
                        Delete User
                    </Modal.Header>
                    <Modal.Body>
                        Are You sure to delete {this.state.data.username} ? 
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