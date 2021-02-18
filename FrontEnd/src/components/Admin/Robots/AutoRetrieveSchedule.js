import React, { Component } from 'react'
import { toast } from 'react-toastify';
import apis from '../../../services/apis';

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
      
      apis.options.getServerTime().then((serverTime)=>{
        let cutTime = serverTime.split('T')[1].split('.')[0].split(':');
        this.setState({
          serverTime : cutTime[0]+':'+cutTime[1]
        })
      })

      this.serverTimeInterval = setInterval(()=>{
        apis.options.getServerTime().then((serverTime)=>{
          let cutTime = serverTime.split('T')[1].split('.')[0].split(':');
          this.setState({
            serverTime : cutTime[0]+':'+cutTime[1]
          })
        })
      },30000);

    } catch (error) {
      toast.error(error.statusText)
    }

  }

  componentWillUnmount = ()=>{
    clearInterval(this.serverTimeInterval);
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
      .then(() => { toast.success('schedule updated') })
      .catch(error => { toast.error(error.statusText) })
  }

  render = () => {
    return (
      <div>
        <h2 className="card-title">Retrieve Schedule Time : </h2>
        <div className="form-row">
          <div className="col">
            <label htmlFor='hour_start'>Start Hour : </label>
            <input type='number' name='hour_start' min={0} max={23} className='form-control' onChange={this.handleChange} value={this.state.hourStart} />
          </div>
          <div className="col">
            <label htmlFor='min_start'>Start Minutes : </label>
            <input type='number_start' name='min_start' min={0} max={59} className='form-control' onChange={this.handleChange} value={this.state.minStart} />
          </div>
          <div className="col">
            <label htmlFor='hour_stop'>Stop Hour : </label>
            <input type='number' name='hour_stop' min={0} max={23} className='form-control' onChange={this.handleChange} value={this.state.hourStop} />
          </div>
          <div className="col">
            <label htmlFor='min_stop'>Stop Minutes : </label>
            <input type='number' name='min_stop' min={0} max={59} className='form-control' onChange={this.handleChange} value={this.state.minStop} />
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <p>Server time : {this.state.serverTime}</p>
          <input type='button' className='btn btn-primary' onClick={this.handleClick} value='send' />
        </div>
      </div>

    )
  }

}
