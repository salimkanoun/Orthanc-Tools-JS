import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../actions'

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

const mapStateToProps = (state) => {
  return {
  }
}

export default connect(mapStateToProps, actions)(AetButton)
