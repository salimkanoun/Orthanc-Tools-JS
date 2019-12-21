import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'

export default class Authentication extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      username: '',
      password: '',
      authenthified: false,
      showError: false
    }
  }

  async handleClick () {
    const postString = JSON.stringify({
      username: this.state.username,
      password: this.state.password
    })

    const accessCheck = await fetch('/authentication',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: postString
      }).then((answer) => {
      return (answer.json())
    })

    this.setState({
      ...this.state,
      authenthified: accessCheck,
      showError: !accessCheck
    })
  }

  handleChange (event) {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({
      [name]: value
    })
  }

  render () {
    console.log(this.state)
    if (this.state.authenthified) {
      return <Redirect to='/query' />
    }
    return (
      <>
        <div className='alert alert-danger' id='error' style={{ display: this.state.showError ? '' : 'none' }}>Wrong Credentials</div>
        <div className='jumbotron ' id='login'>
          <div className='block-title block block-400'>Authentication</div>
          <div className='block-content block block-400'>
            <form id='login-form'>
              <fieldset>
                <label>Username*</label>
                <input className='form-control' type='text' placeholder='username' name='username' value={this.state.username.value} onChange={this.handleChange} required />
              </fieldset>

              <fieldset>
                <label>Password*</label>
                <input className='form-control' type='password' placeholder='password' name='password' value={this.state.password.value} onChange={this.handleChange} required />
              </fieldset>

              <fieldset className='text-right'>
                <button name='connexion' type='button' className='btn btn-dark' onClick={this.handleClick}> Connect </button>
              </fieldset>

            </form>
          </div>
        </div>
      </>
    )
  }
}
