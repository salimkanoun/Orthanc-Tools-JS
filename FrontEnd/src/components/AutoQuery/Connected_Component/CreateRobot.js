import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import apis from '../../../services/apis'

/**
 * Create Robot button with create robot API action call
 */
class CreateRobot extends Component {

  state = {
    projectName: ''
  }

  /**
   * Take array of retrieve from Redux and build a retrieve Array to send to API
   */
  createRobot = async () => {
    //Send the retrieve array to back end*
    await apis.retrieveRobot.createRobot( this.props.username, this.state.projectName, this.props.getResultArray())
    this.props.switchTab('MyRobot')
  }

  /**
   * Fill Robot Name in current state
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

  render = () => {
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

const mapStateToProps = (state) => {
  return {
    username: state.OrthancTools.username
  }
}

export default connect(mapStateToProps, null)(CreateRobot)
