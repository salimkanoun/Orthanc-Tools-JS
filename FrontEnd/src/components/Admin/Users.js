import React, { Component, Fragment } from 'react'
import Select from 'react-select'
import Modal from 'react-bootstrap/Modal';
import apis from '../../services/apis';


class Users extends Component {

    state = { 
        username: '', 
        password: '',
        firstName: '', 
        lastName: '', 
        mail: '', 
        show: false, 
        options: []
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.onHide = this.onHide.bind(this)
        this.modify = this.modify.bind(this)
        this.getUser = this.getUser.bind(this)
    }

    async modify(){
       let users = await apis.User.getUsers()
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
           show: true
       })
    }
    

    handleChange(event) {
        const target = event.target
        const name = target.name
        const value = target.value
        this.setState({
          [name]: value
        })
    }

    getUser(val){
        let users = this.state.users
        users.forEach(user => {
            if (user.username === val.value){
                this.setState({
                    username: user.username,
                    firstName:user.firstName, 
                    lastName: user.lastName, 
                    mail: user.mail, 
                })
            }
        })
    }

    form(){
        return (
            <Fragment>
                <fieldset>
                    <label>Username*</label>
                    <input className='form-control' type='text' placeholder='username' name='username' value={this.state.username} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                    <label>Password*</label>
                    <input className='form-control' type='password' placeholder='password' name='password' value={this.state.password} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                    <label>Roles*</label>
                    <Select />
                </fieldset>

                <fieldset>
                    <label>First Name</label>
                    <input className='form-control' type='text' placeholder='First Name' name='firstName' value={this.state.firstName} onChange={this.handleChange}  />
                </fieldset>

                <fieldset>
                    <label>Last Name</label>
                    <input className='form-control' type='text' placeholder='Last Name' name='lastName' value={this.state.lastName} onChange={this.handleChange}  />
                </fieldset>

                <fieldset>
                    <label>Mail</label>
                    <input className='form-control' type='text' placeholder='example@example.com' name='mail' value={this.state.mail} onChange={this.handleChange}  />
                </fieldset>
            </Fragment>
            
        )
    }

    onHide(){
        this.setState(prevState => ({
            show: !prevState.show
        }))
    }

    render() {
        return (
            <Fragment>
                <div className='jumbotron'>
                    <h2 className='card-title'>Users Panel</h2>
                    <form id='user-form'>

                        {this.form()}

                        <button name='create' type='button' className='btn btn-primary float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Create </button>

                        <button name='Edit' type='button' className='btn btn-warning float-right mr-2 mt-2' onClick={this.modify}> Modify </button>
                            
                        <button name='delete' type='button' className='btn btn-danger float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Delete </button>

                    </form>
                </div>
                <Modal show={this.state.show} onHide={this.onHide} size='xl'>
                    <Modal.Header closeButton>
                        <Modal.Title>Modify</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Select options={this.state.options} onChange={this.getUser} />
                        {this.form()}
                    </Modal.Body>
                    <Modal.Footer>
                        <button name='Edit' type='button' className='btn btn-warning float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Modify </button>
                        <button name='Edit' type='button' className='btn btn-danger float-right mr-2 mt-2' onClick={()=>this.setState({show: false})}> Close </button>
                    </Modal.Footer>
                </Modal>
            </Fragment>
            
        );
    }
}

export default Users;