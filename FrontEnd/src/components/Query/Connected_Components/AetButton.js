import React, { Component } from 'react'

class AetButton extends Component {

  constructor(props){
    super(props)
    this.doQuery = this.doQuery.bind(this)
  }

  doQuery(){
    
  }

  render () {
    return (
      <div className='col-sm'>
        <input type='button' onClick={this.doQuery} className='btn btn-info btn-large' value={this.props.aetName} />
      </div>)
  }

}

export default AetButton
