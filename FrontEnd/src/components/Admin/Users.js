import React, { Component } from 'react'
import Select from 'react-select'


class Users extends Component {

    state = { 
        username: '', 
        password: '',
        firstName: '', 
        lastName: '', 
        mail: ''
    }

    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange (event) {
        const target = event.target
        const name = target.name
        const value = target.value
        this.setState({
          [name]: value
        })
    }

    render() {
        return (
            <div className='jumbotron'>
                <h2 className='card-title'>Users Panel</h2>
                <form id='user-form'>

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

                    <button name='create' type='button' className='btn btn-primary float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Create </button>

                    <button name='modify' type='button' className='btn btn-warning float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Modify </button>
                        
                    <button name='delete' type='button' className='btn btn-danger float-right mr-2 mt-2' onClick={()=>alert('not implemented yet')}> Delete </button>

                </form>
            </div>
        );
    }
}

export default Users;