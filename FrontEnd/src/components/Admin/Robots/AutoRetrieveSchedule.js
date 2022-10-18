import React, { Component, useState } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import { Row, Col } from 'react-bootstrap';

export default ({ }) => {

  /*Init state */
  const [name, setName] = useState()
  const [serverTime, setServerTime] = useState('')
  const [hourStart, setHourStart] = useState('00')
  const [minStart, setMinStart] = useState('00')
  const [hourStop, setHourStop] = useState('00')
  const [minStop, setMinStop] = useState('00')

  /**
   * Get defined schedule hour and min from backend
   */
  const componentDidMount = async () => {
    try {
      const response = await apis.options.getOptions()
      setHourStart(response.hour_start)
      setMinStart(response.min_start)
      setHourStop(response.hour_stop)
      setMinStop(response.min_stop)

      await refreshServerTime()

    } catch (error) {
      toast.error(error.statusText)
    }

  }

  const refreshServerTime = async () => {
    let serverTime = await apis.options.getServerTime()
    setServerTime(serverTime)
  }

  /**
   * Store written value in state
   * @param {*} event 
   */
  const handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    setName(value)
  }

  /**
   * Submission of new values of schedule
   */
  const handleClick = () => {
    apis.options.setRobotScheduleHour(hourStart, minStart, hourStop, minStop)
      .then(async () => {
        refreshServerTime()
        toast.success('schedule updated')
      })
      .catch(error => { toast.error(error.statusText) })

  }

  return (
    <div>
      <h2 className="card-title">Retrieve Schedule Time : </h2>
      <Row className="align-items-center mt-4">
        <Col sm={3}>
          <label htmlFor='hour_start'>Start Hour : </label>
        </Col>
        <Col sm={3}>
          <input type='number' name='hourStart' min={0} max={23} className='form-control' onChange={handleChange} value={hourStart} />
        </Col>
        <Col sm={3}>
          <label htmlFor='min_start'>Start Minutes : </label>
        </Col>
        <Col sm={3}>
          <input type='number_start' name='minStart' min={0} max={59} className='form-control' onChange={handleChange} value={minStart} />
        </Col>
      </Row>
      <Row className="align-items-center mt-4">
        <Col sm={3}>
          <label htmlFor='hour_stop'>Stop Hour : </label>
        </Col>
        <Col sm={3}>
          <input type='number' name='hourStop' min={0} max={23} className='form-control' onChange={handleChange} value={hourStop} />
        </Col>
        <Col sm={3}>
          <label htmlFor='min_stop'>Stop Minutes : </label>
        </Col>
        <Col sm={3}>
          <input type='number' name='minStop' min={0} max={59} className='form-control' onChange={handleChange} value={minStop} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <p>Server time : {serverTime}</p>
        </Col>
        <Col>
          <input type='button' className='otjs-button otjs-button-blue' onClick={handleClick} value='Send' />
        </Col>
      </Row>
    </div>

  )

}
