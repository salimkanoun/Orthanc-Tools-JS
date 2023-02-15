import React, { useState } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import { Row, Col, Form, FormGroup, Button } from 'react-bootstrap';
import { useCustomQuery } from '../../CommonComponents/ReactQuery/hooks';

export default () => {

  /*Init state */
  const [name, setName] = useState()
  const [serverTime, setServerTime] = useState('')
  const [infoTime, setInfoTime] = useState({
    hourStart: '00',
    minStart: '00',
    hourStop: '00',
    minStop: '00'
  })

  /**
   * Get defined schedule hour and min from backend
   */

  const { isLoading: isLoadingTime } = useCustomQuery(
    ['time'],
    () => apis.options.getOptions(),
    undefined,
    undefined,
    (answer) => {
      setInfoTime({
        hourStart: answer.hour_start,
        hourStop: answer.hour_stop,
        minStart: answer.min_start,
        minStop: answer.min_stop
      })
    }
  )

  const { isLoading: isLoadingRefresh, refetch } = useCustomQuery(
    ['server'],
    () => apis.options.getServerTime(),
    undefined,
    undefined,
    (answer) => {
      setServerTime(answer)
    }
  )

  /**
   * Store written value in state
   * @param {*} event 
   */
  const handleChange = (key, value) => {
    setInfoTime((infoTime) => ({
      ...infoTime,
      [key]: value
    })
    )
  }

  /**
   * Submission of new values of schedule
   */
  const handleClick = () => {
    apis.options.setRobotScheduleHour(...infoTime)
      .then(async () => {
        refetch()
        toast.success('schedule updated', { data: { type: 'notification' } })
      })
      .catch(error => { toast.error(error.statusText, { data: { type: 'notification' } }) })

  }


  return (
    <Form>
      <h2 className="card-title">Retrieve Schedule Time : </h2>

      <Row>
        <Col>
          <FormGroup>
            <Form.Label> Start Hour : </Form.Label>
            <Form.Control type="number" value={infoTime.hourStart} min={0} max={23} onChange={(event) => (handleChange('hourStart', event.target.value))} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Form.Label> Start Minutes :</Form.Label>
            <Form.Control type="number" value={infoTime.minStart} min={0} max={59} onChange={(event) => (handleChange('minStart', event.target.value))} />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col>
          <FormGroup>
            <Form.Label> Stop Hour : </Form.Label>
            <Form.Control type="number" value={infoTime.hourStop} min={0} max={23} onChange={(event) => (handleChange('hourStop', event.target.value))} />
          </FormGroup>
        </Col>
        <Col>
          <FormGroup>
            <Form.Label> Stop Minutes : </Form.Label>
            <Form.Control type="number" value={infoTime.minStop} min={0} max={59} onChange={(event) => (handleChange('minStop', event.target.value))} />
          </FormGroup>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Form.Label>Server time : {serverTime}</Form.Label>
        </Col>
        <Col>
          <Button className='otjs-button otjs-button-blue' onClick={handleClick}> Send </Button>
        </Col>
      </Row>
    </Form>

  )

}
