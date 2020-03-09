import React, { Component } from 'react'

class AetButton extends Component {

  render () {
    return (
      <div className='col-sm'>
        <input type='button' onClick={this.doQuery} className='btn btn-info btn-large' value={this.props.aetName} onClick={this.props.clickListner}/>
      </div>
    )
  }

}

export default AetButton
