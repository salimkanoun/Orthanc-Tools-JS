import React, { Component } from 'react'
import { toast } from 'react-toastify';

export default class Options extends Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.state = {
      hour: '00',
      min: '00'
    }
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

  handleChange (event) {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    this.setState({
      [name]: value
    })
  }

  async handleClick () {
    const putString = JSON.stringify({ hour: this.state.hour, min: this.state.min })

    await fetch('/api/options',
      {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: putString
      }).then((answer) => {
      return (answer.json())
    })

    toast.success('Done', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
  });
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
