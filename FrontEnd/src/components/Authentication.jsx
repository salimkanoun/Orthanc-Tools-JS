import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Form, FormGroup, OverlayTrigger, Row, Tooltip } from 'react-bootstrap';
import jwt_decode from "jwt-decode";

import HelpIcon from '@mui/icons-material/Info';
import { errorMessage } from '../tools/toastify';

import apis from '../services/apis'

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
    <div className='min-vh-100 bg-authentification d-flex align-items-center'>
      <div className='alert alert-danger' style={{ display: state.errorMessage === undefined ? 'none' : '' }}>
        {state.errorMessage}
      </div>
      <Container fluid>
        <Row className="shadow block-title block block-400">
          <Col >
            Orthanc-Tools-JS
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <HelpIcon className="mb-1" data-tip data-for='info1' fontSize="small" />
            </OverlayTrigger>
          </Col>
        </Row>
        <Row className='block-content block block-400'>
          <Form onKeyPress={handleKeyDown}>
            <FormGroup>
              <label>Username*</label>
              <input className='form-control' type='text' placeholder='username' name='username' value={state.username.value} onChange={handleChange} required />
            </FormGroup>

            <FormGroup>
              <label>Password*</label>
              <input className='form-control' type='password' placeholder='password' name='password' value={state.password.value} onChange={handleChange} required />
            </FormGroup>

            <FormGroup className='d-flex justify-content-center mt-3'>
              <Button name='connexion' className='btn btn-dark' onClick={handleClick}> Connect </Button>
            </FormGroup>
          </Form>
        </Row>
      </Container>
    </div>
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
