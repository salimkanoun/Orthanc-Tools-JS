import React, { Component } from 'react'

export default class AetButton extends Component {

  render () {
    return (
      <div className='col-sm'>
        <input type='button' className='btn btn-info btn-large' value={this.props.aetName} onClick={this.props.clickListner}/>
      </div>
    )
  }

}
