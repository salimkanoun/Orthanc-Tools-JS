import React, { Component } from 'react'

export default class AetButton extends Component {
  render = () => {
    return (
      <input type='button' className='btn btn-info btn-large mt-3 mr-3' value={this.props.aetName} onClick={this.props.clickListner} />
    )
  }
}
