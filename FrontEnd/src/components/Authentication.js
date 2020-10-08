import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import apis from '../services/apis'
import { CSSTransition } from "react-transition-group";

import ReactTooltip from "react-tooltip";
import HelpIcon from '@material-ui/icons/Info';

export default class Authentication extends Component {

  state = {
    username: '',
    password: '',
    authenthified: undefined,
    errorMessage: undefined,
    show: false
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  componentDidMount() {
    this.setState({
      show: true
    })
  }
  

  async handleClick () {
    
    const postData = {
      username: this.state.username,
      password: this.state.password
    }

    let newState = { }

    await apis.authentication.logIn(postData).then((answer)=>{
    
      console.log(answer)
      // get token from fetch request
      const token = answer;

      newState =  {
        accessCheck : true
      }

    }).catch( async (error) => {
      console.log(error)
      newState =  {
        accessCheck : false,
        errorMessage : await error.text()
      }

    })

    this.setState({
      authenthified: newState.accessCheck,
      errorMessage : newState.errorMessage
    })

    if(newState.accessCheck){
      this.props.setLocation('/query')
    }
    
  }

  handleChange (event) {
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
  handleKeyDown (event) {
    if (event.key === 'Enter') {
      this.handleClick()
    }
  }

  render () {
    if (this.state.authenthified) {
      return <Redirect to='/orthanc-content' />
    }
    return (
        <CSSTransition in={this.state.show} timeout={1500} classNames='auth'>
         <div className='vertical-center'>
            <div className='shadow text-center' id='login'> 
              <div className='alert alert-danger' id='error' style={{ display:  this.state.errorMessage === undefined ?  'none' : '' }}>{this.state.errorMessage}</div>
                  <div className='block-title block block-400'>
                    <div className='row'>
                      <div className='col-2'>
                      </div>
                      <div className='col'>
                        Orthanc-Tools-JS
                      </div>
                      <div className='col-2'>
                        <HelpIcon className="mb-1" data-tip data-for='info1' fontSize="small"/>
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
