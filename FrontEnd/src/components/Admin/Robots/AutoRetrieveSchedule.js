import React, { useState } from 'react'
import { Row, Col, Form, FormGroup, Button } from 'react-bootstrap';

import apis from '../../../services/apis';
import { keys } from '../../../model/Constant';
import { errorMessage, successMessage } from '../../../tools/toastify';
import { useCustomMutation, useCustomQuery } from '../../../services/ReactQuery/hooks';

export default () => {

  const [retrieveTime, setRetrieveTime] = useState({
    hourStart: undefined,
    minStart: undefined,
    hourStop: undefined,
    minStop: undefined
  })

  /**
   * Get defined schedule hour and min from backend
   */
  useCustomQuery(
    [keys.OPTIONS_KEY],
    () => apis.options.getOptions(),
    undefined,
    undefined,
    (answer) => {
      setRetrieveTime({
        hourStart: answer.hour_start,
        hourStop: answer.hour_stop,
        minStart: answer.min_start,
        minStop: answer.min_stop
      })
    }
  )

  const { data: serverTime } = useCustomQuery(
    [keys.TIME],
    () => apis.options.getServerTime(),
  )

  /**
   * Store written value in state
   * @param {*} event 
   */
  const handleChange = (key, value) => {
    setRetrieveTime((infoTime) => ({
      ...infoTime,
      [key]: value
    })
    )
  }

  const retrieveSchedulorMutator = useCustomMutation(
    ({ retrieveTime }) => apis.options.setRobotScheduleHour(retrieveTime.hourStart, retrieveTime.minStart, retrieveTime.hourStop, retrieveTime.minStop),
    [keys.OPTIONS_KEY],
    () => successMessage('Updated'),
    () => errorMessage('Failure')
  )

  return (
    <Form>
      <h2 className="card-title">Retrieve Schedule Time : </h2>

      <Row>
        <Col>
          <FormGroup>
            <Form.Label> Start Hour : </Form.Label>
            <Form.Control type="number" value={retrieveTime?.hourStart} min={0} max={23} onChange={(event) => (handleChange('hourStart', event.target.value))} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Form.Label> Start Minutes :</Form.Label>
            <Form.Control type="number" value={retrieveTime?.minStart} min={0} max={59} onChange={(event) => (handleChange('minStart', event.target.value))} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormGroup>
            <Form.Label> Stop Hour : </Form.Label>
            <Form.Control type="number" value={retrieveTime?.hourStop} min={0} max={23} onChange={(event) => (handleChange('hourStop', event.target.value))} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Form.Label> Stop Minutes : </Form.Label>
            <Form.Control type="number" value={retrieveTime?.minStop} min={0} max={59} onChange={(event) => (handleChange('minStop', event.target.value))} />
          </FormGroup>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Form.Label>Server time : {serverTime}</Form.Label>
        </Col>
        <Col className='d-flex justify-content-end'>
          <Button className='otjs-button otjs-button-blue' onClick={() => retrieveSchedulorMutator.mutate({ retrieveTime })}> Send </Button>
        </Col>
      </Row>
    </Form>
  )
}
