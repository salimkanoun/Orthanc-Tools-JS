import React, { Component } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';
import { Row, Col } from 'react-bootstrap';
export default class AutoRetrieveSchedule extends Component {

  /**Init state */
  state = {
    serverTime: '', 
    hourStart: '00',
    minStart: '00',
    hourStop: '00',
    minStop: '00'
  }

  /**
   * Get defined schedule hour and min from backend
   */
  componentDidMount = async () => {
    try {
      const response = await apis.options.getOptions()
      this.setState({
        hourStart: response.hour_start,
        minStart: response.min_start,
        hourStop: response.hour_stop,
        minStop: response.min_stop
      })
      await this.refreshServerTime()

    } catch (error) {
      toast.error(error.statusText)
    }

  }

  refreshServerTime = async () => {

    let serverTime = await apis.options.getServerTime()
    this.setState({
      serverTime : serverTime
    }) 

  }

  /**
   * Store written value in state
   * @param {*} event 
   */
  handleChange = (event) => {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    this.setState({
      [name]: value
    })
  }

  /**
   * Submission of new values of schedule
   */
  handleClick = () => {
    apis.options.setRobotScheduleHour(this.state.hourStart, this.state.minStart, this.state.hourStop, this.state.minStop)
      .then( async () => { 
        this.refreshServerTime()
        toast.success('schedule updated')})
      .catch(error => { toast.error(error.statusText) })
    
  }

  render = () => {
    return (
      <div>
        <h2 className="card-title">Retrieve Schedule Time : </h2>
        <Row className="align-items-center mt-4">
          <Col sm={3}>
            <label htmlFor='hour_start'>Start Hour : </label>
          </Col>
          <Col sm={3}>
            <input type='number' name='hourStart' min={0} max={23} className='form-control' onChange={this.handleChange} value={this.state.hourStart} />
          </Col>
          <Col sm={3}>
            <label htmlFor='min_start'>Start Minutes : </label>
          </Col>
          <Col sm={3}>
            <input type='number_start' name='minStart' min={0} max={59} className='form-control' onChange={this.handleChange} value={this.state.minStart} />
          </Col>
        </Row>
        <Row className="align-items-center mt-4">
          <Col sm={3}>
          <label htmlFor='hour_stop'>Stop Hour : </label>
          </Col>
          <Col sm={3}>
            <input type='number' name='hourStop' min={0} max={23} className='form-control' onChange={this.handleChange} value={this.state.hourStop} />
          </Col>
          <Col sm={3}>
            <label htmlFor='min_stop'>Stop Minutes : </label>
          </Col>
          <Col sm={3}>
            <input type='number' name='minStop' min={0} max={59} className='form-control' onChange={this.handleChange} value={this.state.minStop} />
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <p>Server time : {this.state.serverTime}</p>
          </Col>
          <Col>
            <input type='button' className='otjs-button otjs-button-blue' onClick={this.handleClick} value='Send' />
          </Col>
        </Row>
      </div>

    )
  }

}
