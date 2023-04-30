import React, { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";

import apis from '../services/apis'
import { CSSTransition } from "react-transition-group";

import HelpIcon from '@mui/icons-material/Info';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { errorMessage } from '../tools/toastify';

export default ({ onLogin }) => {

  const [state, setState] = useState({
    username: '',
    password: '',
    errorMessage: undefined,
    show: false
  })

  useEffect(() => {
    setState((state) => ({
      ...state,
      ['show']: true
    }))
  }, [])

  const handleClick = async () => {
    let token
    try {
      token = await apis.authentication.logIn(state.username, state.password)
      var decoded = jwt_decode(token);
    } catch (error) {
      errorMessage(error)
    }

    if (token?.errorMessage != null) {
      setState((state) => ({
        ...state,
        ['errorMessage']: token.errorMessage
      }))
    } else {
      onLogin(token, decoded)
    }
  }

  const handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value
    setState((state) => ({
      ...state,
      [name]: value
    }))
  }

  /**
   * Redirect press enter to login button
   * @param {*} event 
   */
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleClick()
    }
  }


  return (
    <CSSTransition in={state.show} timeout={1500} classNames='auth'>
      <div className='vertical-center authentification'>
        <div className='text-center' id='login'>
          <div className='alert alert-danger' id='error' style={{ display: state.errorMessage === undefined ? 'none' : '' }}>{state.errorMessage}</div>
          <div className='shadow block-title block block-400'>
            <div className='row'>
              <div className='col-2'>
              </div>
              <div className='col'>
                Orthanc-Tools-JS
              </div>
              <div className='col-2'>
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                  <HelpIcon className="mb-1" data-tip data-for='info1' fontSize="small" />
                </OverlayTrigger>
              </div>
            </div>
          </div>
          <div className='block-content block block-400'>
            <form id='login-form' onKeyPress={handleKeyDown}>
              <fieldset>
                <label>Username*</label>
                <input className='form-control' type='text' placeholder='username' name='username' value={state.username.value} onChange={handleChange} required />
              </fieldset>

              <fieldset>
                <label>Password*</label>
                <input className='form-control' type='password' placeholder='password' name='password' value={state.password.value} onChange={handleChange} required />
              </fieldset>

              <fieldset className='text-right'>
                <Button name='connexion' className='btn btn-dark' onClick={handleClick}> Connect </Button>
              </fieldset>

            </form>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}

const renderTooltip = (props) => (
  <Tooltip id="button-tooltip" {...props}>
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
  </Tooltip>
);
