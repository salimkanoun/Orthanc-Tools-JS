import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from '../actions/TableResult'

class ColumnEditor extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return ( 
        <input type="text" placeholder="Modify2" onKeyDown={console.log('ici')} className="form-control "/>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    queries: state.queryList
  }
}

export default connect(mapStateToProps, actions)(ColumnEditor)
