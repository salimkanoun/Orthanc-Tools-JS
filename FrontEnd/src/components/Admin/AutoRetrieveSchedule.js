import React, { Component } from 'react'
import { toast } from 'react-toastify';

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
    const response = await fetch('/api/options').then((answer) => { return answer.json() })
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

    fetch('/api/options', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ hour: this.state.hour, min: this.state.min })

    }).then((answer) => {
        if (!answer.ok) { throw answer }
        return (answer.json())

    }).then(() => {
      toast.success('Done', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })

    }).catch(error => {
      toast.error(error.statusText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
      })
    })


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
