import React, { Component, Fragment } from 'react'
import apis from '../../../services/apis'
import AutoQueryRoot from './AutoQueryRoot'

/**
 * Create Robot button with create robot API action call
 */
export default class CreateRobot extends Component {

  state = {
    projectName: ''
  }

  constructor (props) {
    super(props)
    this.createRobot = this.createRobot.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  /**
   * Take array of retrieve from Redux and build a retrieve Array to send to API
   */
  async createRobot () {
    //Send the retrieve array to back end*
    //SK ICI USERNAME COURRANT A INJECTER
    await apis.retrieveRobot.createRobot("salim", this.state.projectName, this.props.getResultArray())

    this.props.switchTab(AutoQueryRoot.MyRobot)


  }

  /**
   * Fill Robot Name in current state
   * @param {*} event 
   */
  handleChange (event) {
    const target = event.target
    const name = target.name
    const value = target.type === 'checkbox' ? target.checked : target.value

    this.setState({
      [name] : value
    })

  }

  render () {
    return (
        <Fragment>
          <div className="form-group row">
            <label>Project Name :</label>
            <div className="col">
              <input type='text' className="form-control" name='projectName' value={this.state.value} onChange={this.handleChange} />
            </div>
            <div className="col">
              <input type='button' className='btn btn-success' onClick={this.createRobot} value='Add To Robot' />
            </div>
          </div>
        </Fragment>
    )
  }
  
}
