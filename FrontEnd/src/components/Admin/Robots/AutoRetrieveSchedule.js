import React, { Component } from 'react'
import apis from '../../../services/apis';

export default class AutoRetrieveSchedule extends Component {

  /**Init state */
  state = {
    hour: '00',
    min: '00'
  }

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  /**
   * Get defined schedule hour and min from backend
   */
  async componentDidMount () {
    const response = await apis.options.getOptions()
    this.setState({
      hour: response.hour,
      min: response.min
    })
  }

  /**
   * Store written value in state
   * @param {*} event 
   */
  handleChange (event) {
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
  handleClick () {
    apis.options.setRobotScheduleHour(this.state.hour, this.state.min )
  }

  render () {
    return (
        <div>
          <h2 className="card-title">Retrieve Schedule Time : </h2>
          <div className="form-row">
            <div className="col">
              <label htmlFor='hour'>Hour : </label>
              <input type='number' name='hour' min={0} max={23} className='form-control' onChange={this.handleChange} value={this.state.hour} />
            </div>
            <div className="col">
              <label htmlFor='min'>Minutes : </label>
              <input type='number' name='min' min={0} max={59} className='form-control' onChange={this.handleChange} value={this.state.min} />
            </div>
          </div>
          <div className="text-right">
            <input type='button' className='btn btn-primary' onClick={this.handleClick} value='send' />
          </div>
      </div>

    )
  }

}
