import React, { Component } from 'react'
import jwt_decode from "jwt-decode";

import apis from '../services/apis'
import { CSSTransition } from "react-transition-group";

import ReactTooltip from "react-tooltip";
import HelpIcon from '@mui/icons-material/Info';
import { toast } from 'react-toastify'
import { Button } from 'react-bootstrap';

export default class Authentication extends Component {

  state = {
    username: '',
    password: '',
    errorMessage: undefined,
    show: false
  }

  componentDidMount = () => {
    this.setState({
      show: true
    })
  }


  handleClick = async () => {

    let token
    try {
      token= await apis.authentication.logIn(this.state.username, this.state.password)
      var decoded = jwt_decode(token);
    } catch (error) {
      toast.error(error, {data:{type:'notification'}})
    }

    if (token?.errorMessage != null) {
      this.setState({
        errorMessage: token.errorMessage
      })
    } else {
      console.log(token)
      this.props.onLogin(token, decoded)
    }




  }

  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    this.setState({
      [name]: value
    })
  }

  /**
   * Redirect press enter to login button
   * @param {*} event 
   */
  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleClick()
    }
  }

  render = () => {
    return (
      <CSSTransition in={this.state.show} timeout={1500} classNames='auth'>
        <div className='vertical-center authentification'>
          <div className='text-center' id='login'>
            <div className='alert alert-danger' id='error' style={{ display: this.state.errorMessage === undefined ? 'none' : '' }}>{this.state.errorMessage}</div>
            <div className='shadow block-title block block-400'>
              <div className='row'>
                <div className='col-2'>
                </div>
                <div className='col'>
                  Orthanc-Tools-JS
                      </div>
                <div className='col-2'>
                  <HelpIcon className="mb-1" data-tip data-for='info1' fontSize="small" />
                  <ReactTooltip place="right" effect="solid" id='info1' type='dark'>
                    <div className="text-left">
                      <span>1. Local user : your local username</span>
                      <br></br>
                      <span>exemple : <i>durantLocal</i></span>
                      <br></br>
                      <span>2. Distant user (with domain name): your LDAP/AD username if it contains any domain </span>
                      <br></br>
                      <span>exemple : <i>durantDistant@chu.exemple.fr</i></span>
                      <br></br>
                      <span>3. Distant user (without domain name) : your LDAP/AD username precede to an @ if it not contains any domain </span>
                      <br></br>
                      <span>exemple : <i>@durantDistant</i></span>
                    </div>
                  </ReactTooltip>
                </div>
              </div>
            </div>
            <div className='block-content block block-400'>
              <form id='login-form' onKeyPress={this.handleKeyDown}>
                <fieldset>
                  <label>Username*</label>
                  <input className='form-control' type='text' placeholder='username' name='username' value={this.state.username.value} onChange={this.handleChange} required />
                </fieldset>

                <fieldset>
                  <label>Password*</label>
                  <input className='form-control' type='password' placeholder='password' name='password' value={this.state.password.value} onChange={this.handleChange} required />
                </fieldset>

                <fieldset className='text-right'>
                  <Button name='connexion' className='btn btn-dark' onClick={this.handleClick}> Connect </Button>
                </fieldset>

              </form>
            </div>
          </div>
        </div>
      </CSSTransition>
    )
  }
}
