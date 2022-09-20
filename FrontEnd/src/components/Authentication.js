import React, { Component } from 'react'

import apis from '../services/apis'
import { CSSTransition } from "react-transition-group";

import ReactTooltip from "react-tooltip";
import HelpIcon from '@material-ui/icons/Info';
import { toast } from 'react-toastify';

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

    let answer
    try {
      answer = await apis.authentication.logIn(this.state.username, this.state.password)
    } catch (error) {
      toast.error(error)
    }

    if (answer.errorMessage != null) {
      this.setState({
        errorMessage: answer.errorMessage
      })
    } else {
      this.props.onLogin(answer)
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
                  MTA-AdminMed
                      </div>
                <div className='col-2'>
                  <HelpIcon className="mb-1" data-tip data-for='info1' fontSize="small" />
                  <ReactTooltip place="right" effect="solid" id='info1' type='dark'>
                    <div className="text-left">
                      <span>Tooltip</span>
                      {/* <span>1. Local user : your local username</span>
                      <br></br>
                      <span>exemple : <i>durantLocal</i></span>
                      <br></br>
                      <span>2. Distant user (with domain name): your LDAP/AD username if it contains any domain </span>
                      <br></br>
                      <span>exemple : <i>durantDistant@chu.exemple.fr</i></span>
                      <br></br>
                      <span>3. Distant user (without domain name) : your LDAP/AD username precede to an @ if it not contains any domain </span>
                      <br></br>
                      <span>exemple : <i>@durantDistant</i></span> */}
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
                  <button name='connexion' type='button' className='btn btn-dark' onClick={this.handleClick}> Connect </button>
                </fieldset>

              </form>
            </div>
          </div>
        </div>
      </CSSTransition>
    )
  }
}
